const express = require('express');
var router = express.Router();
var Stripe = require('../stripe');
const CreatorProduct = require('../client/src/models/creatorProduct');
const Order = require('../client/src/models/order');
const User = require('../client/src/models/user');
var { sendOrderConfirmationEmail, sendOrderToCreatorEmail } = require('../nodemailer.config');

router.post('/checkout', async (req, res, next) => {
    var products = req.body.products;
    var url = await Stripe.createSession(products, req.body.shippingPrice, req.body.username, req.body.email);
    if(url) return res.json({ url });
    else return res.json({ url: '' });
})

router.post('/session-data', async(req, res, next) => {
    var sessionID = req.body.sessionID;
    var response = await Stripe.getSession(sessionID, req.body.username);
    if(response.success) return res.json({ 
        name: response.name,
        email: response.email,
        orderID: response.orderID,
        customerID: response.customerID,
        success: true
    });
    else return res.json({ success: false });
})

router.post('/check-products', async (req, res, next) => {
    var urisAndNames = req.body.data;
    var itemOutOfStock = false;
    var outOfStockItem = '';
    var index = 0;
    for(var i = 0; i < urisAndNames.length; i++){
        try{
            var product = await CreatorProduct.findOne({ uri: urisAndNames[i].uri, count: { $gte: 1} });
            if(!product){
                outOfStockItem = urisAndNames[i].name;
                index = i;
                itemOutOfStock = true;
            }
            if(itemOutOfStock) break;
        } catch(err) {
            return itemOutOfStock = true;
        }

    }
    return res.json({ outOfStock: itemOutOfStock, name: outOfStockItem });
})

router.post('/save-order', async (req, res, next) => {
    try {
        var validSession = await Stripe.checkSession(req.body.orderID);
        if(validSession){
            var orderID = req.body.orderID,
                customerID = req.body.customerID,
                username = req.body.username;
            var order = new Order({
                orderID,
                items: req.body.items,
                date: req.body.date,
                total: req.body.total,
                subTotal: req.body.subTotal,
                customerID,
                user: username,
                address: req.body.shippingAddress,
                creators: req.body.creators
            });
            try {
                await order.save();
                if(username !== "Guest"){
                    var user = await User.findOne({ username: username });
                    if(!user.customerID) await User.updateOne({ username: username }, {$set: { customerID: customerID }});
                }
        
                // update product count
                await CreatorProduct.updateMany({ uri: { $in: req.body.items.map((i, index) => i.uri) }}, { $inc: { count: -1} });
                for(var i = 0; i < req.body.creators.length; i++){
                    var curUser = await User.findOne({ username: req.body.creators[i] });
                    sendOrderToCreatorEmail(curUser.email);
                }
                return res.json({ success: true });
            } catch(err){
                console.log(err);
                return res.json({ success: false });
            }
        } else return res.json({ success: false })
    } catch(err){
        console.log(err);
        return res.json({ success: false });
    }
})

router.post('/send-confirmation-email', async (req, res, next) => {
    // pass in stripe session id and if sesison fails
    var id = req.body.sessionID;
    try{
        var validSession = await Stripe.checkSession(id);
        if(validSession){
            sendOrderConfirmationEmail(req.body.email, req.body.items, req.body.total);
            return res.status(200).json({ success: true });
        } else return res.json({ success: false });
    } catch(err){
        console.log(err);
        return res.json({ success: false });
    }

})

module.exports = router;