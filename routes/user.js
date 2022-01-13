const express = require('express');
var router = express.Router();
var User = require('../client/src/models/user');
var { userCheck } = require('../middleware/auth');

router.post('/profile', userCheck, (req, res, next) => {
    var username = req.body.username;
    User.findOne({ username: username }).select('username email image').then((user, err) => {
        if(err || !user) return res.json({ success: false });
        else return res.json({ success: true, user });
    })
});

router.post('/update-password', userCheck, async (req, res, next) => {
    var password = req.body.password;
    var username = req.body.username;
    console.log(username);
    console.log(User.encryptPassword(password));
    try{
        await User.updateOne({ username: username }, { $set: { password: User.encryptPassword(password) }});
        console.log('success');
        return res.json({ success: true });
    } catch(err) {
        console.log(err);
        return res.json({ success: false });
    }
    
})

module.exports = router;