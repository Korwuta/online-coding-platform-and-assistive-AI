const {WebSocketServer} = require('ws')
const wss = new WebSocketServer({noServer:true})
const jwt = require('jsonwebtoken')
const {decode, verify} = require("jsonwebtoken");
const {isEmpty} = require("lodash/lang.js");
const {getContestQuestion, getCodeDependency} = require("../../gateways/database");
const {language} = require("googleapis/build/src/apis/language");
const Path = require("path");
const fs = require("fs");
const {exec} = require("child_process");
const {PythonShell} = require("python-shell");
const vm = require("vm");
const router = require('express').Router()
const wssMap = {}
const groups = {}
const answer = {}
router.post('/create-link',(req,res)=>{
    const {creatorId} = req.body;
    if(!creatorId){
        return res.json({error:'an error occurred'})
    }
    const token = jwt.sign({creatorId},'game',{expiresIn:'6hr'})
    console.log(token)
    res.json({accessToken:token})
})
wss.on('connection',(ws)=>{
    handleWebSocket(ws)
});
wss.on('close',(ws)=>{
    ws.send('closing')
})

function handleWebSocket(wss){
    wss.on('message',(message)=>{
        wss.on('error',()=>{
            return wss.send('error occurred')
        });
        if(isEmpty(message)){
            return wss.send('invalid body')
        }
        if(checkIfJson(message)){
            const {event,accessToken,data} = JSON.parse(message)
            if(!accessToken){
                return wss.send('access token not involved')
            }
            jwt.verify(accessToken,'game',{},(err,decode)=>{
                if(err){
                    return console.log(err)
                }
                const {user,id,creatorId,answer,completeTime,language,question_id} = data || {}
                switch (event){
                    case 'get-participants':
                        if(!user && isEmpty(user)){
                            return wss.send('user id not involved')
                        }
                        console.log(user)
                        if(!groups[accessToken]){
                            groups[accessToken] = {}
                        }
                        if(decode.creatorId === user.id){
                            if(!(id in groups[accessToken])){
                                groups[accessToken][user.id] = {wss,role:'creator',status:'accepted'}
                            }
                            sendParticipants(groups[accessToken])
                        }else{
                            if(!(id in groups[accessToken])){
                                groups[accessToken][user.id] = {wss,role:'invitee',status:'unaccepted'}
                            }
                            sendParticipants(groups[accessToken])
                        }
                        break;
                    case 'add-participant':
                        if(!id){
                            return console.log('id does not exist')
                        }
                        if(!creatorId){
                            return console.log('creator not found')
                        }
                        if(creatorId===decode.creatorId){
                            groups[accessToken][id].status = 'accepted'
                            sendToAcceptedParticipants(groups[accessToken],id,creatorId)
                            sendParticipants(groups[accessToken])
                            return
                        }
                        break;
                    case 'start-contest':
                        const timeout = 10000
                        getContestQuestion('python').then((value)=>{
                            sendToAllParticipants({event:"question",data:{question:{id:value['question_id'],text:value['question']},time:Date.now()+timeout}},groups[accessToken])
                            setTimeout(()=>{
                                sendToAllParticipants({event:"start-timeout",data:true},groups[accessToken])
                            },timeout)
                        }).catch((err=>console.log(err)))
                        break
                    case 'start-session':
                        thosePlaying(groups[accessToken],id)
                        sendToAllParticipants({event:"start-session",data:{time:Date.now()+200000}},groups[accessToken])
                        setTimeout(()=>{
                            sendToAllParticipants({event:"game-end",data:true},groups[accessToken])
                        },200000)
                        break
                    case 'send-answer':
                        console.log(completeTime)
                        groups[accessToken][id].status = 'finished'
                        groups[accessToken][id].finishTime = completeTime
                        for(let key in groups[accessToken]){
                            if(key!==id){
                                console.log(key)
                                groups[accessToken][key].wss.send(JSON.stringify({event:'finish',data:{id,completeTime}}))
                            }
                        }
                        console.log(answer,language,question_id)
                        isRight(answer,language,question_id).then((right)=>{
                            if(right){
                                if(!Object.keys(groups[accessToken])
                                    .map(id => groups[accessToken][id]?.isWinner)
                                    .some(value=>!!value)){
                                    console.log('here')
                                    groups[accessToken][id].isWinner = true
                                    sendToAllParticipants({event:"winner",data:{id:id}},groups[accessToken])
                                }
                            }
                        }).catch((err)=>console.log(err))
                }
            })

        }else{

        }

    })
}

function checkIfJson(JsonString){
    try{
        JSON.parse(JsonString)
        return true
    }catch (err){
        return false
    }

}
function sendParticipants(group){
    for(let key in group){
        if(group[key].role==='creator'){
            const invites = Object.keys(group)
                .filter(value=>value!==key).map((value)=>({id:value,status:group[value].status}))
            console.log(invites)
            if(!isEmpty(invites)){
                group[key].wss
                    .send(JSON.stringify({event:'send-request',data:invites}))
            }

        }
    }
}
function sendToAcceptedParticipants(group,id,creatorId){
    const accepted = []
    for(let key in group){
        if(key !== id && key === creatorId && group[key].status === 'accepted'){
            accepted.push({id:key,status:"accepted"})
        }
    }
    group[id].wss.send(JSON.stringify({event:'request-accepted',data:accepted}))
}
function thosePlaying(group,id){
    const accepted = []
    for(let key in group){
        if(key !== id && group[key].status === 'accepted'){
            accepted.push(key)
        }
    }
    group[id].wss.send(JSON.stringify({event:'those-playing',data:accepted}))
}
function sendToAllParticipants(message,group){
    for(let key in group){
        group[key].wss.send(JSON.stringify(message))
    }
}

async function isRight(answer,language1,questionId){
    const language = language1.toLowerCase()
    let notError = false
    try{
        switch (language){
            case 'java':
                notError = await runJavaCode(answer)
                console.log(notError)
                if(notError){
                    const answer_key = (await getCodeDependency(questionId))['answer_key']
                    console.log(answer_key)
                    return containString(answer,answer_key)
                }
                return false
            case 'python':
                notError = await runPython(answer)
                console.log(notError)
                if(notError){
                    const answer_key = (await getCodeDependency(questionId))['answer_key']
                    console.log(answer_key+'dfjljlkdjfls')
                    console.log(containString(answer,answer_key))
                    console.log(answer+'\n',answer_key)
                    return containString(answer,answer_key)
                }
                return false
            case 'javascript':
                notError = await runJavaScript(answer)
                if(notError){
                    const answer_key = (await getCodeDependency(questionId))['answer_key']
                    return containString(answer,answer_key)
                }
                return false
        }
    }catch (err){
        return false
    }
}
function runJavaCode(userCode){
    const filePath = Path.join(__dirname,`../../temp/${Math.floor(Math.random()*1e19)}.java`)
    return new Promise((resolve,reject)=>{
        fs.writeFile(filePath, userCode, (err) => {
            // Compile the Java file
            exec(`java ${filePath}`, (compileErr, compileStdout, compileStderr) => {
                fs.unlink(filePath,()=>{});
                resolve(!compileErr)
            });
        });
    })

}
function runPython(userCode,res){
    const id = Math.floor(Math.random()*1e19)
    const filePath = Path.join(__dirname,`../../temp/${id}.py`)
    const options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: './temp',
    }
    return new Promise((resolve,reject)=>{
        fs.writeFile(filePath,userCode,(err)=>{
            if (err) {
                return res.json({output:['internal error']})
            }
            PythonShell.run(`${id}.py`,options).then((result)=>{
                fs.unlink(filePath,()=>{})
                resolve(true)
            }).catch((err)=>{
                console.log(err)
                resolve(false)
            })
        })
    })
}
function runJavaScript(userCode){
    let output = [];
    const sandbox = {
        console: {
            log: (...args) => output.push(args.join(' '))
        }
    }
    return new Promise((resolve, reject)=>{
        try {
            const script = new vm.Script(`${userCode}`);
            script.runInNewContext(sandbox, { timeout: 5000 });
            resolve(true)
        } catch (error) {
            let errorDetail = {
                name:error.stack.substring(0,error.stack.indexOf('SyntaxError')).
                replace("evalmachine.<anonymous>","LINE"),
                message:error.message
            }
            resolve(false)
        }
    })
}

function containString(string,substring){
    return string
        .trim()
        .split(' ')
        .join('')
        .includes(substring.trim().split(' ').join(''))
}
module.exports = {
    router,
    wss
}
