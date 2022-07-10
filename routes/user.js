const express = require('express');

const router = express.Router();
const nJwt = require('njwt');
const User = require('../models/user');
const Order = require('../models/order');
const Custom = require('../models/custom');
const CustomsMessage = require('../models/customsMessage');
const Key = require('../models/key');
const { userCheck } = require('../middleware/auth');
const {
  sendPasswordResetEmail,
  sendPasswordChangeEmail,
  sendActivationEmail,
} = require('../services/nodemailer.config');

router.post('/profile', userCheck, (req, res) => {
  const { username } = req.body;
  User.findOne({ username })
    .select('username email image')
    .then((user, err) => {
      if (err || !user) return res.json({ success: false });
      return res.json({ success: true, user });
    });
});

// eslint-disable-next-line consistent-return
router.post('/recover-password', async (req, res) => {
  const { username } = req.body;
  const { token } = req.body;
  const { newPassword } = req.body;

  try {
    const skBuffer = await Key.findOne({ user: username });
    if (skBuffer) {
      const signingKey = Buffer.from(skBuffer.key, 'base64');
      // eslint-disable-next-line consistent-return
      nJwt.verify(token, signingKey, (err, verifiedJwt) => {
        if (err) return res.json({ success: false, message: '' });
        if (verifiedJwt.body.scope === 'password-reset') {
          User.updateOne(
            { username },
            { $set: { password: User.encryptPassword(newPassword) } },
          ).then((u, err2) => {
            if (err2) return res.json({ success: false, message: '' });
            return res.json({ success: true, message: 'password updated' });
          });
        } else return res.json({ success: false, message: 'failed' });
      });
    }
  } catch (err) {
    return res.json({ success: false, message: 'Error' });
  }
});

// eslint-disable-next-line consistent-return
router.post('/change-password', userCheck, async (req, res) => {
  const { username } = req.body;
  const { updateToken } = req.body;
  const { newPassword } = req.body;

  try {
    const key = await Key.findOne({ user: username });
    if (key) {
      const signingKey = Buffer.from(key.key, 'base64');
      // eslint-disable-next-line consistent-return
      nJwt.verify(updateToken, signingKey, (err, verifiedJwt) => {
        if (err) { return res.json({ success: false, message: 'Expired get new link' }); }
        if (verifiedJwt.body.scope === 'password-change') {
          User.updateOne(
            { username },
            { $set: { password: User.encryptPassword(newPassword) } },
          ).then((user, err2) => {
            if (err2) { return res.json({ success: false, message: 'Not updated' }); }
            return res.json({ success: true, message: '' });
          });
        } else return res.json({ success: false, message: 'Invalid token' });
      });
    } else return res.json({ success: false, message: 'Failed' });
  } catch (err) {
    return res.json({ success: false, message: 'failed' });
  }
});

// eslint-disable-next-line consistent-return
router.post('/email-change-password', userCheck, async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    const key = await Key.findOne({ user: user.username });

    // if link saved check its still active and dont send email
    if (user.updateCode) {
      const signingKey = Buffer.from(key.key, 'base64');
      nJwt.verify(user.updateCode, signingKey, (err, verifiedJwt) => {
        if (err) {
          if (key) {
            const jwt = nJwt.create(
              {
                iss: process.env.HOST,
                scope: 'password-change',
              },
              signingKey,
            );
            const token = jwt.compact().toString('base64');
            return User.updateOne({ username }, { $set: { updateCode: token } }).then(
              (u, e) => {
                if (e) return res.json({ success: false, message: '' });

                return sendPasswordChangeEmail(
                  user.email,
                  `${process.env.HOST}/password-change/${token}`,
                ).then(() => res.json({ success: true }))
                  .catch(() => res.json({ success: false }));
              },
            );
          } return res.json({ success: false });
        } if (verifiedJwt.body.scope === 'password-change') { return res.json({ success: true, message: 'Email sent already' }); } return res.json({ success: false, message: 'Invalid token' });
      });
    }

    // put code in the verify
    if (!user.updateCode) {
      if (key) {
        const signingKey = Buffer.from(key.key, 'base64');
        const jwt = nJwt.create(
          {
            iss: process.env.HOST,
            scope: 'password-change',
          },
          signingKey,
        );
        const token = jwt.compact();
        const b64token = token.toString('base64');
        console.log(b64token);
        await User.updateOne({ username }, { $set: { updateCode: b64token } });
        await sendPasswordChangeEmail(
          user.email,
          `${process.env.HOST}/password-change/${b64token}`,
        );
        return res.json({ success: true });
      }
      return res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

// eslint-disable-next-line consistent-return
router.post('/get-reset-password-token', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    const key = await Key.findOne({ user: user.username });
    if (key) {
      const signingKey = Buffer.from(key.key, 'base64');
      const jwt = nJwt.create(
        {
          iss: process.env.HOST,
          scope: 'password-reset',
        },
        signingKey,
      );
      const token = jwt.compact();
      const b64token = token.toString('base64');
      await sendPasswordResetEmail(
        email,
        `${process.env.HOST}/password-recovery/${user.username}/${b64token}`,
      );
      return res.json({ success: true });
    }
  } catch (err) {
    return res.json({ success: false });
  }
});

router.post('/get-activation-token', async (req, res) => {
  const { username } = req.body;
  try {
    const u = await User.findOne({ username });
    await sendActivationEmail(u.email, u.activationCode);
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false });
  }
});

router.post('/check-activation-token', async (req, res) => {
  const { username } = req.body;
  const code = req.body.activationToken;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.json({ success: false, message: 'No User Exists' });
    if (user.activationCode === code && user.accountType !== 'creator') {
      await User.updateOne({ username }, { $set: { accountActivated: true } });
      return res.json({ success: true, message: '' });
    }
    return res.json({ success: false, message: 'Code Incorrect' });
  } catch (err) {
    return res.json({ success: false, message: 'Internal Error' });
  }
});

router.post('/update-password', userCheck, async (req, res) => {
  const { password } = req.body;
  const { username } = req.body;
  try {
    await User.updateOne(
      { username },
      { $set: { password: User.encryptPassword(password) } },
    );
    console.log('success');
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

router.post('/orders', userCheck, async (req, res) => {
  const { username } = req.body;
  try {
    const orders = await Order.find({ user: username });
    const ordersData = orders.map((order) => {
      const d = new Date(order.date);
      const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      return {
        items: order.items.map((o) => o.name),
        date,
        total: order.total,
        sizes: order.items.map((o) => o.size),
      };
    });

    // orders into array
    return res.json({ orders: ordersData });
  } catch (err) {
    return res.json({ orders: null });
  }
});

router.post('/custom/create', userCheck, async (req, res) => {
  const { username } = req.body;
  try {
    const alreadyCreated = await Custom.exists({
      from: username,
      to: req.body.gatekeeper,
    });
    if (alreadyCreated) {
      return res.json({
        success: false,
        message: 'Already submitted custom request',
      });
    }
    const newCustom = new Custom({
      from: username,
      to: req.body.gatekeeper,
      initialDescription: req.body.description,
      initialPrice: req.body.price,
      dateCreated: new Date().toString(),
    });
    await newCustom.save();
    await newCustom.saveMessage({
      from: username,
      to: req.body.gatekeeper,
      message: req.body.description,
    });
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: 'Error' });
  }
});

router.post('/custom/send-message', userCheck, async (req, res) => {
  try {
    const custom = await Custom.findOne({
      from: req.body.username,
      to: req.body.gatekeeper,
    });
    custom.saveMessage({
      from: req.body.username,
      to: req.body.gatekeeper,
      message: req.body.message,
    });
    // var newCustomsMessage = new CustomsMessage({
    //     from: req.body.username,
    //     to: req.body.gatekeeper,
    //     message: req.body.message
    // });
    // await newCustomsMessage.save();
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false });
  }
});

router.post('/custom/all-messages', userCheck, async (req, res) => {
  try {
    const custom = await Custom.findOne({
      from: req.body.username,
      to: req.body.gatekeeper,
    }).populate('messages');
    console.log(custom);
    const messages = await CustomsMessage.find({
      $or: [
        { from: req.body.gatekeeper, to: req.body.username },
        { from: req.body.username, to: req.body.gatekeeper },
      ],
    });
    return res.json({ success: true, messages });
  } catch (err) {
    return res.json({ success: false });
  }
});

router.post('/custom/:gatekeeper', userCheck, async (req, res) => {
  try {
    const custom = await Custom.findOne({
      from: req.body.username,
      to: req.params.gatekeeper,
    });
    if (custom) {
      if (custom.accepted) { return res.json({ success: true, hasCustom: true, accepted: true }); }
      return res.json({ success: true, hasCustom: true, accepted: false });
    }
    return res.json({ success: true, hasCustom: false });
  } catch (err) {
    return res.json({ success: false });
  }
});

module.exports = router;
