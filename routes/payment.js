const express = require('express');

const router = express.Router();
const Stripe = require('../services/stripe');
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const {
  sendOrderConfirmationEmail,
  sendOrderToCreatorEmail,
} = require('../services/nodemailer.config');

router.post('/checkout', async (req, res) => {
  const { products } = req.body;
  const url = await Stripe.createSession(
    products,
    req.body.shippingPrice,
    req.body.username,
    req.body.email,
  );
  if (url) return res.json({ url });
  return res.json({ url: '' });
});

router.post('/session-data', async (req, res) => {
  const { sessionID } = req.body;
  const response = await Stripe.getSession(sessionID, req.body.username);
  if (response.success) {
    return res.json({
      name: response.name,
      email: response.email,
      orderID: response.orderID,
      customerID: response.customerID,
      success: true,
    });
  }
  return res.json({ success: false });
});

router.post('/check-products', async (req, res) => {
  const urisAndNames = req.body.data;
  let itemOutOfStock = false;
  let outOfStockItem = '';

  try {
    const promises = [];
    for (let i = 0; i < urisAndNames.length; i += 1) {
      promises.push(Product.findOne({
        uri: urisAndNames[i].uri,
        count: { $gte: 1 },
      }));
    }

    const results = await Promise.all(promises);
    for (let i = 0; i < results.length; i += 1) {
      const product = results[i];
      if (!product) {
        outOfStockItem = urisAndNames[i].name;
        itemOutOfStock = true;
        break;
      }
    }
    return res.json({ outOfStock: itemOutOfStock, name: outOfStockItem });
  } catch (err) {
    return res.json({ success: false });
  }
});

router.post('/save-order', async (req, res) => {
  try {
    const validSession = await Stripe.checkSession(req.body.orderID);
    if (validSession) {
      const { orderID } = req.body;
      const { customerID } = req.body;
      const { username } = req.body;
      const order = new Order({
        orderID,
        items: req.body.items,
        date: req.body.date,
        total: req.body.total,
        subTotal: req.body.subTotal,
        customerID,
        user: username,
        address: req.body.shippingAddress,
        creators: req.body.creators,
      });
      try {
        await order.save();
        if (username !== 'Guest') {
          const user = await User.findOne({ username });
          if (!user.customerID) { await User.updateOne({ username }, { $set: { customerID } }); }
        }

        // update product count
        await Product.updateMany(
          { uri: { $in: req.body.items.map((i) => i.uri) } },
          { $inc: { count: -1 } },
        );

        const promises = [];
        for (let i = 0; i < req.body.creators.length; i += 1) {
          promises.push(User.findOne({
            username: req.body.creators[i],
          }));
        }

        const results = await Promise.all(promises);
        for (let i = 0; i < results.length; i += 1) {
          const curUser = results[i];
          sendOrderToCreatorEmail(curUser.email).catch(
            () => res.json({ success: false }),
          );
        }
        return res.json({ success: true });
      } catch (err) {
        console.log(err);
        return res.json({ success: false });
      }
    } else return res.json({ success: false });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

router.post('/send-confirmation-email', async (req, res) => {
  // pass in stripe session id and if sesison fails
  const id = req.body.sessionID;
  try {
    const validSession = await Stripe.checkSession(id);
    if (validSession) {
      sendOrderConfirmationEmail(
        req.body.email,
        req.body.items,
        req.body.total,
      );
      return res.status(200).json({ success: true });
    }
    return res.json({ success: false });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

module.exports = router;
