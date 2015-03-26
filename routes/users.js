var express = require('express');
var router = express.Router();

//for authentication
var async = require('async'); 
var passport = require('passport');
var passwordHash = require('password-hash');
var validator = require('validator');
var emailNotifier = require('./../model/helper');
var crypto = require('crypto');

var User = require('./../model/user');
var Code = require('./../model/unverifiedCode');

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Helper functions and middleware//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

var isGoodPassword = function(str){
	var passwordRegex = /^([a-zA-Z0-9_-]){8,20}$/;
	return passwordRegex.test(str);
}

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// routes //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/*
for requesting reset of password
	POST /users/forgot
	Request parameters:
		- email 
	Response: 
		- success: true, if successfully reset password
		- message: on success, contains success message
		- err: on failure, contains error message
*/
router.post('/forgot', function(req, res){
	async.waterfall(
		[	
			function(done){
				var checkemail = validator.isEmail(req.body.email);
				if (!checkemail){
					res.json({success: false, error: 'Email is not a valid email format'});
				}
				else{
					done(null);
				}
			},
			function(done){
				crypto.randomBytes(20, function (err, buf){
					var token = buf.toString('hex');
					done(err, token);
				});
			}, 
			function(token, done){
				User.findOne({email: req.body.email}, function(err, user){
					if (!user){
						res.json({success: false, error: 'No account with that email address exists'});
					}
					else{
						user.resetPasswordToken = token;

						//reset will expire in 1 hour
						user.resetPasswordExpires = Date.now() + 3600000; 

						user.save(function(err){
							done(err, token, user);
						});
					}
				})
			}, 
			function(token, user, done){
				emailNotifier.resetPassword(user, token, req.headers.host);
				done(null, 'done');	
			}
		], 
		function (err){
			if (err){
				res.json({success: false, error: err});
			}
			else{
				res.json({success: true, message: 'An email has been sent to your email address with further instructions'});
			}
		});
});

/*
renders the page for resetting password
	GET /users/reset/:token
*/
router.get('/reset/:token', function(req, res){
	res.render('resetPassword', {token: req.params.token, error: req.query.e, message: req.query.msg});
});

/*
for reseting password
	POST /users/reset/:token
	Request parameters:
		- token: password reset token
		- password: new password
	Response: 
		- success: true, if successfully reset password
		- message: on success, contains success message
		- err: on failure, contains error message
	Cite: written with reference to http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
*/
router.post('/reset/:token', function(req, res){
	async.waterfall(
		[	
			function(done){
				var checkpassword = validator.isAlphanumeric(req.body.password);
				if (!checkpassword){
					res.json({success: false, error: 'Password is not alphanumeric'});
				}
				else{
					done(null);
				}
			},
			function(done){
				User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{$gt: Date.now()}}, function(err, user){
					if(!user){
						res.json({success: false, error: 'Password reset token is invalid or has expired.'});
					}
					else{
						//checks to make sure that the password meets the requirements
						if(!isGoodPassword(req.body.password)){
							res.json({success: false, error: 'Password does not meet password requirements. Please try again'});
						}
						else{
							user.password = passwordHash.generate(req.body.password);
							user.resetPasswordToken = undefined;
							user.resetPasswordExpires = undefined;

							user.save(function(e){
								if (e){
									res.json({success: false, error: 'An unknown error occured, please try again.'});
								}
								else{
									done(null, user);
								}
							});
						}
					}
				});
			}, 

			function(user, done){
				var error = emailNotifier.successfulReset(user);
				done(error, user);
			},

			function(user, done){
				req.logIn(user, function(err){
					if (err){
						res.json({error: 'There was an unknown error', success: false});
					}
					else{
						res.json({success: true, message: 'successfully changed your password'});
					}
				});
			}
		], function(err){
			res.redirect('/');
		});
});

/*
for registering a new user
	POST /users/
	Request parameters:
		- password
		- invitation code 
	Response:
		-success: true if new user is created successfully, otherwise false
		-message: on success, contains success message
		-error: on failure, contains error message
*/
router.post('/', function(req, res, next){
	if(req.user){
		res.redirect('/');
	}
	else{
		async.waterfall(
			[
				//check that all inputs are valid
				function(done){
					var checkpassword = validator.isAlphanumeric(req.body.password);
					var checkpassword2 = validator.isAlphanumeric(req.body.password2);
					var validpassword = isGoodPassword(req.body.password);
					var checkSecondPassword = (req.body.password == req.body.password2);
					if (!checkpassword || !checkpassword2){
						res.json({success: false, error: 'Password is not alphanumeric'});
					}
					else if (!validpassword){
						res.json({success: false, error: 'Password does not meet the password requirements'});
					}
					else if (!checkSecondPassword){
						res.json({success: false, error: 'Passwords do not match'});
					}
					else{
						done(null);
					}
				}, 

				//get the user from the Code database
				function(done){
					Code.findOne({_id: req.body.inviteCode}).exec(function(err, user){
						if (user){
							if (user.approved){
								req.body.username = user.email; 
								req.body.organizationName = user.organizationName; 
								req.body.name = user.name;
								Code.findOneAndRemove({_id: req.body.inviteCode}).exec(function(err, removed){
									if(err){
										res.json({success: false, error: 'Error in removing user'});
									}
									else{
										done(null);
									}
								});
							}
							else{
								res.json({success: false, error: 'User has not been approved by admin yet'});
							}
						}
						else{
							res.json({success: false, error: 'User has not requested invitation code yet'});
						}
					})
				},

				//check to see if username is already used
				function(done){
					User.findOne({'username': req.body.username}, function(err, olduser){
						if(olduser){
							res.json({success: false, error: 'Username already exists'});
						}
						else{
							done(err);
						}
					});
				}, 

				//check if organization name has already been user
				function(done){
					User.findOne({'organizationName': req.body.organizationName}, function(err, duplicateUser){
						if(duplicateUser){
							res.json({success: false, error: 'This organization name already been registered.'});
						}
						else{
							done(err);
						}
					})
				}, 

				//create the new user
				function(done){
					req.body.username = req.body.username;
					req.body.organizationName = req.body.organizationName;
					req.body.password = req.body.password;
					req.body.name = req.body.name;
					passport.authenticate('signup', function(err, newUser, docs){
						if(err){
							res.status(500).json({error: "There was an error"});
						}
						else{
							done(err, newUser);
						}
					})(req, res, next);
				}, 

				function(newUser, done){
					req.logIn(newUser, function(err){
						if(err){
							done(err, 'done');
						}
						else{
							//send email to notify user of account creation
							emailNotifier.sendAccountSuccess(newUser.email, newUser.name, newUser.organizationName);
							res.redirect('/');
						}
					});
				}
			], 

			function(err){
				res.redirect('/')
			}
		)
	}
});

module.exports = router;
