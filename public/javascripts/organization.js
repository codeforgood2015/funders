/*
	For dealing with organization specific data
*/

var express = require('express');
var router = express.Router();
var Organization = require('./../model/organization');
var Funding_Area = require('../model/funding_area');
var Supported_Strategies = require('../model/supported_strategies');

/*
	GET '/organization'
	No request parameters
	Response: 
		- success: true if server succeeded in getting all companies
		- message: on succes, contains all organization objects 
		- error: on failure, an error message
*/
router.get('/', function(req, res){

}); 