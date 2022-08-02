const express = require('express');
const creator = require('../models/creator');
const Product = require('../models/product');

const router = express.Router();

router.get('/all-posts', (req, res) => {
  creator.find({}).select('-_id image tag links accent').exec((err, docs) => {
    if (err) return res.status(400).json(err);
    return res.json(docs);
  });
});

router.get('/shop/:gatekeeperTag', (req, res) => {
  // eslint-disable-next-line consistent-return
  creator.findOne({ tag: req.params.gatekeeperTag }).then((_creator, _error) => {
    if (_error) return res.json({ success: false });
    if (_creator) {
      Product.find({}).populate({
        path: 'creator',
        select: '-_id',
        match: { tag: req.params.gatekeeperTag },
      }).select('-_id name price images imageOrder uri dateToPost count').exec((_error2, _docs) => {
        if (_error2) return res.status(400).json(_error2);
        const products = _docs.filter((d) => d.creator);
        return res.json({ products, success: true });
      });
    }
  });
});

router.get('/shop/:gatekeeperTag/:productURI', (req, res) => {
  Product.findOne({ uri: req.params.productURI }).populate('creator', 'tag').then((product, err) => {
    if (err) return res.json({ success: false });
    if (product) return res.json({ success: true, product });
    return res.json({ success: false });
  });
});

router.get('/all-gatekeepers', (req, res) => {
  creator.find({}).select('-_id').then((creators, err) => {
    if (err) return res.status(400).json(err);
    return res.json(creators);
  });
});

router.get('/:gatekeeperTag', (req, res) => {
  const username = req.params.gatekeeperTag;

  creator.findOne({ tag: username }).select('-_id name paymentLink').then((user, err) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true, user });
  });
});

router.get('/shipping/:gatekeeperTag', (req, res) => {
  creator.findOne({ tag: req.params.gatekeeperTag }).select('-_id shippingDetails').then((docs, err) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true, shippingDetails: docs.toObject().shippingDetails });
  });
});

router.get('/accent/:gatekeeperTag', (req, res) => {
  creator.findOne({ tag: req.params.gatekeeperTag }).select('-_id accent').then((docs, err) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true, accentColor: docs.toObject().accent });
  });
});

module.exports = router;
