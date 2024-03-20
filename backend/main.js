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
//variable declaration
let dailyLogins = {}
if(fs.existsSync(Path.join(__dirname,'logins'))){
    dailyLogins = fs.readFileSync(Path.join(__dirname,'logins')).toString()
}
//middleware
app = express()
app.use(morgan('short'))
app.use(cors({
    origin:/http:\/\/127.0.0.1:\d+/,
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
    resave:true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/auth',login)
app.use('/register',register)
app.use('/resetpassword',resetPassword)
app.get('/resetpassword',resetPassword)
app.get('/',(req,res)=>{

})
app.get('/home',(req,res)=>{
    if(req.isAuthenticated()){
        if(!dailyLogins[`Day${getDate()}`]){
            dailyLogins[`Day${getDate()}`] = []
        }
        if(!dailyLogins[`Day${getDate()}`].includes(req.user)){
            dailyLogins[`Day${getDate()}`].push(req.user)
            fs.writeFileSync('logins',JSON.stringify(dailyLogins))
        }
        res.json(req.user)
    }else{
        res.redirect('/login')
    }
})
app.post('/reset',)
app.listen(3000,(req,res)=>{
    console.log('server running on 3000')
})

function getDate(){
    let date = new Date(Date.now())
    return `${date.getDay().toString().padStart(2,'0')}${date.getMonth().toString().padStart(2,'0')}${date.getFullYear()}`
}


