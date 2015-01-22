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
	        year: organization.year, 
	        longitude: organization.longitude,
	        latitude: organization.latitude,
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

var formatOrgPopulation = function(organization, population){
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
					console.log(population)
		var amount = 0;
		organization.populations.forEach(function(pop){
			//console.log(pop.area)

			if (pop.area == population){
				amount = parseFloat(pop.amount)
			}
		})
		return {
		_id: organization._id, 
			organization_name: organization.organization_name,
	        year: organization.year, 
	        longitude: organization.longitude,
	        latitude: organization.latitude,
	        state: organization.state, 
	        funder_type: organization.funder_type, 
	        asset_size: organization.asset_size, 
	        annual_grantmaking: amount, 
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
				utils.sendSuccessResponse(res, {message: organizations});
				//res.json({success: true, message: organizations});
			}	
	})
	}
}); 

router.get('/:org_id', function(req, res){
	//console.log(req.params.org_id);
	Organization.findOne({_id: req.params.org_id}).exec(function(err, docs){
		if (err){
			console.log(err)
			utils.sendErrResponse(res, 500, 'Could not find data');
		//res.send(500).json({error: 'Could not find / populated all data', success: false});
		}
		else{
				//organizations = docs.map(formatOrg);
				//console.log(organizations);
			utils.sendSuccessResponse(res, docs);
				//res.json({success: true, message: organizations});
		}	
	})	
})

router.get('/population/:population', function(req, res){
		Organization.find({"populations.area": req.params.population}).sort({name: 1}).exec(function(err, docs){
			if (err){
				console.log(err)
				utils.sendErrResponse(res, 500, 'Could not find data');
			//res.send(500).json({error: 'Could not find / populated all data', success: false});
			}
			else{
				//organizations = docs.map(formatOrgPopulation, req.params.population);
				organizations = docs.map(function(d){
					return formatOrgPopulation(d, req.params.population);
				})
				utils.sendSuccessResponse(res, {message: organizations});
				//res.json({success: true, message: organizations});
			}	
	})	
})

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
    var address = req.body.address;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var funder_type = req.body.funder_type;
    var asset_size = req.body.asset_size;
    var annual_grantmaking = req.body.yearDonation;
    var annual_grantmaking_vulnerable = req.body.annual_grantmaking_vulnerable_population || "";
    var annual_grantmaking_homelessness = req.body.annual_grantmaking_homelessness || "";
    var state = req.body.state;
    var populations = req.body.populations; // array
    var supported_strategies = req.body.supported_strategies; // array*/
    var isNational = req.body.isNational; 
    var isFundersMember = req.body.isFundersMember;

    console.log(latitude)
    console.log(longitude)

    //var org = new Organization({user:user, year:year, organization_name: organization, location:location, funder_type: funder_type,asset_size: asset_size, annual_grantmaking: annual_grantmaking, annual_grantmaking_vulnerable_population: annual_grantmaking_vulnerable,annual_grantmaking_homelessness: annual_grantmaking_homelessness, state: state, populations: populations_list,supported_strategies:strategies_list});
    var org = new Organization({latitude: latitude, longitude: longitude, isNational: isNational, isFundersMember: isFundersMember, year:year, organization_name: organization, address:address, asset_size: asset_size, annual_grantmaking: annual_grantmaking, annual_grantmaking_vulnerable_population: annual_grantmaking_vulnerable,annual_grantmaking_homelessness: annual_grantmaking_homelessness, state: state});

    funder_type_list = [];
    funder_type.forEach(function(funder){
    	funder_type_list.push(funder);
    })

    populations_list = [];
    populations.forEach(function(population){
    	pop = {area: population.area, amount: population.amount};
    	populations_list.push(pop);
    })

    strategies_list = [];
    supported_strategies.forEach(function(strategy){
    	str = {area: strategy.area, amount: strategy.amount};
    	strategies_list.push(str);
    })

    org.funder_type = funder_type_list;
    org.populations = populations_list;
    org.supported_strategies = strategies_list;

    console.log(org);
    org.save(function(err){
    	if (err){
			utils.sendErrResponse(res, 500, 'Could not find / populated all data');
    	}
    	else {
			//res.json({success: true, message: "added organization"});
			//res.render('map2');
			res.redirect('/map2');
    	}
    })
});

module.exports = router;












