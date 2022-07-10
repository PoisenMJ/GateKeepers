const express = require('express');

const router = express.Router();

const crypto = require('crypto');

const nJwt = require('njwt');
const secureRandom = require('secure-random');
const Key = require('../models/key');
const User = require('../models/user');
const { sendActivationEmail } = require('../services/nodemailer.config');

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
  if (!user) return res.json({ success: false, message: 'Username or password incorrect' });
  if (user.instaLogin) return res.json({ success: false, message: 'Instagram login' });
  if (!(user.checkPassword(password))) return res.json({ success: false, message: 'Username or password incorrect' });
  if (user.accountActivated === false) return res.json({ success: false, message: 'activate account' });
  if (user.accountType === 'creator') return res.json({ success: false, message: 'Username or password incorrect' });

  const signingKey = secureRandom(256, { type: 'Buffer' });
  const claims = {
    iss: process.env.HOST,
    scope: 'user',
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
    Key.updateOne({ user: user.username }, { $set: { key: b64SigningKey } }, (err) => {
      if (err) return res.status(400).json(err);
      return res.json({ success: true, token });
    });
  } else {
    const newKey = new Key({
      user: user.username,
      key: b64SigningKey,
    });
    newKey.save((err) => {
      if (err) return res.status(400).json(err);
      return res.json({ success: true, token });
    });
  }
});

// eslint-disable-next-line consistent-return
router.post('/instagram-login', async (req, res) => {
  const { username } = req.body;
  const { type } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    if (user.accountType === 'user' && user.instaLogin) {
      const signingKey = secureRandom(256, { type: 'Buffer' });
      const claims = {
        iss: process.env.HOST,
        scope: type,
      };
      const jwt = nJwt.create(claims, signingKey);
      const token = jwt.compact();
      const b64SigningKey = signingKey.toString('base64');
      Key.updateOne({ user: username }, { $set: { key: b64SigningKey } }, (err) => {
        if (err) return res.status(400).json(err);
        return res.json({ success: true, token, type: 'user' });
      });
    } else if (user.accountType === 'creator' && type === 'creator') {
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
        result = await Key.exists({ user: username });
      } catch (err) {
        return res.status(400).json(err);
      }
      console.log(result);
      if (result) {
        Key.updateOne({ user: username }, { $set: { key: b64SigningKey } }, (err) => {
          if (err) return res.status(400).json(err);
          return res.json({ success: true, token, type: 'creator' });
        });
      } else {
        const newKey = new Key({
          user: username,
          key: b64SigningKey,
        });
        newKey.save((err) => {
          if (err) return res.status(400).json(err);
          return res.json({ success: true, token, type: 'creator' });
        });
      }
    } else return res.json({ success: false, message: 'username taken' });
  } else {
    // first time login
    const newUser = new User({
      username,
      instaLogin: true,
      password: secureRandom(20).toString(),
    });
    await newUser.save();
    const signingKey = secureRandom(256, { type: 'Buffer' });
    const claims = {
      iss: process.env.HOST,
      scope: 'user',
    };
    const jwt = nJwt.create(claims, signingKey);
    const token = jwt.compact();
    const b64SigningKey = signingKey.toString('base64');
    const newKey = new Key({
      user: user.username,
      key: b64SigningKey,
    });
    newKey.save((err) => {
      if (err) return res.status(400).json(err);
      return res.json({ success: true, token, type: 'user' });
    });
  }
});

router.post('/create-account', async (req, res) => {
  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  const usernameExists = await User.exists({ username });
  if (usernameExists) return res.json({ success: false, message: 'Username Taken' });
  const emailExists = await User.exists({ email });
  if (emailExists) return res.json({ success: false, message: 'Email Taken' });

  const token = crypto.randomInt(0, 10000000);

  const user = new User({
    username,
    email,
    password,
    activationCode: token,
  });
  try {
    await user.save();
    sendActivationEmail(username, email, token);
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: 'Creation Error' });
  }
});

// route to check token for normal user
// eslint-disable-next-line consistent-return
router.post('/check-token', async (req, res) => {
  let signingKeyb64;
  try {
    signingKeyb64 = await Key.findOne({ user: req.body.username });
  } catch (err) {
    return res.json({ success: false });
  }
  // change key back into buffer
  let signingKey;
  if (signingKeyb64) signingKey = Buffer.from(signingKeyb64.key, 'base64');
  else return res.json({ success: false });

  nJwt.verify(req.body.token, signingKey, (err, verifiedJwt) => {
    if (err) return res.json({ success: false });
    if (verifiedJwt.body.scope === 'user') return res.json({ success: true });
    if (verifiedJwt.body.scope === 'creator') return res.json({ success: false, message: 'creator' });
    return res.json({ success: false });
  });
});

// route to check token for creator
// eslint-disable-next-line consistent-return
router.post('/check-creator-token', async (req, res) => {
  const { username } = req.body;
  const { token } = req.body;

  let signingKeyb64;
  try {
    signingKeyb64 = await Key.findOne({ user: username });
  } catch (err) {
    return res.json({ success: false });
  }

  let signingKey;
  if (signingKeyb64) signingKey = Buffer.from(signingKeyb64.key, 'base64');
  else return res.json({ success: false });

  nJwt.verify(token, signingKey, (err, verifiedJwt) => {
    if (err) return res.json({ success: false });
    if (verifiedJwt.body.scope === 'creator') return res.json({ success: true });
    return res.json({ success: false });
  });
});

module.exports = router;
