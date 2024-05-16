const crypt = require('crypto')
const app = require('express').Router()
const fs = require('fs')
const jwt = require('jsonwebtoken')
const users = []
const mailer = require('../gateways/mail-sender')
const {token} = require("morgan");
const db = require('../gateways/database')



app.post('/registeruser/:token',(req, res)=>{
    let {newPassword} = req.body
    if(!(newPassword||"").
    match(/^(?=.*\d+)(?=.*["#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~])["\w#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~]+$/)){
        return res.status(400).json({message:'Invalid password'})
    }
    jwt.verify(req.params.token,process.env['CONFIRMATION_SECRET'],{},(err,decode)=>{
        if(err){
            return res.status(403).json({message:'link expired'})
        }else{
            let salt = crypt.randomBytes(30)
            crypt.pbkdf2(newPassword,salt,252000,50,'sha256',(err, hashcode)=>{
                db.createUserLocal({
                    id: crypt.randomUUID().toString(),
                    firstName:decode.firstName,
                    lastName:decode.lastName,
                    email:decode.email,
                    password:hashcode,
                    salt:salt,
                    username: decode.username,
                    displayName:`${decode.firstName} ${decode.lastName}`,
                    createdAt: Date.now()
                }).then(()=>{
                    return res.json({message:'account created successful'})
                }).catch((err)=>{
                    console.log(err)
                    return res.status(400).json({message:'failed'})
                })
            })
        }
    })

})
app.post('/registeruser',(req, res)=>{
    let {firstName,lastName,username,email} = req.body

    if(!(firstName||"").match(/\w{2,}/)){
        return res.status(400).json({message:'Invalid first name'})
    }
    if(!(lastName||"").match(/\w{2,}/)){
        return res.status(400).json({message:'Invalid last name'}).end()
    }
    if(!(email||"").match(/^[^\s@]+@[^\s@].[^\s@]/)){
        return res.status(400).json({message:'Invalid email'})
    }
    if(!(username||"").match(/^[a-zA-Z]{5}/)){
        return res.status(400).json({message:'Invalid username'})
    }
    let token = jwt.sign({firstName,lastName,email,username},process.env['CONFIRMATION_SECRET'],{ expiresIn: '1h' })
    mailer.sendMail({
        email:email,
        token:token,
        subject:"Confirmation",
        url:'http://localhost:5173/register/'
    }).then((success)=>{
        return res.json({message:`reset link sent to mail `,email:mailer.hashEmail(email)})
    }).catch((err)=>{
        return res.status(404).json({message:'error occurred while sending mail'})
    })
})
app.post('/check-username',(req,res)=>{
    const {username} = req.body
    db.getUserWithUsername(username).then((row)=>{
        if(!row){
            return res.json({message:'doesnt exist'})
        }
        res.json({message:'username already exist'})
    })
})
module.exports = app