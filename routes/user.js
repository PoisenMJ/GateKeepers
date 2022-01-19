const express = require('express');
var router = express.Router();
var User = require('../client/src/models/user');
var Order = require('../client/src/models/order');
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
            return { items: order.items.map((o, i) => o.name), date, total: order.total };
        });
        
        // orders into array
        return res.json({ orders: ordersData })
    } catch(err) {
        return res.json({ orders: null });
    }
})

module.exports = router;