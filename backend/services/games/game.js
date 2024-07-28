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
        console.log(typeof message)
        if(checkIfJson(message)){
            const {accessToken,user} = JSON.parse(message)
            if(!accessToken){
                return wss.send('access token not involved')
            }
            if(!user){
                return wss.send('user id not involved')
            }
            console.log(user.id)
            if(!groups[accessToken]){
                groups[accessToken] = {wss:null,invite:[]}
            }
            jwt.verify(accessToken,'game',{},(err,decode)=>{
                if(err){
                    return console.log(err)
                }
                if(decode.creatorId === user.id){
                    console.log('created')
                    groups[accessToken].wss = wss
                    if(!isEmpty(groups[accessToken].invite)){
                        wss.send(JSON.stringify(groups[accessToken].invite))
                    }
                }else{
                    const alreadyAdded = groups[accessToken].invite.find((value)=>{
                       return value.id === user.id
                    })
                    if(!alreadyAdded){
                        groups[accessToken].invite.push(user)
                    }
                    if(groups[accessToken].wss){
                        console.log('sent')
                        groups[accessToken].wss.send(JSON.stringify(groups[accessToken].invite))
                    }
                }
            })
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

module.exports = {
    router,
    wss
}
