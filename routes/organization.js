/*
	For dealing with organization specific data
*/

var express = require('express');
var router = express.Router();
var Organization = require('../model/organization');
var Population = require('../model/populations');
var Supported_Strategies = require('../model/supported_strategies');

//Format populations or supported strategies
var formatFundings = function(fundings){

	return {
		_id: fundings._id, 
		area: fundings.area, 
		amount: fundings.amount, 
		organization: fundings.organization
	}
}

//Format organization
var formatOrg = function(organization, haveFormattedFundings, populations, supportedStrategies){
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
	        populations: populations, 
	        supported_strategies: supportedStrategies
		}
	}
	else{
		return {
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
	        populations: organization.populations, 
	        supported_strategies: organization.supported_strategies
	    }
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
	Organization.find({}).sort({name: 1}).populate(['populations', 'supported_strategies']).exec(function(err, docs){
		if (err){
			res.send(500).json({error: 'Could not find / populated all data', success: false});
		}
		else{
			organizations = docs.map(formatOrg, false);
			res.json({success: true, message: organizations});
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
	Organization.findOne({_id: req.params.id}).populate(['populations', 'supported_strategies']).exec(function(err, docs){
		if (err){
			res.send(500).json({error: 'Could not find / populated all data', success: false});
		}
		else{
			organization = docs.map(formatOrg, false);
			res.json({success: true, message: organization});
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

    console.log("hi");
    // get parameters from form
    var user = req.body.user;
    var year = req.body.year;
    var organization = req.body.organization;
    /*var location = req.body.location || "";
    var funder_type = req.body.funder_type;
    var asset_size = req.body.asset_size;
    var annual_giving = req.body.annual_giving;
    var annual_giving_vulnerable = req.body.annual_giving_vulnerable_population;
    var annual_giving_homelessness = req.body.annual_giving_homelessness;
    var state = req.body.state;
    var populations = req.body.populations; // array
    var supported_strategies = req.body.supported_strategies; // array*/

    console.log(user);
    console.log(year);
    /*var user = req.session.user;
    if (user == undefined){
      utils.sendErrResponse(res, 403, 'Error: You must be logged in to use this feature');
      return;
    }

    var listing = new schemas.Listing({"title": title, "description": description, "image": image, "category": category, "seller": user});
    listing.save(function(err){
      if (err){
        utils.sendErrResponse(res, 500, 'Error: could not add listing');
      }
      else {
        utils.sendSuccessResponse(res, listing);
      }
    });*/
});

module.exports = router;












