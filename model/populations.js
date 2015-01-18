//Schema for populations

var mongoose = require('mongoose');

var schema = mongoose.Schema({
    area: {type: String, required: true},
	amount: Number,
	organization: {type: mongoose.Schema.ObjectId, ref: 'Organization'}
});

schema.statics.create = function(area, amount, organization, callback) {
    var newPopulation = new Population({
        area: area,
        amount: amount,
        organization: organization
    });

    newFundingArea.save(callback);
}

var Population = mongoose.model('Population', schema);

var checkLength = function(s) {
    if (s){
        return s.length > 0;
    } else {
        return false;
    }
};

//Population.schema.path('area').validate(checkLength, "Funding Area cannot be empty");
//Population.schema.path('amount').validate(checkLength, "Amount cannot be empty");

module.exports = Population;