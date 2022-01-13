const nJwt = require('njwt');
const Key = require('../client/src/models/key'); 

async function resolveSigningKey(username){
    var keyRecord;
    try{
        keyRecord = await Key.findOne({ user: username })
    } catch(err) {
        return false;
    }
    if(keyRecord) return keyRecord.key;
    else return false;
}

module.exports.userCheck = async function userCheck(req, res, next){
    var token = req.body.token;
    var username = req.body.username;
    var key = await resolveSigningKey(username);
    if(key){
        var signingKey = Buffer.from(key, 'base64');
        nJwt.verify(token, signingKey, function(err, verifiedJwt){
            if(err){
                return res.json({ success: false });
            } else {
                if(verifiedJwt.body.scope == 'user') next();
                else return res.json({ success: false });
            }
        })
    } else {
        return res.json({ success: false });
    }
}

module.exports.gatekeeperCheck = async function gatekeeperCheck(req, res, next){
    var token = req.body.token;
    var username = req.body.username;
    var key = await resolveSigningKey(username);
    if(key){
        var signingKey = Buffer.from(key, 'base64');
        nJwt.verify(token, signingKey, function(err, verifiedJwt){
            if(err) return res.json({ success: false });
            else{
                if(verifiedJwt.body.scope == 'creator') next();
                else return res.json({ success: false });
            }
        })
    }
}