const express = require('express');
var router = express.Router();
const Creator = require('../client/src/models/creator');
const CreatorProduct = require('../client/src/models/creatorProduct');
const User = require('../client/src/models/user');
var { gatekeeperCheck } = require('../middleware/auth');

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

router.post('/products/add', gatekeeperCheck, upload.array('images'), (req, res, next) => {
    var creatorUsername = req.body.username;
    var imageNameList = [];
    for(var i = 0; i < req.files.length; i++){
        imageNameList.push(req.files[i].filename)
    }
    
    Creator.findOne({ username: creatorUsername }).then((user, err) => {
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
})

router.post('/products/remove', gatekeeperCheck, (req, res, next) => {
    var productID = req.body.productID;
    CreatorProduct.deleteOne({ _id: productID }).then((deleted, err) => {
        if(err) return res.json({ success: false });
        else return res.json({ success: true });
    })
})

router.post('/products/update', upload.array('images'), gatekeeperCheck, (req, res, next) => {
    var fileNames = [];
    var productID = req.body.productID;
    var imagesChanged = req.body.imagesChanged == 'true';
    var imagesCleared = req.body.imagesCleared == 'true';
    var originalImages = [];

    CreatorProduct.findOne({ _id: productID }, (err, product) => {
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

        CreatorProduct.findOneAndUpdate({ _id: productID }, {
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

router.post('/products/:productID', gatekeeperCheck, (req, res, next) => {
    var username = req.body.username;
    var productID = req.params.productID;

    Creator.findOne({ tag: username }).then((user, err) => {
        if(err) return res.json({ success: false });
        CreatorProduct.findOne({ creator: user._id, _id: productID }).then((docs, err) => {
            if(err) return res.json({ success: false });
            else {
                return res.json({ success: true, product: docs});
            }
        })
    })
})

router.post('/products/all/:creatorTag', gatekeeperCheck, (req, res, next) => {
    var tag = req.params.creatorTag;
    Creator.findOne({ tag: tag }).then((user, err) => {
        if(err) return res.json({ success: false });
        CreatorProduct.find({ creator: user._id }).then((docs, err) => {
            if(err) return res.json({ success: false });
            else {
                return res.json({ success: true, products: docs });
            }
        })
    })
})

router.post('/:creatorTag', gatekeeperCheck, (req, res, next) => {
    var username = req.params.creatorTag;
    Creator.findOne({ tag: username }).then((user, err) => {
        if(err) return res.json({ success: false });
        if(user) return res.json({ success: true, user });
        else return res.json({ success: false });
    })
})

router.post('/update/:creatorTag', gatekeeperCheck, (req, res, next) => {
    var username = req.params.creatorTag;
    Creator.findOneAndUpdate({ tag: username }, { $set: {
        links: {
            instagram: req.body.instagramLink ?? '',
            tiktok: req.body.tiktokLink ?? '',
            twitter: req.body.twitterLink ?? '',
            twitch: req.body.twitchLink ?? ''
        },
        name: req.body.name ?? ''
    }}).then((doc, err) => {
        if(req.body.password){
            User.findOneAndUpdate({ username: username }, {
                $set: { password: User.encryptPassword(req.body.password) }
            }).then((doc, err) => {
                if(err) return res.json({ success: false });
                else return res.json({ success: true });
            })
        } else {
            if(err) return res.json({ success: false });
            else return res.json({ success: true });
        }
    })
})

module.exports = router;