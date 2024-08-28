const express = require('express');
const app = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oidc');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const session = require('express-session')
const crypt = require('crypto')
const fs = require('fs')
const Path = require('path')
const __ = require("lodash/fp/__");
const db = require('../gateways/database')
const {data} = require("express-session/session/cookie");
const avatar = require("../uploads/initials-generator");
//variables
let users = JSON.parse(fs.readFileSync(Path.join(__dirname,'../users')).toString())
let auth = []
if(fs.readFileSync(Path.join(__dirname,'../authentication-table')).toString()){
    auth = JSON.parse(fs.readFileSync(Path.join(__dirname,'../authentication-table')).toString())
}

//middlewares
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    db.getUserById(id).then((row)=>{
        if(!row){
            done(null,false,{message:'user not found'})
        }
        done(null,{id:row.id,displayName:row.display_name,email:row.email,profileImage:row.profile_image})
    })
});
passport.use(new LocalStrategy((username, password, done) => {
    db.getUserWithUsername(username).then((row)=>{
        console.log(row)
        if(!row){
            return done(null,false,{message:'incorrect username or password'})
        }
        crypt.pbkdf2(password,Buffer.from(row.salt),252000,50,'sha256',(err,hashcode)=>{
            if(crypt.timingSafeEqual(hashcode,Buffer.from(row.password_hash))){
                console.log({id:row.id,displayName:row.displayName,email:row.email})
                return done(null,{id:row.id,displayName:row.displayName,email:row.email})
            }
            return done(null,false,{message:'incorrect username or password'})
        })

    }).catch((err)=>{
        console.log(err)
        done(null,false,{message:'server error'})
    })
}));
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3000/auth/oauth2/redirect/google',
    scope: [ 'profile' ]
}, (issuer,profile,done)=>{
    federatedLogin(profile,issuer,done)
}));
passport.use(new MicrosoftStrategy({
    clientID: process.env['MICROSOFT_CLIENT_ID'],
    clientSecret: process.env['MICROSOFT_CLIENT_SECRET'],
    callbackURL: "http://localhost:3000/auth/microsoft/callback",
    scope: ['user.read'],
},(accessToken,refreshToken,profile,done)=>{
    federatedLogin(profile,'microsoft',done)
}));


//post routes
app.post('/login', (req,res)=>{
    passport.authenticate('local',(err,user,info)=>{
        if(err||!user){
            return res.redirect('/unsuccessful')
        }
        req.login(user,(err)=>{
            return res.redirect('/home')
        })
    })(req,res);
});


//get routes
app.get('/federated/google', passport.authenticate('google'));
app.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: process.env.WEBROWSER_LOGIN_PATH,
    failureRedirect:process.env.WEBROWSER_LOGIN_PATH,
}));
app.get('/federated/microsoft',passport.authenticate('microsoft',{
    prompt:'select_account',
}));
app.get('/microsoft/callback',passport.authenticate('microsoft',{
    successRedirect: process.env.WEBROWSER_LOGIN_PATH,
    failureRedirect: process.env.WEBROWSER_LOGIN_PATH,
}))

async function federatedLogin(profile,issuer,done){
    db.findAuthentication({subject: profile.id,issuer}).then(async (row)=>{
        let id = row&&row.user_id
        if(!row){
            const initials = profile.displayName.split(' ').map((word)=>word[0].toUpperCase()).join('')
            const imageId = crypt.randomUUID().toString()
            fs.writeFileSync(Path.join(__dirname,`../public/profile/${imageId}`),avatar(initials))
            const profileImage = new URL(`/${imageId}`,process.env.BASE_URL).toString()
            const res = await db.createUserNonLocal(
                {issuer,subject:profile.id,displayName:profile.displayName,profileImage})
            id = res.user_id
        }
        db.getUserById(id).then((row)=>{
            if(!row){
                return done(null,false,{message:'user not found'})
            }
            done(null,row)
        }).catch((err)=>{
            done(null,false,{message:'error occurred while fetching'})
        })
    }).catch((err)=>{
        console.log(err)
        done(null,false,{message:err})
    })

}

module.exports = app;
