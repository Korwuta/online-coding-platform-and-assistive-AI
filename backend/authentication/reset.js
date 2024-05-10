const crypt = require('crypto')
const app = require('express').Router()
const fs = require('fs')
const Path = require('path')
const nodemailer = require('nodemailer')
const {padEnd} = require("lodash/string");
const mailer = require('../mail-sender')
const jwt = require('jsonwebtoken')
const db = require('../database')
const {getUserWithUsername} = require("../database");
const {has} = require("lodash/object");
const usedToken = new Set()
app.post('/token/:resetToken',(req
                       ,res)=>{
    if(usedToken.has(req.params.resetToken)){
        return res.status(403).json({message:'link expired'})
    }
    jwt.verify(req.params.resetToken,process.env.RESET_SECRET,{},(err,decode)=>{
        if(err){
            return res.status(403).json({message:'link expired'})
        }
        getUserWithUsername(decode.username).then((row)=>{
            if(!row){
                return res.status(400).json({message:'User does not exist'})
            }
            let {newPassword} = req.body
            if(!(newPassword||"").match(
                /^(?=.*\d)(?=.*["#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~])(?=.*[A-Z])["\w#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~]+$/
            )){
                return res.status(400).json({message:'Invalid password format'})
            }
            let salt = crypt.randomBytes(30)
            crypt.pbkdf2(newPassword,Buffer.from(row.salt),252000,50,'sha256',(err,hashcode)=>{
                if(crypt.timingSafeEqual(hashcode,row.password_hash)){
                    return res.status(401).json({message:'Cannot use previous password'})
                }
                crypt.pbkdf2(newPassword,salt,252000,50,'sha256',(err,hashcode)=>{
                    db.updatePassword(row.username,hashcode,salt).then(()=>{
                        usedToken.add(req.params.resetToken)
                        return res.json({message:'password reset successful'})
                    }).catch((err)=>{
                        console.log(err)
                        res.status(500).json({message:'error'})
                    })
                })
            })
        })
    })

})
app.post('/sendresetlink',(req,res)=>{
    const {username} = req.body;
    db.getUserWithUsername(username).then((row)=>{
        if(!row){
            return res.status(401).json({message:'username doesn\'t exist'})
        }
        let resetToken = jwt.sign({username},process.env['RESET_SECRET'],{expiresIn:'1h'})
        mailer.sendMail({
            email:row.email,
            subject:'Password Reset',
            token:resetToken,
            url:'http://localhost:5173/reset/',
        }).then((success)=>{
            return res.json({message:`reset link sent to mail`,email:mailer.hashEmail(row.email)})
        }).catch((error)=>{
            return res.status(404).json({message:'error occurred while sending mail'})
        })
    }).catch((err)=>{
        console.log(err)
        res.status(500).json({message:'error occurred while fetching'})
    })
})

module.exports = app
