var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('map2', {title: 'Map'});
});


router.get('/map2', function(req, res){
  res.render('map2', {title: 'Map'});
})

/* GET input form 1 page. */
router.get('/form1', function(req, res) {
  res.render('form1', { title: 'Form' });
});


/* GET input form 2 page. */
router.get('/form2', function(req, res) {
  res.render('form2', { title: 'Form2' });
});

/* GET overview page. */
router.get('/overview', function(req, res){
	res.render('overview', {title: 'Overview'});
});

module.exports = router;
