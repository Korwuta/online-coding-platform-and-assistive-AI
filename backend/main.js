require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const Path = require('path')
const login = require('./authentication/login')
const register = require('./authentication/register')
const resetPassword = require('./authentication/reset')
const flash = require('express-flash')
const fs = require('fs')
const runCode = require('./services/code/code-services')
const avatar = require("./uploads/initials-generator");
const tutorial = require('./services/journey/tutorials')
//variable declaration
let dailyLogins = {}
if(fs.existsSync(Path.join(__dirname,'logins'))){
    dailyLogins = fs.readFileSync(Path.join(__dirname,'logins')).toString()
}
//middleware
app = express()
app.use(morgan('short'))
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use(express.static(Path.join(__dirname,'public')))
app.use(express.json())
app.use((err, req, res, next)=>{
    if(err instanceof SyntaxError && err.statusCode === 400 && 'body' in err){
        console.log(err)
        return res.status(400).send('Invalid JSON string')
    }
    next()
})
app.use(session({
    secret:'korwutacollins12345',
    saveUninitialized:true,
    resave:true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/auth',login)
app.use('/register',register)
app.use('/resetpassword',resetPassword)
app.use('/services',runCode)
app.use('/services',tutorial)
app.get('/home',(req,res)=>{
    if(req.isAuthenticated()){
        // if(!dailyLogins[`Day${getDate()}`]){
        //     dailyLogins[`Day${getDate()}`] = []
        // }
        // if(!dailyLogins[`Day${getDate()}`].includes(req.user)){
        //     dailyLogins[`Day${getDate()}`].push(req.user)
        //     fs.writeFileSync('logins',JSON.stringify(dailyLogins))
        // }
        res.json({message:"login successful",data:req.user})
    }else{
        res.redirect('/unsuccessful')
    }
})
app.get('/logout',(req,res)=>{
    req.logout((err) =>{
        if (err) { return res.status(500).json({message:'log out failed'}); }
        res.json({message:'user log out'});
    });
})
app.get('/unsuccessful', (req, res) => {
    res.status(401).send({message:'Incorrect username or password'})
});
app.listen(3000,(req,res)=>{
    console.log('server running on 3000')
})
app.get('/profile/:displayName',(req,res)=>{
    let initials = req.params.displayName.split(' ').map((word)=>word[0].toUpperCase()).join('')
    if(!fs.existsSync(Path.join(__dirname,`/public/profile/${initials}.png`))){
        avatar(initials)
    }
    res.sendFile(Path.join(__dirname,`/public/profile/${initials}.png`))
})
function getDate(){
    let date = new Date(Date.now())
    return `${date.getDay().toString().padStart(2,'0')}${date.getMonth().toString().padStart(2,'0')}${date.getFullYear()}`
}


