var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/map2', function(req, res){
  res.render('map2', {title: 'Map'});
})

router.get('/tests', function(req, res){
	res.render('tests');
})

module.exports = router;
