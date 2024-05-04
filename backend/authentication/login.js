const express = require('express');
const app = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oidc')
const session = require('express-session')
const crypt = require('crypto')
const fs = require('fs')
const Path = require('path')
let users = JSON.parse(fs.readFileSync(Path.join(__dirname,'../users')).toString())
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
    callbackURL: '/oauth2/redirect/google',
    scope: [ 'profile' ]
},(issuer,profile,done)=>{

}))

app.post('/login', passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/unsuccessful',
    failureFlash: true
}));

app.get('/federated/google', passport.authenticate('google',{
    successRedirect:'/home',
    failureRedirect:'/unsuccessful',
    failureFlash: true
}));

module.exports = app;
