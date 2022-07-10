const express = require('express');
const path = require('path');

const router = express.Router();

// server react build files
router.get('*', (req, res) => {
  console.log(path.join(__dirname, '../client/build/index.html'));
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;
