//Schema for users who have requested an invite code / been invited

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types; 

var unverifiedCodeSchema = mongoose.Schema({
	name: {type: String, required: true}, 
	organizationName: {type: String, required: true},
	email: {type: String, required: true}, 
	message: {type: String}, 
	createdOn: {type: Date, default: Date.now()}, 
	approved: {type: Boolean, default: false}
	// may not need to expire, admins can approve or reject request
});

unverifiedCodeSchema.statics.create = function (name, organizationName, email, message, callback){
	var createNewCode = new Code({
		'name': name, 
		'organizationName': organizationName, 
		'email': email, 
		'message': message
	});

	createNewCode.save(callback);
}

var Code = mongoose.model('UnverifiedCode', unverifiedCodeSchema);

module.exports = Code;