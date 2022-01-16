const express = require('express');
var router = express.Router();
var Stripe = require('../stripe');
const CreatorProduct = require('../client/src/models/creatorProduct');

router.post('/checkout', async (req, res, next) => {
    var products = req.body.products;
    var url = await Stripe.createSession(products);
    console.log(url);
    return res.json({ url });
})

router.post('/session-data', async(req, res, next) => {
    var sessionID = req.body.sessionID;
    var {name, email, orderID, customerID} = await Stripe.getSession(sessionID);
    return res.json({ name, email, orderID, customerID });
})

router.post('/check-products', async (req, res, next) => {
    var urisAndNames = req.body.data;
    var itemOutOfStock = false;
    var outOfStockItem = '';
    var index = 0;
    for(var i = 0; i < urisAndNames.length; i++){
        try{
            var updated = await CreatorProduct.updateOne({ uri: urisAndNames[i].uri, count: { $gt: 0 } }, { $inc: { count: -1 }});
            if(updated.matchedCount == 0 && updated.modifiedCount == 0){
                outOfStockItem = urisAndNames[i].name;
                index = i;
                itemOutOfStock = true;
            }
            if(itemOutOfStock) break;
        } catch(err) {
            return itemOutOfStock = true;
        }

    }
    // if out of stock reverse count which were updated put them back to original
    if(index > 0 && itemOutOfStock){
        for(var i = 0; i < index; i++){
            try{
                await CreatorProduct.updateOne({ uri: urisAndNames[i].uri }, {$inc: {count: 1}});
            } catch(err) {
                return false;
            }
        }
    }
    return res.json({ outOfStock: itemOutOfStock, name: outOfStockItem });
})

module.exports = router;