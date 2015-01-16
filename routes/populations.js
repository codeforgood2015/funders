var express = require('express');
var router = express.Router();
var Organization = require('../model/organization');
var Population = require('../model/populations');
var Supported_Strategies = require('../model/supported_strategies');
var utils = require('../utils.js');

//   GET /keywords/?q=keyword1+keyword2+...
router.get('/', function(req, res){
	if (req.query.q){
		console.log(req.query.q);
		Population.find({area: req.query.q}).populate(['organization']).exec(function(err, docs){
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
})



module.exports = router;