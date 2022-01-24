var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('*', function(req, res, next) {
  console.log(path.join(__dirname, '../client/build/index.html'));
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;
