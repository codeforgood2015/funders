var express = require('express');
var router = express.Router();

var async = require('async'); 
var validator = require('validator');

var User = require('./../model/user');
var Code = require('./../model/unverifiedCode');
var emailNotifier = require('./../model/helper');


//middleware to check if the user is authenticated
function isAuthenticatedAdmin(req, res, next){
	if (req.user){
		User.findOne({_id: req.user}, function (err, user){
			if (user.group === "admin"){
				return next();
			}
			else{
				res.redirect('/');
			}
		});
	}
	else{
		res.redirect('/');
	}
}

//////////////////////////////////////////////////////////
////////////////////////routes////////////////////////////
//////////////////////////////////////////////////////////

/*
	GET/admin
	shows the admin main dashboard
*/
router.get('/', isAuthenticatedAdmin, function(req, res){
	Code.count({}, function(err, codeCount){
		if (err){
			console.log(err);
		}
		else{
			User.count({}, function(err2, userCount){
				if(err2){
					console.log(err2);
				}
				else{
					res.render('admin_main', {codeReqs: codeCount, users: userCount});
				}
			})
		}
	});
})

/*
	GET /admin/requests
  	shows the admin view of all pending requests
*/
router.get('/requests', isAuthenticatedAdmin, function(req, res){
	Code.find({}).exec(function(err, allCodes){
		res.render('admin_requests', {codes: allCodes, error: req.query.e, message: req.query.msg, success: req.query.s});
	})
});

/*
	GET /admin/requests/accept/:id
	approve a code request with id
*/
router.get('/requests/accept/:id', isAuthenticatedAdmin, function(req, res){
	Code.findOne({_id: req.params.id}).exec(function(err, user){
		user.approved = true;
		user.save(function(err, savedCode){
			if (err){
				console.log(err);
			}
			else{
				//send message to user and admin
				emailNotifier.sendInvitationCode(user.email, user._id, user.name, req.headers.host);
				User.find({group: "admin"}, function(err, admins){
					admins.forEach(function (admin){
						emailNotifier.sendDecisiontoAdmin(admin.email, user.name, 'accepted', user.email);
					});
				});
				
				res.redirect('/admin/requests');
				
			}
		});
	});
})

/*
	GET /admin/requests/reject/:id
	approve a code request with id
*/
router.get('/requests/reject/:id', isAuthenticatedAdmin, function(req, res){
	Code.findOneAndRemove({_id: req.params.id}).exec(function(err, user){
		if (err){
			console.log(err);
		}
		else{
			//send message to user and admin
			emailNotifier.sendDeclinedInvitation(user.email, user.name);
			User.find({group: "admin"}, function(err, admins){
					admins.forEach(function (admin){
						emailNotifier.sendDecisiontoAdmin(admin.email, user.name, 'rejected', user.email);
					});
				});
			
			res.redirect('/admin/requests');
		}
	});
})

/* 
	POST /admin/requests/invite
	admin inviting (auto-approved) users
*/
router.post('/requests/invite', isAuthenticatedAdmin, function(req, res){
	//first find if user already exists
	User.findOne({email: req.body.email}).exec(function(err, olduser){
		if(olduser){
			res.redirect('/admin/requests/?e=true&msg=User already exists');
		}
		else{
			Code.create(req.body.name, req.body.organizationName, req.body.email, req.body.message, function(err, newCode){
				if (newCode===null){
					res.redirect('/admin/requests/?e=true&msg=Could not request invitation code, please try again');
				}
				else {
					newCode.approved=true; 
					newCode.save(function(err, savedCode){
						if(err){
							res.redirect('/admin/requests/?e=true&msg=Could not approve invitation code, please try again');
						}
						else{
							emailNotifier.sendInvitation(newCode.email, newCode._id, newCode.name, req.headers.host);
							User.find({group: "admin"}, function(err, admins){
								admins.forEach(function (admin){
									emailNotifier.sendNotetoAdmin(admin.email, newCode.name, newCode.email);
								});
							});
							res.redirect('/admin/requests/?s=true&msg=Invitation created');
						}
					})
				}
			});
		}
	})
})

/*
	GET /admin/users
  	shows the admin view of all users
*/
router.get('/users', isAuthenticatedAdmin, function(req, res){
	User.findOne({ _id: req.user}, function (err, user){
		User.find({ _id: { $ne: req.user}}).exec(function (err, allUsers){
			res.render('admin_users', {users: allUsers, error: req.query.e, message: req.query.msg, success: req.query.s, currentUser: user});
		});
	});
});

/*
	GET /admin/:code_id
	display a page with details of the user requesting the invitation code
*/
router.get('/:code_id', isAuthenticatedAdmin, function(req, res){
	Code.find({_id: req.params.code_id}).exec(function(err, requestedUser){
		res.render('requested_user', {user: requestedUser[0]});
	})
});


/*
	POST admin/users/remove
*/
router.post('/users/remove', isAuthenticatedAdmin, function(req, res){
	User.findOneAndRemove({email: req.body.email}).exec(function(err, removedUser){
		if (removedUser){
			res.json({success: true, message: 'User is deleted'});
		}
		else{
			res.json({error: true, message: 'Cannot delete user'});
		}
	});
});

/*
	POST admin/users/group/member
*/
router.post('/users/group/member', isAuthenticatedAdmin, function(req, res){
	User.findOne({email: req.body.email}).exec(function(err, user){
		if (user){
			user.group = "member";
			user.save(function(err, savedUser){
				if(err){
					res.json({error: true, message: 'Cannot change user group, please try again.'});
				}
				res.json({success: true, message: 'User is set to be a member'});
			});
		}
		else{
			res.json({error: true, message: 'Cannot change user group, please try again.'});
		}
	});
});

/*
	POST admin/users/group/admin
*/
router.post('/users/group/admin', isAuthenticatedAdmin, function(req, res){
	User.findOne({email: req.body.email}).exec(function(err, user){
		if (user){
			user.group = "admin";
			user.save(function(err, savedUser){
				if(err){
					res.json({error: true, message: 'Cannot change user group, please try again.'});
				}
				res.json({success: true, message: 'User is set to be an admin'});
			});
		}
		else{
			res.json({error: true, message: 'Cannot change user group, please try again.'});
		}
	});
});


module.exports = router;