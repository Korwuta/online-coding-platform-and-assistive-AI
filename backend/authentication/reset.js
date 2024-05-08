const crypt = require('crypto')
const app = require('express').Router()
const fs = require('fs')
const Path = require('path')
const nodemailer = require('nodemailer')
const {padEnd} = require("lodash/string");
const mailer = require('../mail-sender')
app.post('/token/:resetToken',(req
                       ,res)=>{
    let users = JSON.parse(fs.readFileSync(Path.join(__dirname,'../users')).toString())
    let user = users.find((user)=>{return user.resetToken===req.params.resetToken})
    console.log(user)
    if(!user){
        return res.status(400).json({message:'User does not exist'})
    }
    let {newPassword} = req.body
    console.log(req.body)
    if(!(newPassword||"").match(
        /^(?=.*\d)(?=.*["#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~])(?=.*[A-Z])["\w#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~]+$/
    )){
        return res.status(400).json({message:'Invalid password format'})
    }
    console.log(user.password.data)
    let salt = crypt.randomBytes(30)
    crypt.pbkdf2(newPassword,salt,252000,50,'sha256',(err,hashcode)=>{
        users.forEach((user1)=>{
            if(user1.id===user.id){
                user1.password=hashcode
                user1.salt = salt
                user1.resetToken = undefined
            }
        })
        fs.writeFileSync('users',JSON.stringify(users))
        return res.json({message:'password reset successful'})
    })

})
app.post('/sendresetlink',(req,res)=>{
    let users = JSON.parse(fs.readFileSync(Path.join(__dirname,'../users')).toString())
    const {username} = req.body;
    let user = users.find((user)=>{
        return user.username === username
    })
    if(!user){
        return res.status(401).json({message:'username doesn\'t exist'})
    }
    let resetToken = crypt.randomUUID()
    mailer.sendMail({
        email:user.email,
        subject:'Password Reset',
        token:resetToken,
        url:'http://localhost:5173/reset/',
    }).then((success)=>{
        users.forEach((user)=>{
            if(user.username === username){
                user.resetToken = resetToken
            }
        })
        fs.writeFileSync('users',JSON.stringify(users))
        return res.json({message:`reset link sent to mail`,email:mailer.hashEmail(user.email)})
    }).catch((error)=>{
        return res.status(404).json({message:'error occurred while sending mail'})
    })
})

module.exports = app
