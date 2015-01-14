var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET input form 1 page. */
router.get('/form1', function(req, res) {
  res.render('form1', { title: 'Form' });
});

/* GET input form 2 page. */
router.get('/form2', function(req, res) {
  res.render('form2', { title: 'Form2' });
});

module.exports = router;
