const express = require('express');
const creator = require('../client/src/models/creator');
const creatorPost = require('../client/src/models/creatorPost');
const creatorProduct = require('../client/src/models/creatorProduct');
var router = express.Router();

router.get('/all-posts', (req, res, next) => {
    creatorPost.find({}).populate('creator').exec((err, docs) => {
        if(err) return res.status(400).json(err);
        else return res.json(docs);
    })
});

router.get('/products/worn-by/:creatorTag', (req, res, next) => {
    creatorProduct.find({tag: req.query.creatorTag, type: "creator"}).populate('creator').exec((err, docs) => {
        if(err) return res.status(400).json(err);
        else return res.json(docs);
    })
});

router.get('/products/made/:creatorTag', (req, res, next) => {
    creatorProduct.find({tag: req.query.creatorTag, type: "product"}).populate('creator').exec((err, docs) => {
        if(err) return res.status(400).json(err);
        else return res.json(docs);
    })
})

router.get('/all-creators', (req, res, next) => {
    creator.find({}).then((creators, err) => {
        if(err) return res.status(400).json(err);
        else return res.json(creators);
    })
});

module.exports = router;