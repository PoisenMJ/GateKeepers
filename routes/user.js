const express = require('express');
var router = express.Router();
var User = require('../client/src/models/user');

router.post('/profile', (req, res, next) => {
    var username = req.body.username;
    User.findOne({ username: username }).select('username email image').then((user, err) => {
        if(err || !user) return res.json({ success: false });
        else return res.json({ success: true, user });
    })
});

router.post('/update-password', async (req, res, next) => {
    var password = req.body.password;
    var username = req.body.username;
    try{
        await User.updateOne({ username: username, password: User.encryptPassword(password) });
        console.log('success');
        return res.json({ success: true });
    } catch(err) {
        console.log(err);
        return res.json({ success: false });
    }
    
})

module.exports = router;