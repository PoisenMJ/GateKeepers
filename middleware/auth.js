const nJwt = require('njwt');
const Key = require('../models/key');

async function resolveSigningKey(username) {
  let keyRecord;
  try {
    keyRecord = await Key.findOne({ user: username });
  } catch (err) {
    return false;
  }
  if (keyRecord) return keyRecord.key;
  return false;
}

// eslint-disable-next-line consistent-return
module.exports.userCheck = async function userCheck(req, res, next) {
  const { token } = req.body;
  const { username } = req.body;
  const key = await resolveSigningKey(username);
  if (key) {
    const signingKey = Buffer.from(key, 'base64');
    nJwt.verify(token, signingKey, (err, verifiedJwt) => {
      if (err) {
        return res.json({ success: false });
      } if (verifiedJwt.body.scope === 'user') return next();
      return res.json({ success: false });
    });
  } else {
    return res.json({ success: false });
  }
};

module.exports.gatekeeperCheck = async function gatekeeperCheck(req, res, next) {
  const { token } = req.body;
  const { username } = req.body;
  const key = await resolveSigningKey(username);
  if (key) {
    const signingKey = Buffer.from(key, 'base64');
    nJwt.verify(token, signingKey, (err, verifiedJwt) => {
      if (err) return res.json({ success: false });

      if (verifiedJwt.body.scope === 'creator') return next();
      return res.json({ success: false });
    });
  }
};
