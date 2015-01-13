var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET input form page. */
router.get('/form1', function(req, res) {
  res.render('form1', { title: 'Form' });
});

module.exports = router;
