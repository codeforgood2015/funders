//Schema for Users

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types;
var password_hash = require('password-hash');

var userSchema = mongoose.Schema({
	email: {type: String, required: true},
	password: {type: String, required: true}, 
	organizationName: {type: String, required: true},
	group:{type: String, default: "member"},

	//for resetting password 
	// resetPasswordToken: {type: String}, 
	// resetPasswordExpires: {type: Date}
});

userSchema.statics.create = function(email, password, organizationName, callback){
	var password = password_hash.generate(password);
	var createNewUser = new User({
		'email': email, 
		'password': password, 
		'organizationName': organizationName
	});

	createNewUser.save(callback);
}

var User = mongoose.model('User', userSchema);

var validateStrLength = function(str){
	if(str){
		return str.length > 0;
	}
	else{
		return false;
	}
};

User.schema.path('organizationName').validate(validateStrLength, 'Organization name must be entered');
User.schema.path('password').validate(validateStrLength, 'Password cannot be empty');

module.exports = User;

