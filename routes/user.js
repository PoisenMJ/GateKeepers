const express = require('express');
var router = express.Router();
var User = require('../client/src/models/user');
var Order = require('../client/src/models/order');
const Key = require('../client/src/models/key');
const nJwt = require('njwt');
var { userCheck } = require('../middleware/auth');
var { sendPasswordResetEmail, sendPasswordChangeEmail, sendActivationEmail } = require('../nodemailer.config');

router.post('/profile', userCheck, (req, res, next) => {
    var username = req.body.username;
    User.findOne({ username: username }).select('username email image').then((user, err) => {
        if(err || !user) return res.json({ success: false });
        else return res.json({ success: true, user });
    })
});

router.post('/recover-password', async (req, res, next) => {
    var username = req.body.username;
    var token = req.body.token;
    var newPassword = req.body.newPassword;

    try{
        var skBuffer = await Key.findOne({ user: username });
        if(skBuffer){
            var signingKey = Buffer.from(skBuffer.key, 'base64');
            nJwt.verify(token, signingKey, function(err, verifiedJwt) {
                if(err) return res.json({ success: false, message: '' });
                if(verifiedJwt.body.scope === 'password-reset'){
                    User.updateOne({ username: username }, {$set: { password: User.encryptPassword(newPassword)}}).then((user, err) => {
                        if(err) return res.json({ success: false, message: ''})
                        return res.json({ success: true, message: "password updated"});
                    });
                }
                else return res.json({ success: false, message: "failed" });
            })
        }
    } catch(err) {
        return res.json({ success: false, message: "Error" });
    }
})

router.post('/change-password', userCheck, async (req, res, next) => {
    var username = req.body.username;
    var updateToken = req.body.updateToken;
    var newPassword = req.body.newPassword;

    try{
        var key = await Key.findOne({ user: username });
        if(key){
            var signingKey = Buffer.from(key.key, 'base64');
            nJwt.verify(updateToken, signingKey, function(err, verifiedJwt) {
                if(err) return res.json({ success: false, message: 'Expired get new link' });
                if(verifiedJwt.body.scope === "password-change"){
                    User.updateOne({ username: username }, {$set: {password: User.encryptPassword(newPassword)}}).then((user, err) => {
                        if(err) return res.json({ success: false, message: 'Not updated' })
                        return res.json({ success: true, message: ''})
                    });
                }
                else return res.json({ success: false, message: "Invalid token" });
            })
        } else return res.json({ success: false, message: "Failed" });
    } catch(err) {
        return res.json({ success: false, message: "failed" });
    }
})

router.post('/email-change-password', userCheck, async (req, res, next) => {
    var username = req.body.username;
    try {
        var user = await User.findOne({ username: username });
        var key = await Key.findOne({ user: user.username });

        //if link saved check its still active and dont send email
        if(user.updateCode){
            var signingKey = Buffer.from(key.key, 'base64');
            nJwt.verify(user.updateCode, signingKey, function(err, verifiedJwt) {
                if(err){
                    if(key){
                        var signingKey = Buffer.from(key.key, 'base64');
                        var jwt = nJwt.create({
                            iss: process.env.HOST,
                            scope: "password-change"
                        }, signingKey);
                        var token = jwt.compact().toString('base64');
                        User.updateOne({ username: username }, { $set: { updateCode: token }}).then((u, e) => {
                            if(e) return res.json({ success: false, message: '' })
                            else{
                                sendPasswordChangeEmail(user.email, `${process.env.HOST}/password-change/${token}`)
                                return res.json({ success: true });
                            }
                        });
                    } else return res.json({ success: false });
                }
                else if(verifiedJwt.body.scope === 'password-change') return res.json({ success: true, message: "Email sent already" })
                else return res.json({ success: false, message: 'Invalid token' });
            })
        }

        // put code in the verify
        if(!user.updateCode){
            if(key){
                var signingKey = Buffer.from(key.key, 'base64');
                var jwt = nJwt.create({
                    iss: process.env.HOST,
                    scope: "password-change"
                }, signingKey);
                var token = jwt.compact();
                var b64token = token.toString('base64');
                console.log(b64token);
                await User.updateOne({ username: username }, { $set: { updateCode: b64token }});
                sendPasswordChangeEmail(user.email, `${process.env.HOST}/password-change/${b64token}`)
                return res.json({ success: true });
            } else return res.json({ success: false });
        }
    } catch(err) {
        console.log(err);
        return res.json({ success: false });
    }
})

router.post('/get-reset-password-token', async (req, res, next) => {
    var email = req.body.email;
    try {
        var user = await User.findOne({ email: email });
        var key = await Key.findOne({ user: user.username });
        if(key){
            var signingKey = Buffer.from(key.key, 'base64');
            var jwt = nJwt.create({
                iss: process.env.HOST,
                scope: "password-reset"
            }, signingKey);
            var token = jwt.compact();
            var b64token = token.toString('base64');
            sendPasswordResetEmail(email, `${process.env.HOST}/password-recovery/${user.username}/${b64token}`)
            return res.json({ success: true });
        }
    } catch(err) {
        return res.json({ success: false });
    }
})

router.post('/get-activation-token', async (req, res, next) => {
    var username = req.body.username;
    try{
        var u = await User.findOne({ username: username });
        sendActivationEmail(u.email, u.activationCode);
        return res.json({ success: true });

    } catch(err){
        return res.json({ success: false });
    }
});

router.post('/check-activation-token', async (req, res, next) => {
    var username = req.body.username;
    var code = req.body.activationToken;
    User.findOne({ username: username }).then((user, err) => {
        if(err) return res.json({ success: false, message: "" });
        if(!user) return res.json({ success: false, message: "" });
        if(user.activationCode == code && user.accountType !== "creator"){
            User.updateOne({ username: username }, { $set: { accountActivated: true }}).then((updated, err) => {
                if(err) return res.json({ success: false, message: "" });
                else return res.json({ success: true, message: "" })
            });
        }
        else return res.json({ success: false, message: "Code Incorrect" });
    });
})

router.post('/update-password', userCheck, async (req, res, next) => {
    var password = req.body.password;
    var username = req.body.username;
    try{
        await User.updateOne({ username: username }, { $set: { password: User.encryptPassword(password) }});
        console.log('success');
        return res.json({ success: true });
    } catch(err) {
        console.log(err);
        return res.json({ success: false });
    }
    
})

router.post('/orders', userCheck, async (req, res, next) => {
    var username = req.body.username;
    try {
        var orders = await Order.find({ user: username });
        var ordersData = orders.map((order, index) => {
            var d = new Date(order.date);
            var date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
            return { items: order.items.map((o, i) => o.name), date, total: order.total, sizes: order.items.map((o, i) => o.size) };
        });
        
        // orders into array
        return res.json({ orders: ordersData })
    } catch(err) {
        return res.json({ orders: null });
    }
})

module.exports = router;