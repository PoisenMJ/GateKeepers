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

router.get('/products/own/:creatorTag', (req, res, next) => {
    creatorProduct.find({type: "own"}).populate({
        path: 'creator',
        match: { tag: req.params.creatorTag }
    }).exec((err, docs) => {
        // filter resulting docs because with populate if there is no match the creator
        // field is empty but still returns doc
        if(err) return res.status(400).json(err);
        else return res.json(docs.filter((a) => a.creator));
    })
});

router.get('/products/made/:creatorTag', (req, res, next) => {
    creatorProduct.find({type: "made"}).populate({
        path: 'creator',
        match: { tag: req.params.creatorTag }
    }).exec((err, docs) => {
        if(err) return res.status(400).json(err);
        else return res.json(docs.filter((a) => a.creator));
    })
});

router.get('/products/:productName', (req, res, next) => {
    creatorProduct.findOne({name: decodeURIComponent(req.params.productName)}).then((product, err) => {
        if(err) return res.status(400).json(err);
        else return res.json(product);
    })
});

router.get('/all-creators', (req, res, next) => {
    creator.find({}).then((creators, err) => {
        if(err) return res.status(400).json(err);
        else return res.json(creators);
    })
});

module.exports = router;