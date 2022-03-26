const express = require('express');
var router = express.Router();

var User = require('../client/src/models/user');
var key = require('../client/src/models/key');
var crypto = require('crypto');

var { sendActivationEmail } = require('../nodemailer.config');

var nJwt = require('njwt');
var secureRandom = require('secure-random');

router.post('/login', async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    var user;
    try {
        user = await User.findOne({ username: username });
    } catch(err) {
        return res.status(400).json(err);
    }
    if(!user) return res.json({ success: false, message: 'Username or password incorrect' })
    else if(user.accountActivated === false) return res.json({ success: false, message: "activate account" });
    else if(!(user.checkPassword(password))) return res.json({ success: false, message: 'Username or password incorrect' });
    else if(user.accountType === "creator") return res.json({ success: false, message: 'Username or password incorrect' });
    else if(user.instaLogin) return res.json({ success: false, message: "Instagram login" })

    var signingKey = secureRandom(256, {type: 'Buffer'});
    var claims = {
        iss: process.env.HOST,
        scope: 'user'
    };
    var jwt = nJwt.create(claims, signingKey);
    var token = jwt.compact();
    var b64SigningKey = signingKey.toString('base64');

    var result;
    try {
        result = await key.exists({ user: user.username });
    } catch(err) {
        return res.status(400).json(err);
    }
    if(result){
        key.updateOne({ user: user.username }, { $set: { key: b64SigningKey } }, (err, updatedDoc) => {
            if(err) return res.status(400).json(err);
            else return res.json({ success: true, token });
        });
    } else {
        var newKey = new key({
            user: user.username,
            key: b64SigningKey
        });
        newKey.save((err, key) => {
            if(err) return res.status(400).json(err);
            else return res.json({ success: true, token });
        })
    }
});

router.post('/instagram-login', async (req, res, next) => {
    var username = req.body.username;
    var type = req.body.type;
    var user = await User.findOne({ username: username });
    if(user){
        if(user.accountType === "user" && user.instaLogin){
            var signingKey = secureRandom(256, {type: 'Buffer'});
            var claims = {
                iss: process.env.HOST,
                scope: type
            };
            var jwt = nJwt.create(claims, signingKey);
            var token = jwt.compact();
            var b64SigningKey = signingKey.toString('base64');
            key.updateOne({ user: username }, { $set: { key: b64SigningKey } }, (err, updatedDoc) => {
                if(err) return res.status(400).json(err);
                else return res.json({ success: true, token, type: 'user' });
            });
        } else if(user.accountType === 'creator' && type === 'creator'){
            var signingKey = secureRandom(256, {type: 'Buffer'});
            var claims = {
                iss: process.env.HOST,
                scope: 'creator'
            };
            var jwt = nJwt.create(claims, signingKey);
            var token = jwt.compact();
            var b64SigningKey = signingKey.toString('base64');

            var result;
            try {
                result = await key.exists({ user: username });
            } catch(err) {
                return res.status(400).json(err);
            }
            console.log(result);
            if(result){
                key.updateOne({ user: username }, { $set: { key: b64SigningKey } }, (err, updatedDoc) => {
                    if(err) return res.status(400).json(err);
                    else return res.json({ success: true, token, type: 'creator' });
                });
            } else {
                var newKey = new key({
                    user: username,
                    key: b64SigningKey
                });
                newKey.save((err, key) => {
                    if(err) return res.status(400).json(err);
                    else return res.json({ success: true, token, type: 'creator' });
                })
            }

        }
        else return res.json({ success: false, message: 'username taken' });
    } else {
        // first time login
        var newUser = new User({
            username,
            instaLogin: true,
            password: secureRandom(20).toString()
        });
        await newUser.save();
        var signingKey = secureRandom(256, {type: 'Buffer'});
        var claims = {
            iss: process.env.HOST,
            scope: 'user'
        };
        var jwt = nJwt.create(claims, signingKey);
        var token = jwt.compact();
        var b64SigningKey = signingKey.toString('base64');
        var newKey = new key({
            user: user.username,
            key: b64SigningKey
        });
        newKey.save((err, key) => {
            if(err) return res.status(400).json(err);
            else return res.json({ success: true, token, type: 'user' });
        })
    }
})

router.post('/create-account', async (req, res, next) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var usernameExists = await User.exists({ username: username });
    if(usernameExists) return res.json({ success: false, message: "Username Taken" });
    var emailExists = await User.exists({ email: email });
    if(emailExists) return res.json({ success: false, message: "Email Taken" });

    var token = crypto.randomInt(0, 10000000);

    var user = new User({
        username: username,
        email: email,
        password: password,
        activationCode: token
    });
    try {
        await user.save();
        sendActivationEmail(username, email, token);
        return res.json({ success: true });
    } catch(err) {
        return res.json({ success: false, message: "Creation Error" });
    }
});

// route to check token for normal user
router.post('/check-token', async (req, res, next) => {
    var signingKeyb64;
    try{
        signingKeyb64 = await key.findOne({ user: req.body.username });
    } catch(err) {
        return res.json({ success: false });
    }
    // change key back into buffer
    if(signingKeyb64) var signingKey = Buffer.from(signingKeyb64.key, 'base64');
    else return res.json({ success: false });

    nJwt.verify(req.body.token, signingKey, function(err, verifiedJwt) {
        if(err) return res.json({ success: false });
        if(verifiedJwt.body.scope == 'user') return res.json({ success: true });
        else if(verifiedJwt.body.scope == 'creator') return res.json({ success: false, message: 'creator' })
        else return res.json({ success: false });
    })
});

// route to check token for creator
router.post('/check-creator-token', async (req, res, next) => {
    var username = req.body.username;
    var token = req.body.token;

    var signingKeyb64;
    try {
        signingKeyb64 = await key.findOne({ user: username });
    } catch(err) {
        return res.json({ success: false });
    }

    var signingKey;
    if(signingKeyb64) signingKey = Buffer.from(signingKeyb64.key, 'base64');
    else return res.json({ success: false });

    nJwt.verify(token, signingKey, function(err, verifiedJwt) {
        if(err) return res.json({ success: false });
        if(verifiedJwt.body.scope == 'creator') return res.json({ success: true });
        else return res.json({ success: false });
    })
})

module.exports = router;