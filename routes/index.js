var express = require('express');
var router = express.Router();

//for authentication
var mongoose = require('mongoose');
var async = require('async'); 
var crypto = require('crypto');
var passwordHash = require('password-hash');
var passport = require('passport');
// var usernameNotifier = require('./../model/helper');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var emailNotifier = require('./../model/helper');

var User = require('./../model/user');
var Code = require('./../model/unverifiedCode');

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Helper functions and middleware//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
/*
to test that the password of a particular form: 
	- length between 8 and 20
	- only Alphanumeric
	- at least one uppercase letter
	- at least one lowercase letter
*/
var isGoodPassword = function(str){
	var passwordRegex = /^([a-zA-Z0-9_-]){8,20}$/;
	return passwordRegex.test(str);
}

//middleware to check if the user is authenticated
function isAuthenticated(req, res, next){
	if (req.user){
		return next();
	}
	else{
		res.redirect('/');
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Passport.js configuration ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//login with username and password
passport.use('login', new LocalStrategy({
	passReqToCallback: true
	}, function(req, username, password, done){
		if(req.user){
			return done(null, req.user);
		}
		else{
			//User hasn't logged in yet, find a single user
			User.findOne({'email': req.body.username}, function(err, user){
				if(err){
					return done(err); 
				}
				//username does not exist
				if(!user){
					return done(null, false, {error: "Email has not been registered", success: false});
				}
				else{
					if(passwordHash.verify(req.body.password, user.password)){
						return done(null, user);
					}
					//password don't match
					else{
						return done(null, false, {success: false, error: "Password does not match username"});
					}
				}
			})
		}
	}
));

//registering new user
//TODO: implement the invitation code system
passport.use('signup', new LocalStrategy({
	passReqToCallback: true
	}, 
	function(req, username, password, done){
		//user is already signed in 
		if (req.user){
			return done(null, req.user);
		}
		else{
			async.waterfall(
				[
					//check if username is already registered
					function(done){
						User.findOne({'email': req.body.username}, function(err, user){
							if (user){
								return done(null, false, {success: false, error: 'This email is already registered'});
							}
							else{
								done(err);
							}
						});
					}, 

					//check if organization has already been registered
					function(done){
						User.findOne({'organizationName': req.body.organizationName}, function(err, user2){
							if (user2){
								return done(null, false, {success: false, error: 'This organization name has already been registered'});
							}
							else{
								done(err);
							}
						});
					}, 
					//create new user
					function(done){
						User.create(req.body.username, req.body.password, req.body.organizationName, req.body.name, function(err, newUser){
							if (newUser===null){
								return done(null, false, {error: 'Could not create a new user, please try again', success: false});
							}
							else if (err){
								done(err);
							}
							else{
								done(err, newUser);
							}
						});
					}
				], 

				function(err, newUser){
					if (err){
						return done(null, false, {success: false, error: 'An unknown error occured, please try again. '});
					}
					else{
						return done(null, newUser);
					}
				}
			);
		}
	}
));

passport.serializeUser(function(user, next) {
    // store user id
    next(null, user._id);
});

passport.deserializeUser(function(id, next) {
    next(null, id);
});


//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// routes //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

router.get('/dashboard', isAuthenticated, function(req, res){
	var user = req.user;
	User.findOne({_id:user}).populate("organizations").exec(function(err, docs){
		res.render('dashboard', {organizations: docs.organizations})
	})
});

router.get('/profile', isAuthenticated, function(req, res){
	res.render('profile');
});

router.get("/login", function(req, res){
	if(req.user){
		res.redirect("/dashboard");
	}
	res.render('login', {error: req.query.e, message: req.query.msg, error: req.query.e, message: req.query.msg, success: req.query.s})
})

/* GET input form 1 page. */
router.get('/form1', function(req, res) {
	if(req.user){
		User.findOne({ _id:req.user }, function(err, dbUser){
			res.render('form1', { title: 'Form', organizationName: dbUser.organizationName});
		});
  		
  	}
  	else{
  		res.render('login', {error: req.query.e, message: req.query.msg, error: req.query.e, message: req.query.msg, success: req.query.s});
  	}
});


/* GET input form 2 page. */
router.get('/form2', function(req, res) {
  res.render('form2', { title: 'Form2' });
});

/*
	gets the 'Request an invitation code page'
	GET /request
*/
router.get('/request', function(req, res){
	if (req.user){
		res.redirect('/form1');
	}
	res.render('request', {error: req.query.e, message: req.query.msg, success: req.query.s});
});

/*
	creates a new Request
*/
router.post('/request', function(req, res){
	if (req.user){
		res.json({success: false, error:'User is already logged in'});
	}
	else{
		async.waterfall([
			//check that inputs are valid
			function(done){
				req.body.organizationName = validator.toString(req.body.organizationName);
				req.body.message = validator.toString(req.body.message);
				req.body.message = validator.escape(req.body.message);
				req.body.name = validator.toString(req.body.name); 
				req.body.name = validator.escape(req.body.name);
				var checkemail = validator.isEmail(req.body.email);
				if(!checkemail){
					res.json({success: false, error: 'Email is not a valid form'});
				}
				else{
					done(null);
				}
			}, 
			//checking for duplicate organization 
			function(done){
				User.findOne({'organizationName': req.body.organizationName}).exec(function(err, currUser){
					if (currUser){
						res.json({success: false, error: 'This organization is already registered'});
					}
					else{
						done(null);
					}
				})
			}, 

			//checking for duplicate email
			function(done){
				User.findOne({'email': req.body.email}).exec(function(err, currUser){
					if (currUser){
						res.json({success: false, error: 'This email is already registered'});
					}
					else{
						done(null);
					}
				})
			},

			//insert into database
			function(done){
				Code.create(req.body.name, req.body.organizationName, req.body.email, req.body.message, function(err, newCode){
					if (newCode===null){
						return done(null, false, {error: 'Could not request invitation code, please try again'});
					}
					else if (err){
						done(err);
					}
					else{
						done(err, newCode);
					}
				});
			}, 
			//send an email to both parties that it has been created
			function(newCode){
				//send to admins
				User.find({group: "admin"}, function(err, admins){
					admins.forEach(function (admin){
						emailNotifier.sendNotificationtoAdmin(admin.email, newCode.name, req.headers.host, admin.name);
					});
				});
				//send to user who just requested Invitation Code
				emailNotifier.sendNotificationtoNewUser(newCode.email, newCode.name, req.headers.host);
				res.json({success: true, message: "Thank you for requesting a code"});
			}
		], 
		function(err){
			if(err){
				res.status(500).json({error: "There was an error!", success: false});
			}
			else{
				res.json({success: true, message: "Thank you for requesting a code"});
			}
		}
		)
	}
});

/*
	gets the login page if not logged in
	otherwise redirects to map2
	GET /
*/
router.get('/', function(req, res){
	signedin = false;
	admin = false;
	if (req.user){
		signedin = true;
		User.findOne({_id: req.user}).exec(function(err, foundUser){
			if(foundUser.group=='admin'){
				admin =true;
			} 
			res.render('map2', {title: 'Map', loggedin: signedin, admin: admin});
		});
	} else{
		res.render('map2', {title: 'Map', loggedin: signedin, admin: admin});
	}
	
});

/*
	logging in user
	POST /login
*/
router.post('/login', function(req, res, next){
	if(req.user){
		res.json({user: req.user, success: true});
	}
	else{
		async.waterfall([
			function(done){
				var checkpassword = validator.isAlphanumeric(req.body.password);
				var checkusername = validator.isEmail(req.body.username);
				if (!checkusername){
					res.json({success: false, error:'Email is not a valid form'});
				}
				else if (!checkpassword){
					res.json({success: false, error: 'Password is not alphanumeric'});
				}
				else{
					done(null);
				}
			}, 

			function(done){
				passport.authenticate('login', function(err, newUser, info){
					if (err){
						res.status(500).json({error: 'There was an unknown error, please try again'})
					}
					else{
						if(!newUser){
							res.json(info);
						}
						else{
							req.logIn(newUser, function(err){
								if (err){
									res.status(500).json({success: false, error: 'There was an unknown error, please try again'});
								}
								else{
									res.json({user: newUser, success: true});
								}
							});
						}
					}
				})(req, res, next);
			}
		])
	}
});




/* GET logout */
router.get('/logout', function(req, res){
	if (req.user){
		req.logout();
	}

	res.redirect('/');
})

/* GET overview page. */
router.get('/overview', isAuthenticated, function(req, res){
	res.render('overview', {title: 'Overview'});
});

module.exports = router;
