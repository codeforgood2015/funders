//Schema for supported strategies

var mongoose = require('mongoose');

var schema = mongoose.Schema({
    area: {type: String, required: true},
	amount: Number,
	organization: {type: mongoose.Schema.ObjectId, ref: 'Organization'}
});

schema.statics.create = function(area, amount, organization, callback) {
    var newSupportedStrategies = new Supported_Strategies({
        area: area,
        amount: amount,
        organization: organization
    });

    newSupportedStrategies.save(callback);
}

var Supported_Strategies= mongoose.model('Supported_Strategies', schema);

var checkLength = function(s) {
    if (s){
        return s.length > 0;
    } else {
        return false;
    }
};

/*Supported_Strategies.schema.path('area').validate(checkLength, "Funding Area cannot be empty");
Supported_Strategiesschema.path('amount').validate(checkLength, "Amount cannot be empty");*/

module.exports = Supported_Strategies;