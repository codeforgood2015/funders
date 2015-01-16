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
// var formatOrg = function(organization, haveFormattedFundings, populations, supportedStrategies){
var formatOrg = function(organization){
	// if (haveFormattedFundings){
	// 	return{
	// 		_id: organization._id, 
	// 		organization_name: organization.organization_name,
	//         user: organization.user,
	//         year: organization.year, 
	//         state: organization.state, 
	//         funder_type: organization.funder_type, 
	//         asset_size: organization.asset_size, 
	//         annual_grantmaking: organization.annual_grantmaking, 
	//         annual_grantmaking_homelessness: organization.annual_grantmaking_homelessness, 
	//         annual_grantmaking_vulnerable_population: organization.annual_grantmaking_vulnerable_population,
	//         populations: populations, 
	//         supported_strategies: supportedStrategies, 
	//         isNational: organization.isNational, 
	//         isFundersMember: organization.isFundersMember
	// 	}
	// }
	// else{
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
	        supported_strategies: organization.supported_strategies, 
	       	isNational: organization.isNational, 
	        isFundersMember: organization.isFundersMember
	    }
	// }
}

/*
	GET '/organization/?q=variable1+variable2+....'
	if q is not defined, then all organizations will be returned
	No request parameters
	Response: 
		- success: true if server succeeded in getting requested organization
		- message: on succes, contains all organization objects 
		- error: on failure, an error message
*/
router.get('/', function(req, res){
	if (Object.keys(req.query).length !== 0){
		var queryString = [];
		if (req.query.state){
			queryString.push({state: req.query.state});
		}
		if (req.query.year){
			queryString.push({year: parseInt(req.query.year)});
		}
		if (req.query.funder_type){
			console.log(req.query.state);
			queryString.push({funder_type: req.query.funder_type})
		}
		if (req.query.populations){
			var query = req.query.populations;
			var populations = query.split(",");
			populations.forEach(function(pop){
				queryString.push({"populations.area": pop})
			})
		}
		if (req.query.supported_strategies){
			var query = req.query.supported_strategies;
			var strategies = query.split(",");
			strategies.forEach(function(str){
				queryString.push({"supported_strategies.area": str})
			})
		}
		if (req.query.national){
			// req.query.national must be true or false
			queryString.push({isNational: req.query.national});
		}
		if (req.query.funders_member){
			queryString.push({isFundersMember: req.query.fundesr_member});
		}

		Organization.find({$and: queryString}).sort({name: 1}).exec(function(err, docs){
			if (err){
				console.log(err)
				utils.sendErrResponse(res, 500, 'Could not find data');
			}
			else{
				organizations = docs.map(formatOrg);
				console.log(organizations);
				utils.sendSuccessResponse(res, {message: organizations});
			}	
		})
	}
	else{
		Organization.find({}).sort({name: 1}).exec(function(err, docs){
			if (err){
				console.log(err)
				utils.sendErrResponse(res, 500, 'Could not find data');
			//res.send(500).json({error: 'Could not find / populated all data', success: false});
			}
			else{
				organizations = docs.map(formatOrg);
				console.log(organizations);
				utils.sendSuccessResponse(res, {message: organizations});
				//res.json({success: true, message: organizations});
			}	
	})
	}
}); 


router.get('/testing', function(req, res){
	console.log(req.query.q);
	console.log(req.query.length);
})




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
    var isNational = req.body.isNational; 
    var isFundersMember = req.body.isFundersMember;

    //var org = new Organization({user:user, year:year, organization_name: organization, location:location, funder_type: funder_type,asset_size: asset_size, annual_grantmaking: annual_grantmaking, annual_grantmaking_vulnerable_population: annual_grantmaking_vulnerable,annual_grantmaking_homelessness: annual_grantmaking_homelessness, state: state, populations: populations_list,supported_strategies:strategies_list});
    var org = new Organization({isNational: isNational, isFundersMember: isFundersMember, user:user, year:year, organization_name: organization, location:location, funder_type: funder_type,asset_size: asset_size, annual_grantmaking: annual_grantmaking, annual_grantmaking_vulnerable_population: annual_grantmaking_vulnerable,annual_grantmaking_homelessness: annual_grantmaking_homelessness, state: state});

    populations_list = [];
    populations.forEach(function(population){
    	//pop = new Population({area: population.fund_area, amount: population.percentage, organization: org._id});
    	pop = {area: population.fund_area, amount: population.percentage};
    	console.log(pop);
    	populations_list.push(pop);
    	/*pop.save(function(err){
    		if (err){
    			console.log(err);
    		}
    	})*/
    })

    strategies_list = [];
    supported_strategies.forEach(function(strategy){
    	//console.log(strategy)
    	//str = new Supported_Strategies({area: strategy.strategy, amount: strategy.percentage, organization: org._id});
    	str = {area: strategy.strategy, amount: strategy.percentage};
    	strategies_list.push(str);
    	/*(str.save(function(err){
    		if(err){
    			console.log(err);
    		}
    	})*/
    })

    org.populations = populations_list;
    org.supported_strategies = strategies_list;
    console.log(org);
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












