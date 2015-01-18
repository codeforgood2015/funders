/*
	For dealing with organization specific data
*/

var express = require('express');
var router = express.Router();
var Organization = require('./../model/organization');
var Funding_Area = require('../model/funding_area');
var Supported_Strategies = require('../model/supported_strategies');

//Format funding area or supported strategies
var formatFundings = function(fundings){
	_id: fundings._id, 
	area: fundings.area, 
	amount: fundings.amount, 
	organization: fundings.organization
}


//Format organization
var formatOrg = function(organization, haveFormattedFundings, fundingArea, supportedStrategies){
	if (haveFormattedFundings){
		return{
			_id: organization._id, 
			organization_name: organization.organization_name,
	        user: organization.user, 
	        year: organization.year, 
	        state: organization.state, 
	        funder_type: organization.funder_type, 
	        asset_size: organization.asset_size, 
	        annual_giving: organization.annual_giving, 
	        annual_giving_homelessness: organization.annual_giving_homelessness, 
	        annual_giving_vulnerable_population: organization.annual_giving_vulnerable_population,
	        funding_areas: organization.funding_areas, 
	        supported_strategies: organization.supported_strategies
		}
	}
	else{
		_id: organization._id, 
			organization_name: organization.organization_name,
	        user: organization.user, 
	        year: organization.year, 
	        state: organization.state, 
	        funder_type: organization.funder_type, 
	        asset_size: organization.asset_size, 
	        annual_giving: organization.annual_giving, 
	        annual_giving_homelessness: organization.annual_giving_homelessness, 
	        annual_giving_vulnerable_population: organization.annual_giving_vulnerable_population,
	        funding_areas: organization.funding_areas, 
	        supported_strategies: organization.supported_strategies
	}
}

/*
	GET '/organization'
	-> returns all the organizations
	No request parameters
	Response: 
		- success: true if server succeeded in getting all companies
		- message: on succes, contains all organization objects 
		- error: on failure, an error message
*/
router.get('/', function(req, res){
	Organization.find({}).sort({name: 1}).populate(['funding_area', 'supported_strategies']).exec(function(err, docs){
		if (err){
			res.send(500).json({error: 'Could not find / populated all data', success: false});
		}
		else{
			var organizations = docs.map(formatOrg, false);
			res.json({success: true}, message: organizations);
		}
	});
}); 

/*
	GET '/organization/:id'
	-> returns the organization with the corresponding id
	No request parameters
	Response: 
		- success: true if server succeeded in getting that organization
		- message: on succes, contains one organization object
		- error: on failure, an error message
*/
router.get('/:id', function(req, res){
	Organization.findOne({_id: req.params.id}).populate(['funding_area', 'supported_strategies']).exec(function(err, docs){
		if (err){
			res.send(500).json({error: 'Could not find / populated all data', success: false});
		}
		else{
			var organization = docs.map(formatOrg, false);
			res.json({success: true}, message: organization);
		}
	});
}); 

/*
	GET '/organization/state/:state'
	-> returns all the organizations that are from a certain state
	Response: 
		- success: true if server succeeded in getting all relevant organization
		- message: on success, contains all organization objects from a state 
		- error: on failure, an error message
*/
router.get('/state/:state', function(req, res){
	Organization.find({state: req.params.state}).populate(['funding_area', 'supported_strategies']).exec(function(err, docs){
		if (err){
			res.send(500).json({error: 'Could not find / populated all data', success: false});
		}
		else{
			var organizations = docs.map(formatOrg, false);
			res.json({success: true}, message: organizations);
		}
	});
}); 



/*
	POST '/organization'
	Response: 
		-success: true if the server succeeds in creating the organization
		-message: newly created organization object
		-error: on failure, an error message 
*/
router.post('/', function(req, res){
	Organization.find({organization_name: req.body.SOMETHING??, year: req.body.SOMETHING??}, function(err, organization){
		//TODO!!! :) 
	})
})












