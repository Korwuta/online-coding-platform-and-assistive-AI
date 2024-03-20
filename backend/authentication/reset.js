const crypt = require('crypto')
const app = require('express').Router()
const fs = require('fs')
const Path = require('path')
const nodemailer = require('nodemailer')
let iv
const transporter = nodemailer.createTransport({
    auth:{
        user:'korwutacollins@gmail.com',
        password:''
    }
})
app.post('/:username',(req
                       ,res)=>{
    let users = JSON.parse(fs.readFileSync(Path.join(__dirname,'../users')).toString())
    let user = users.find((user)=>{return user.username===decryptUsername(req.params.username,req.iv)})
    console.log(user)
    if(!user){
        return res.status(400).json({error:'User does not exist'})
    }
    let {oldPassword,newPassword} = req.body
    console.log(req.body)
    if(!(newPassword||"").match(
        /^(?=.*\d)(?=.*["#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~])["\w#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~]+$/
    )){
        return res.status(400).json({error:'Invalid password format'})
    }
    console.log(user.password.data)
    crypt.pbkdf2(oldPassword,Buffer.from(user.salt.data),252000,50,'sha256',
        (err, hashcode)=>{
        if(err){
            return res.status(500).json({error:err.message})
        }
        if(!crypt.timingSafeEqual(hashcode,Buffer.from(user.password.data))){
            return res.status(403).json({error:'Incorrect password'})
        }
        let salt = crypt.randomBytes(30)
        crypt.pbkdf2(newPassword,salt,252000,50,'sha256',
            (err,hashcode)=>{
            if(err){
                return res.status(500).json({error:err.message})
            }
            users.forEach((user1)=>{
                if(user1.username===user.username){
                    user1.salt = salt
                    user1.password = hashcode
                }
            })
            fs.writeFileSync('users',JSON.stringify(users))
            return res.json({message:'Reset successful'})
        })

    })

})
app.post('/sendresetlink',(req,res)=>{
    let users = JSON.parse(fs.readFileSync(Path.join(__dirname,'../users')).toString())
    const {username} = req.body;
    let user = users.find((user)=>{
        return user.username = username
    })
    if(!user){
        res.json({error:'username doesn\'t exist'})
    }
    let encryptedUsername
    [encryptedUsername, req.iv] = encryptUsername(username)
    sendMail(encryptedUsername,user.email).then((success)=>{
        return res.json({message:'reset link sent to mail'})
    }).catch((error)=>{
        return res.json({error:'error occurred while sending mail'})
    })
})
async function sendMail(username,email){
    const info = await transporter.sendMail({
        from:'"Administrator" <korwutacollins@gmail.com>',
        to:email,
        subject:'Password Reset',
        html: `http://local:3003/resetpassword/${username}`
    })
    console.log('Message sent: %s',info.messageId)
}
module.exports = app

function encryptUsername(username){
    let iv = crypt.randomBytes(10)
    let cipher = crypt.createCipheriv('aes-128-gcm','utf-8',iv)
    let encryptedString = cipher.update(username)
    encryptedString += cipher.final()
    return [encryptedString,iv]
}
function decryptUsername(encryptedString,iv){
    let decipher = crypt.createDecipheriv('aes-128-gcm','utf-8',iv)
    let decryptedString = decipher.update(encryptedString)
    decryptedString += decipher.final()
    return decryptedString
}