const {WebSocketServer} = require('ws')
const wss = new WebSocketServer({noServer:true})
const jwt = require('jsonwebtoken')
const {decode, verify} = require("jsonwebtoken");
const {isEmpty} = require("lodash/lang.js");
const router = require('express').Router()
const wssMap = {}
const groups = {}
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
            switch (event){
                case 'get-participants':
                    const {user} = data
                    if(!user && isEmpty(user)){
                        return wss.send('user id not involved')
                    }
                    console.log(user)
                    if(!groups[accessToken]){
                        groups[accessToken] = {}
                    }
                    jwt.verify(accessToken,'game',{},(err,decode)=>{
                        if(err){
                            return console.log(err)
                        }
                        if(decode.creatorId === user.id){
                            groups[accessToken][user.id] = {wss,role:'creator'}
                            sendParticipants(groups[accessToken])
                        }else{
                            groups[accessToken][user.id] = {wss,role:'invitee'}
                            sendParticipants(groups[accessToken])
                        }
                    })
                    break;
                case 'add-participant':
                    const {id,creatorId} = JSON.parse(message)
                    if(!id){
                        return console.log('id does not exist')
                    }
                    if(!creatorId){
                        return console.log('creator not found')
                    }
                    groups[accessToken][id]?.wss.send('accepted')

            }
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
                .filter(value=>value!==key)
            if(!isEmpty(invites)){
                group[key].wss
                    .send(JSON.stringify(invites))
            }

        }
    }
}

module.exports = {
    router,
    wss
}
