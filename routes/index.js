var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  await res.json({
      mess:"done"
  })
});

module.exports = router;
