const express = require('express');
const fs = require('fs');

const router = express.Router();
const nJwt = require('njwt');
const secureRandom = require('secure-random');
const multer = require('multer');
const Creator = require('../models/creator');
const CreatorProduct = require('../models/product');
const CustomsMessage = require('../models/customsMessage');
const Custom = require('../models/custom');
const User = require('../models/user');
const Order = require('../models/order');
const Key = require('../models/key');
const { gatekeeperCheck } = require('../middleware/auth');

const Outfit = require('../models/outfit');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'creatorImage') cb(null, './client/public/images/');
    else if (file.fieldname === 'outfitImg') {
      cb(null, './client/public/images/library/');
    } else cb(null, './client/public/images/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `-${Date.now()}-${Math.round(Math.random() * 1e9)}.`;
    console.log(file.fieldname + uniqueSuffix + file.mimetype.split('/')[1]);
    cb(null, file.fieldname + uniqueSuffix + file.mimetype.split('/')[1]);
  },
});
const upload = multer({ storage });

// eslint-disable-next-line consistent-return
router.post('/login', async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  let user;
  try {
    user = await User.findOne({ username });
  } catch (err) {
    return res.status(400).json(err);
  }
  if (!user) {
    return res.json({
      success: false,
      message: 'Username or password incorrect',
    });
  }
  if (!user.checkPassword(password)) {
    return res.json({
      success: false,
      message: 'Username or password incorrect',
    });
  }
  if (user.accountType === 'user') return res.json({ success: false });

  const signingKey = secureRandom(256, { type: 'Buffer' });
  const claims = {
    iss: process.env.HOST,
    scope: 'creator',
  };
  const jwt = nJwt.create(claims, signingKey);
  const token = jwt.compact();
  const b64SigningKey = signingKey.toString('base64');

  let result;
  try {
    result = await Key.exists({ user: user.username });
  } catch (err) {
    return res.status(400).json(err);
  }
  if (result) {
    Key.updateOne(
      { user: user.username },
      { $set: { key: b64SigningKey } },
      (err) => {
        if (err) return res.status(400).json(err);
        return res.json({ success: true, token });
      },
    );
  } else {
    const newKey = new Key({
      user: user.username,
      key: b64SigningKey,
    });
    return newKey.save((err) => {
      if (err) return res.status(400).json(err);
      return res.json({ success: true, token });
    });
  }
});

router.post('/orders', gatekeeperCheck, async (req, res) => {
  const creatorUsername = req.body.username;
  try {
    const orders = await Order.find({ creators: { $in: creatorUsername } });
    if (orders) return res.json({ success: true, orders });
    return res.json({ success: true, orders: null });
  } catch (err) {
    return res.json({ success: false });
  }
});

router.post('/outfit/delete', gatekeeperCheck, async (req, res) => {
  await Outfit.findByIdAndDelete(req.body.outfitID);
  //! DELETE IMAGE AFTER
  return res.json({ success: true });
});

router.post(
  '/outfit/create',
  upload.single('outfitImg'),
  gatekeeperCheck,
  async (req, res) => {
    const items = JSON.parse(req.body.items);
    const { name } = req.body;

    const newOutfit = new Outfit({
      user: req.body.username,
      name,
      items,
      image: req.file.filename,
    });
    console.log(newOutfit);
    newOutfit.save();
    return res.json({ success: true });
  },
);

router.get('/outfit/all/:gatekeeper', async (req, res) => {
  const username = req.params.gatekeeper;
  const outfits = await Outfit.find({ user: username });
  return res.json({ success: true, outfits });
});

router.post('/orders/mark-sent', gatekeeperCheck, async (req, res) => {
  try {
    const updated = await Order.updateOne(
      { _id: req.body.orderID },
      { $set: { sent: true } },
    );
    if (updated.modifiedCount > 0) return res.json({ success: true });
    return res.json({ success: false });
  } catch (err) {
    return res.json({ success: false });
  }
});

router.post(
  '/products/add',
  upload.array('images'),
  gatekeeperCheck,
  (req, res) => {
    const creatorUsername = req.body.username;
    const imageNameList = [];

    for (let i = 0; i < req.files.length; i += 1) {
      imageNameList.push(req.files[i].filename);
    }
    Creator.findOne({ tag: creatorUsername }).then((user) => {
      const newProduct = new CreatorProduct({
        // eslint-disable-next-line no-underscore-dangle
        creator: user._id,
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        uri: req.body.uri,
        price: req.body.price,
        count: parseInt(req.body.count, 10),
        images: imageNameList,
        type: req.body.type,
        dateToPost: req.body.dateToPost,
        sizes: req.body.sizes,
        customSize: req.body.customSizeAccept,
        imageOrder: req.body.imageOrder.split(','),
      });
      newProduct.save((err) => {
        if (err) return res.json({ success: false });
        return res.json({ success: true });
      });
    });
  },
);

router.post('/products/remove', gatekeeperCheck, (req, res) => {
  const { productID } = req.body;
  // eslint-disable-next-line consistent-return
  CreatorProduct.findOne({ _id: productID }).then((product, err) => {
    if (err) return res.json({ success: false });
    for (let i = 0; i < product.images.length; i += 1) {
      fs.unlink(
        `./client/public/images/products/${product.images[i]}`,
        (err2) => {
          if (err2) console.log(err2);
        },
      );
    }
    CreatorProduct.deleteOne({ _id: productID }).then((deleted, err2) => {
      if (err2) return res.json({ success: false });
      return res.json({ success: true });
    });
  });
});

router.post(
  '/products/update',
  upload.array('images'),
  gatekeeperCheck,
  (req, res) => {
    const fileNames = [];
    const { productID } = req.body;
    const imagesChanged = req.body.imagesChanged === 'true';
    const imagesCleared = req.body.imagesCleared === 'true';
    let originalImages = [];

    const sizes = req.body.sizes
      ? req.body.sizes
        .replace("'", '')
        .split(',')
        .filter((e) => e.trim())
      : [];

    // eslint-disable-next-line consistent-return
    CreatorProduct.findOne({ _id: productID }, (err, product) => {
      if (err) return res.json({ success: false });
      originalImages = product.images;
      if (imagesChanged) {
        for (let i = 0; i < req.files.length; i += 1) {
          fileNames.push(req.files[i].filename);
        }
        if (imagesCleared) {
          // remove old product images
          for (let i = 0; i < product.images.length; i += 1) {
            fs.unlink(
              `./client/public/images/products/${product.images[i]}`,
              (err2) => {
                if (err2) console.log('Err removing old product images');
              },
            );
          }
        } else originalImages = originalImages.concat(fileNames);
      }

      CreatorProduct.findOneAndUpdate(
        { _id: productID },
        {
          $set: {
            name: req.body.name.trim(),
            description: req.body.description.trim(),
            price: req.body.price,
            count: req.body.count,
            images: imagesChanged && imagesCleared ? fileNames : originalImages,
            type: req.body.type,
            sizes,
            dateToPost: req.body.dateToPost,
            customSize: req.body.customSize,
            imageOrder: req.body.imageOrder.split(','),
          },
        },
        (err3) => {
          if (err3) return res.json({ success: false });
          return res.json({ success: true });
        },
      );
    });
  },
);

router.post('/products/:productID', gatekeeperCheck, (req, res) => {
  const { username } = req.body;
  const { productID } = req.params;

  // eslint-disable-next-line consistent-return
  Creator.findOne({ tag: username }).then((user, err) => {
    if (err) return res.json({ success: false });
    // eslint-disable-next-line no-underscore-dangle
    CreatorProduct.findOne({ creator: user._id, _id: productID }).then(
      (docs, err2) => {
        if (err2) return res.json({ success: false });

        return res.json({ success: true, product: docs });
      },
    );
  });
});

router.post('/products/all/:creatorTag', gatekeeperCheck, (req, res) => {
  const tag = req.params.creatorTag;
  // eslint-disable-next-line consistent-return
  Creator.findOne({ tag }).then((user, err) => {
    if (err) return res.json({ success: false });
    // eslint-disable-next-line no-underscore-dangle
    CreatorProduct.find({ creator: user._id }).then((docs, err2) => {
      if (err2) return res.json({ success: false });

      return res.json({ success: true, products: docs });
    });
  });
});

router.post('/:creatorTag', gatekeeperCheck, (req, res) => {
  const username = req.params.creatorTag;
  Creator.findOne({ tag: username }).then((user, err) => {
    if (err) return res.json({ success: false });
    if (user) return res.json({ success: true, user });
    return res.json({ success: false });
  });
});

router.post(
  '/update/:creatorTag',
  upload.single('creatorImage'),
  gatekeeperCheck,
  (req, res) => {
    const username = req.params.creatorTag;
    // check shipping details are valid
    const shippingKeys = Object.keys(req.body.shippingDetails);
    const { shippingDetails } = req.body;
    for (let i = 0; i < shippingKeys.length; i += 1) {
      if (typeof shippingDetails[shippingKeys[i]] !== 'number') {
        delete shippingDetails[shippingKeys[i]];
      }
    }

    if (req.file) {
      Creator.findOne({ tag: username }).then((doc) => {
        if (doc.image) {
          fs.unlink(`./client/public/images/${doc.image}`, (err) => {
            if (err) console.log('Err removing old product images');
            console.log(req.file);
            Creator.findOneAndUpdate(
              { tag: username },
              {
                $set: {
                  image: req.file.filename,
                },
              },
            ).then((doc2) => {
              console.log(doc2);
            });
          });
        }
      });
    }
    Creator.findOneAndUpdate(
      { tag: username },
      {
        $set: {
          links: {
            instagram: req.body.instagramLink ? req.body.instagramLink : '',
            tiktok: req.body.tiktokLink ? req.body.tiktokLink : '',
            twitter: req.body.twitterLink ? req.body.twitterLink : '',
            twitch: req.body.twitchLink ? req.body.twitchLink : '',
          },
          shippingDetails: JSON.parse(shippingDetails),
          accent: req.body.accent,
          name: req.body.name ? req.body.name : '',
          email: req.body.email ? req.body.email : '',
          customsOn: req.body.customsOn,
          paymentLink: req.body.paymentLink,
        },
      },
    ).then((doc, err) => {
      User.findOneAndUpdate(
        { username },
        {
          $set: { email: req.body.email ? req.body.email : '' },
        },
      ).then((doc2, err2) => {
        if (err2) return res.json({ success: false });
        if (req.body.password) {
          User.findOneAndUpdate(
            { username },
            {
              $set: { password: User.encryptPassword(req.body.password) },
            },
          ).then((doc3, err3) => {
            if (err3) return res.json({ success: false });
            return res.json({ success: true });
          });
        } else {
          if (err) return res.json({ success: false });
          return res.json({ success: true });
        }
        return res.json({ success: true });
      });
    });
  },
);

router.post('/custom/all', gatekeeperCheck, async (req, res) => {
  try {
    const customs = await Custom.find({ to: req.body.username }).populate(
      'messages',
    );
    const newCustoms = new Map();

    for (let i = 0; i < customs.length; i += 1) {
      const customFrom = customs[i].from;
      newCustoms.set(customFrom, {
        price: customs[i].initialPrice,
        description: customs[i].initialDescription,
        accepted: customs[i].accepted,
        messages: customs[i].messages,
      });
    }
    // output format:
    // customs: MAP: { key: { customs properties..., messages: [] }}
    // messages will be sorted on front end as when new messages sent it can sort properly

    // convert map to json before sending

    if (newCustoms) {
      return res.json({
        success: true,
        customs: Object.fromEntries(newCustoms),
      });
    }
    return res.json({ success: true, message: 'empty' });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

router.post('/custom/accept', gatekeeperCheck, async (req, res) => {
  // if email send email
  try {
    await Custom.findOneAndUpdate(
      { from: req.body.user, to: req.body.username },
      { accepted: true },
    );
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false });
  }
});

router.post('/custom/decline', gatekeeperCheck, async (req, res) => {
  try {
    await Custom.findOneAndRemove({
      from: req.body.user,
      to: req.body.username,
    });
    await CustomsMessage.remove({
      $or: [
        { from: req.body.user, to: req.body.username },
        { from: req.body.username, to: req.body.user },
      ],
    });
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

router.post('/custom/send-message', gatekeeperCheck, async (req, res) => {
  try {
    const custom = await Custom.findOne({
      $or: [
        { from: req.body.username, to: req.body.to },
        { from: req.body.to, to: req.body.username },
      ],
    });
    await custom.saveMessage({
      from: req.body.username,
      to: req.body.to,
      message: req.body.message,
      type: req.body.type,
    });
    // var newMsg = new CustomsMessage({
    //     from: req.body.username,
    //     to: req.body.to,
    //     message: req.body.message,
    //     type: req.body.type
    // });
    // await newMsg.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

router.post('/custom/read', gatekeeperCheck, async (req, res) => {
  try {
    await CustomsMessage.updateMany(
      { from: req.body.to, to: req.body.username },
      { $set: { read: true } },
    );
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false });
  }
});

router.get('/custom/check', async (req, res) => {
  try {
    const r = await Creator.findOne({ tag: req.query.username });
    if (r) return res.json({ success: true, customsOn: r.customsOn });
    return res.json({ success: false });
  } catch (err) {
    return res.json({ success: false });
  }
});

module.exports = router;
