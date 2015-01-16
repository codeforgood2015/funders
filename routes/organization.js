/*
	For dealing with organization specific data
*/

var express = require('express');
var router = express.Router();
var Organization = require('../model/organization');
var Population = require('../model/populations');
var Supported_Strategies = require('../model/supported_strategies');
var utils = require('../utils.js');

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
	        annual_grantmaking: organization.annual_grantmaking, 
	        annual_grantmaking_homelessness: organization.annual_grantmaking_homelessness, 
	        annual_grantmaking_vulnerable_population: organization.annual_grantmaking_vulnerable_population,
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
	        annual_grantmaking: organization.annual_grantmaking, 
	        annual_grantmaking_homelessness: organization.annual_grantmaking_homelessness, 
	        annual_grantmaking_vulnerable_population: organization.annual_grantmaking_vulnerable_population,
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
			console.log(err)
			utils.sendErrResponse(res, 500, 'Could not find / populated all data');
			//res.send(500).json({error: 'Could not find / populated all data', success: false});
		}
		else{
			organizations = docs.map(formatOrg, false);
			console.log(organizations);
			utils.sendSuccessResponse(res, {message: organizations});
			//res.json({success: true, message: organizations});
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

    // get parameters from form
    var user = req.body.user;
    var year = req.body.year;
    var organization = req.body.organization;
    var location = req.body.location;
    var funder_type = req.body.funder_type;
    var asset_size = req.body.asset_size;
    var annual_grantmaking = req.body.annual_grantmaking;
    var annual_grantmaking_vulnerable = req.body.annual_grantmaking_vulnerable_population;
    var annual_grantmaking_homelessness = req.body.annual_grantmaking_homelessness;
    var state = req.body.state;
    var populations = req.body.populations; // array
    var supported_strategies = req.body.supported_strategies; // array*/

    //var org = new Organization({user:user, year:year, organization_name: organization, location:location, funder_type: funder_type,asset_size: asset_size, annual_grantmaking: annual_grantmaking, annual_grantmaking_vulnerable_population: annual_grantmaking_vulnerable,annual_grantmaking_homelessness: annual_grantmaking_homelessness, state: state, populations: populations_list,supported_strategies:strategies_list});
    var org = new Organization({user:user, year:year, organization_name: organization, location:location, funder_type: funder_type,asset_size: asset_size, annual_grantmaking: annual_grantmaking, annual_grantmaking_vulnerable_population: annual_grantmaking_vulnerable,annual_grantmaking_homelessness: annual_grantmaking_homelessness, state: state});

    populations_list = [];
    populations.forEach(function(population){
    	pop = new Population({area: population.fund_area, amount: population.percentage, organization: org._id});
    	populations_list.push(pop._id);
    	pop.save(function(err){
    		if (err){
    			console.log(err);
    		}
    	})
    })

    strategies_list = [];
    supported_strategies.forEach(function(strategy){
    	//console.log(strategy)
    	str = new Supported_Strategies({area: strategy.strategy, amount: strategy.percentage, organization: org._id});
    	strategies_list.push(str._id);
    	str.save(function(err){
    		if(err){
    			console.log(err);
    		}
    	})
    })

    org.populations = populations_list;
    org.supported_strategies = strategies_list;
    //console.log(org);
    org.save(function(err){
    	if (err){
			utils.sendErrResponse(res, 500, 'Could not find / populated all data');
    	}
    	else {
			res.json({success: true, message: "added organization"});
    	}
    })
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












