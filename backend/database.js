const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const morgan = require("morgan");

const app = express();

app.use(morgan('short'));
// Use session to persist login state
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.js)
app.use(passport.initialize());
app.use(passport.session());


// Example user data (replace this with your own user data source)
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

// Serialize and deserialize user for session persistence
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    done(null, user);
});

// Local strategy for username/password authentication
passport.use(
    new LocalStrategy((username, password, done) => {
        const user = users[0]
        if (user) {
            return done(null, user);
        }
        return done(null, false, { message: 'Incorrect username or password' });
    })
);

// Authentication middleware
const authenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.authentication = true;
        return next();
    }
    res.status(401).send('Unauthorized');
};

// Routes
app.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/login',
    })
);

app.get('/success', authenticate, (req, res) => {
    console.log(req.isAuthenticated())
    res.send('You are authenticated!');
});

app.get('/login', (req, res) => {

    res.send('Login page');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
