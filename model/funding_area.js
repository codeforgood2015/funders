//Schema for funding areas

var mongoose = require('mongoose');

var schema = mongoose.Schema({
    area: {type: String, required: true},
	amount: Number,
	organization: {type: mongoose.Schema.ObjectId, ref: 'Organization'}
});

schema.statics.create = function(area, amount, organization, callback) {
    var newFundingArea = new Funding_Area({
        area: area,
        amount: amount,
        organization: organization
    });

    newFundingArea.save(callback);
}

var Funding_Area = mongoose.model('Funding_Area', schema);

var checkLength = function(s) {
    if (s){
        return s.length > 0;
    } else {
        return false;
    }
};

Funding_Area.schema.path('area').validate(checkLength, "Funding Area cannot be empty");
Funding_Area.schema.path('amount').validate(checkLength, "Amount cannot be empty");

module.exports = Funding_Area;