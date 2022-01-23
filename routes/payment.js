const express = require('express');
var router = express.Router();
var Stripe = require('../stripe');
const CreatorProduct = require('../client/src/models/creatorProduct');
const Order = require('../client/src/models/order');
const User = require('../client/src/models/user');
const { sendOrderConfirmationEmail } = require('../nodemailer.config');

router.post('/checkout', async (req, res, next) => {
    var products = req.body.products;
    var url = await Stripe.createSession(products, req.body.username);
    console.log(url);
    return res.json({ url });
})

router.post('/session-data', async(req, res, next) => {
    var sessionID = req.body.sessionID;
    var {name, email, orderID, customerID} = await Stripe.getSession(sessionID, req.body.username);
    return res.json({ name, email, orderID, customerID });
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
    var orderID = req.body.orderID,
        customerID = req.body.customerID,
        username = req.body.username;
    var order = new Order({
        orderID,
        items: req.body.items,
        date: req.body.date,
        total: req.body.total,
        customerID,
        user: username,
        address: req.body.shippingAddress,
        creators: req.body.creators
    });
    try {
        await order.save();
        if(username){
            var user = await User.findOne({ username: username });
            if(!user.customerID) await User.updateOne({ username: username }, {$set: { customerID: customerID }});
        }

        // update product count
        var updated = await CreatorProduct.updateMany({ uri: { $in: req.body.items.map((i, index) => i.uri) }}, { $inc: { count: -1} });
        return res.json({ success: true });
    } catch(err){
        return res.json({ success: false });
    }
})

router.post('/send-confirmation-email', (req, res, next) => {
    sendOrderConfirmationEmail(req.body.username, req.body.email, req.body.items, req.body.total);
    return res.status(200);
})

module.exports = router;