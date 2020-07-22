var express = require('express');
var router = express.Router();

router.get('/health', function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
