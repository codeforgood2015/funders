var express = require('express');
var router = express.Router();
var Organization = require('../model/organization');
var Population = require('../model/populations');
var Supported_Strategies = require('../model/supported_strategies');
var utils = require('../utils.js');

//   GET /keywords/?q=keyword1+keyword2+...
/*router.get('/', function(req, res){
	if (req.query.q){
		console.log(req.query.q);
		Supported_Strategies.find({area: req.query.q}).populate(['organization']).exec(function(err, docs){
			orgs_list = []
			docs.forEach(function(doc){
				orgs_list.push(doc.organization);
			})
			utils.sendSuccessResponse(res, orgs_list);
		})
	}
	else {
		utils.sendSuccessResponse(res);
	}
})*/

//   GET /keywords/?q=keyword1+keyword2+...
router.get('/', function(req, res){
	if (req.query.q){
		console.log(req.query.q);
		//Organization.find({'year': req.query.q}).exec(function(err, docs){
		Organization.find({'supported_strategies.area': req.query.q}).exec(function(err, docs){
			utils.sendSuccessResponse(res, docs);
		})
	}
	else {
		utils.sendSuccessResponse(res);
	}
})



module.exports = router;