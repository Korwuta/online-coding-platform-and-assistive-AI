const crypt = require('crypto')
const app = require('express').Router()
const fs = require('fs')
const jwt = require('jsonwebtoken')
const users = []
const mailer = require('../mail-sender')
const {token} = require("morgan");

const usedToken = new Set()
app.post('/registeruser/:token',(req, res)=>{
    let {newPassword} = req.body
    if(!(newPassword||"").
    match(/^(?=.*\d+)(?=.*["#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~])["\w#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~]+$/)){
        return res.status(400).json({message:'Invalid password'})
    }
    jwt.verify(req.params.token,process.env['CONFIRMATION_SECRET'],{},(err,decode)=>{
        if(err){
            return res.status(403).json({message:'token verification failed'})
        }else{
            if(usedToken.has(token)){
                return res.status(400).json({message:'link expired'})
            }
            let salt = crypt.randomBytes(30)
            crypt.pbkdf2(newPassword,salt,252000,50,'sha256',(err, hashcode)=>{
                users.push({
                    id: crypt.randomUUID().toString(),
                    firstname:decode.firstName,
                    lastname:decode.lastName,
                    email:decode.email,
                    password:hashcode,
                    salt:salt,
                    username: decode.firstName.charAt(0) + decode.lastName
                })
                usedToken.add(token)
                fs.writeFileSync('users',JSON.stringify(users))
                return res.json({message:'account created successful'})
            })
        }
    })

})
app.post('/registeruser',(req, res)=>{
    let {firstName,lastName,email} = req.body

    if(!(firstName||"").match(/\w{2,}/)){
        return res.status(400).json({message:'Invalid first name'})
    }
    if(!(lastName||"").match(/\w{2,}/)){
        return res.status(400).json({message:'Invalid last name'}).end()
    }
    if(!(email||"").match(/^[^\s@]+@[^\s@].[^\s@]/)){
        return res.status(400).json({message:'Invalid email'})
    }
    let token = jwt.sign({firstName,lastName,email},process.env['CONFIRMATION_SECRET'],{ expiresIn: '1h' })
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
module.exports = app