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
const question = require('./services/question/question')
const {wss,router} = require('./services/games/game')
const {getUserById, updateProfile} = require("./gateways/database");
const multer = require('multer')
const crypt = require('crypto')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, Path.join(__dirname,'/public/profile'))
    },
    filename: function (req, file, cb) {
        const filename = crypt.randomUUID().toString()
        cb(null, filename+Path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })


//middleware
app = express()
app.use(morgan('short'))
app.use(cors({
    origin:/http:\/\/localhost:\d+/,
    credentials: true
}))
app.use(express.static(Path.join(__dirname,'public/profile')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
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
app.use('/services',question)
app.use('/services',router)
app.get('/home',(req,res)=>{
    if(req.isAuthenticated()){
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


const server = app.listen(process.env.PORT||3000,(req,res)=>{
    console.log('server running on 3000')
})
app.get('/user/:id',(req,res)=>{
    const id = req.params.id
    if(!id){
        return res.status(403).json({error:'id does not exist'})
    }
    getUserById(id).then((value)=>{
        res.json(value)
    }).catch((error)=>{
        res.json({error:error.message})
    })
})
app.post('/user/update-profile',upload.single('image'),(req,res)=>{
    const {displayName,id} = req.body
    const profileImage = req.file && new URL(`/${req.file.filename}`,process.env.BASE_URL).toString()
    if(!/^[a-zA-Z]{3,}/.test(displayName)){
        return res.status(403).json({error:'invalid display name format'})
    }
    getUserById(id).then(value => {
        if(value['profile_image']){
            const filename = new URL(value['profile_image']).pathname.split('/').pop()
            fs.unlink(Path.join(__dirname,`/public/profile/${filename}`),()=>{})
        }
        updateProfile(id,displayName,profileImage||value['profile_image']).then((value)=>{
            res.json({success:true,user:{
                    id:value['id'],
                    displayName:value['display_name'],
                    email:value['email'],
                    profileImage:value['profile_image']
            }})
        }).catch((err)=>{
            console.log(err)
            res.status(403).send('error')
        })
    })
})

app.get('/user/:id/image',(req,res)=>{
    const id = req.params.id
    if(!id){
        return res.status(403).json({error:'id does not exist'})
    }
    getUserById(id).then((value)=>{
        let initials = value['display_name'].split(' ').map((word)=>word[0].toUpperCase()).join('')
        if(!fs.existsSync(Path.join(__dirname,`/public/profile/${initials}.png`))){
            avatar(initials)
        }
        res.sendFile(Path.join(__dirname,`/public/profile/${initials}.png`))
    }).catch((error)=>{
        res.json({error:error.message})
    })
})

server.on('upgrade',(req, socket, head) =>{
    const { pathname } = new URL(req.url, `wss://${req.headers.host}`).pathname;
    wss.handleUpgrade(req,socket,head,(ws)=>{
        wss.emit('connection', ws, req);
    })
})

