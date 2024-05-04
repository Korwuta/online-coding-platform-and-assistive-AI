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
    done(null, users.find((user)=>{
        return user.id === id
    }));
});
passport.use(new LocalStrategy((username, password, done) => {
    let user = users.find((user)=>{
        return user.username === username;
    })
    if(!user){
        return done(null,false,{message:'incorrect username or password'})
    }
    crypt.pbkdf2(password,Buffer.from(user.salt.data),252000,50,'sha256',(err,hashcode)=>{
        if(crypt.timingSafeEqual(hashcode,Buffer.from(user.password.data))){
            return done(null,user)
        }
        return done(null,false,{message:'incorrect username or password'})
    })
}));
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3000/auth/oauth2/redirect/google',
    scope: [ 'profile' ]
}, (issuer,profile,done)=>{
    console.log('hi')
    let authUser = auth.find((user)=>{
        return user.subject === profile.id && user.issuer === issuer;
    })
    console.log("first " + authUser)
    if(!authUser){
        let id = crypt.randomUUID().toString()
        users.push({
            id:id,
            username: profile.displayName,
        })
        auth.push({
            id:id,
            subject:profile.id,
            issuer:issuer,
        })
        fs.writeFileSync('users',JSON.stringify(users))
        fs.writeFileSync('authentication-table',JSON.stringify(auth))
        done(null,{id:id, username: profile.displayName})
    }else{
        let user = users.find((user)=>{
            return user.id === authUser.id;
        })
        done(null,user)
    }
}));
passport.use(new MicrosoftStrategy({
    clientID: process.env['MICROSOFT_CLIENT_ID'],
    clientSecret: process.env['MICROSOFT_CLIENT_SECRET'],
    callbackURL: "http://localhost:3000/auth/microsoft/callback",
    scope: ['user.read'],
},(accessToken,refreshToken,profile,done)=>{
    let authUser = auth.find((user)=>{
        return user.subject === profile.id
    })
    console.log("first " + authUser)
    if(!authUser){
        let id = crypt.randomUUID().toString()
        users.push({
            id:id,
            username: profile.displayName,
        })
        auth.push({
            id:id,
            subject:profile.id,
        })
        fs.writeFileSync('users',JSON.stringify(users))
        fs.writeFileSync('authentication-table',JSON.stringify(auth))
        done(null,{id:id, username: profile.displayName})
    }else{
        let user = users.find((user)=>{
            return user.id === authUser.id;
        })
        done(null,user)
    }
}));


//post routes
app.post('/login', passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/unsuccessful',
    failureFlash: true
}));


//get routes
app.get('/federated/google', passport.authenticate('google'));
app.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: process.env['WEBROWSER_HOME_PATH'],
    failureRedirect: process.env['WEBROWSER_LOGIN_PATH'],
}));
app.get('/federated/microsoft',passport.authenticate('microsoft',{
    prompt:'select_account',
}));
app.get('/microsoft/callback',passport.authenticate('microsoft',{
    successRedirect: process.env['WEBROWSER_HOME_PATH'],
    failureRedirect: process.env['WEBROWSER_LOGIN_PATH'],
}))

module.exports = app;
