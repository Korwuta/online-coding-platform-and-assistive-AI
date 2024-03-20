const crypt = require('crypto')
const app = require('express').Router()
const fs = require('fs')
const users = []
app.post('/registeruser',(req, res)=>{
    let {firstname,lastname,email,password} = req.body
    if(!(firstname||"").match(/\w{2,}/)){
        return res.status(400).end()
    }
    if(!(lastname||"").match(/\w{2,}/)){
        return res.status(400).json({error:'Invalid last name'}).end()
    }
    if(!(email||"").match(/^[^\s@]+@[^\s@].[^\s@]/)){
        return res.status(400).json({error:'Invalid email'})
    }
    if(!(password||"").
    match(/^(?=.*\d+)(?=.*["#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~])["\w#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~]+$/)){
        return res.status(400).json({error:'Invalid password'})
    }
    let salt = crypt.randomBytes(30)
    crypt.pbkdf2(password,salt,252000,50,'sha256',(err,hashcode)=>{
        users.push({
            id: crypt.randomUUID().toString(),
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:hashcode,
            salt:salt,
            username: firstname.charAt(0) + lastname
        })
        fs.writeFileSync('users',JSON.stringify(users))
        res.redirect('/login')
    })
})
module.exports = app