const express = require('express');
const creator = require('../client/src/models/creator');
const creatorPost = require('../client/src/models/creatorPost');
const creatorProduct = require('../client/src/models/creatorProduct');
const fs = require('fs');
var router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './client/public/images/products/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = '-' + Date.now() + '-' + Math.round(Math.random()*1E9)+'.';
        console.log(file);
        cb(null, file.fieldname+uniqueSuffix+(file.mimetype.split('/')[1]));
    }
})
var upload = multer({ storage: storage });

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

router.post('/products/add', upload.array('images'), (req, res, next) => {
    var creatorUsername = req.body.username;
    var imageNameList = [];
    for(var i = 0; i < req.files.length; i++){
        imageNameList.push(req.files[i].filename)
    }
    
    creator.findOne({ username: creatorUsername }).then((user, err) => {
        var newProduct = new creatorProduct({
            creator: user._id,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            count: 1,
            images: imageNameList,
            type: req.body.type
        });
        newProduct.save((err) => {
            if(err) return res.json({ success: false });
            else return res.json({ success: true });
        })
    })
});

// TODO: add middleware to check token sent in each request
router.post('/products/remove', (req, res, next) => {
    var productID = req.body.productID;
    creatorProduct.deleteOne({ _id: productID }).then((deleted, err) => {
        if(err) return res.json({ success: false });
        else return res.json({ success: true });
    })
});

router.post('/products/update', upload.array('images'), (req, res, next) => {
    var fileNames = [];
    var productID = req.body.productID;
    var imagesChanged = req.body.imagesChanged == 'true';
    var imagesCleared = req.body.imagesCleared == 'true';
    var originalImages = [];

    creatorProduct.findOne({ _id: productID }, (err, product) => {
        if(err) return res.json({ success: false });
        originalImages = product.images;
        if(imagesChanged){
            for(var i = 0; i < req.files.length; i++){
                fileNames.push(req.files[i].filename)
            }
            if(imagesCleared){
                // remove old product images
                for(var i = 0; i < product.images.length; i++){
                    fs.unlink(`./client/public/images/products/${product.images[i]}`, function(err) {
                        if(err) console.log('Err removing old product images');
                    });
                }
            } else originalImages = originalImages.concat(fileNames);
        }
        
        creatorProduct.findOneAndUpdate({ _id: productID }, {
            $set: {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                count: req.body.count,
                images: (imagesChanged && imagesCleared) ? fileNames : originalImages,
                type: req.body.type
            }
        }, (err, docs) => {
            if(err) return res.json({ success: false });
            else return res.json({ success: true });
        })
    })

})

router.get('/all-creators', (req, res, next) => {
    creator.find({}).then((creators, err) => {
        if(err) return res.status(400).json(err);
        else return res.json(creators);
    })
});

router.get('/products/all/:creatorTag', (req, res, next) => {
    var tag = req.params.creatorTag;
    creator.findOne({ tag: tag }).then((user, err) => {
        if(err) return res.json({ success: false });
        creatorProduct.find({ creator: user._id }).then((docs, err) => {
            if(err) return res.json({ success: false });
            else {
                return res.json({ success: true, products: docs });
            }
        })
    })
})

router.post('/products/portal/:productID', (req, res, next) => {
    var username = req.body.username;
    var productID = req.body.productID;

    creator.findOne({ tag: username }).then((user, err) => {
        if(err) return res.json({ success: false });
        creatorProduct.findOne({ creator: user._id, _id: productID }).then((docs, err) => {
            if(err) return res.json({ success: false });
            else {
                return res.json({ success: true, product: docs});
            }
        })
    })
})

module.exports = router;