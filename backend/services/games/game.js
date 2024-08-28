const {WebSocketServer} = require('ws')
const wss = new WebSocketServer({noServer:true})
const jwt = require('jsonwebtoken')
const {decode, verify} = require("jsonwebtoken");
const {isEmpty} = require("lodash/lang.js");
const {getContestQuestion} = require("../../gateways/database");
const {language} = require("googleapis/build/src/apis/language");
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
                const {user,id,creatorId,answer,completeTime} = data || {}
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
                        getContestQuestion('python').then((value)=>{
                            sendToAllParticipants({event:"question",data:{question:value['question'],time:Date.now()+30000}},groups[accessToken])
                            setTimeout(()=>{
                                sendToAllParticipants({event:"start-timeout",data:true},groups[accessToken])
                            },30000)
                        })
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
module.exports = {
    router,
    wss
}
