//Main schema for organization 
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    user: {type: String, required: true},
    year: {type: Number, required: true},
    organization_name: {type: String, required: true},
    state: {type: String, required: true} , 
    funder_type: {type: String, required: true}, 
    asset_size: Number,
    annual_grantmaking: {type: Number, required: true}, 
    annual_grantmaking_vulnerable_population: Number, 
    annual_grantmaking_homelessness: Number, 
    populations: [{type: mongoose.Schema.ObjectId, ref: 'Population'}],//to ref to another database, 
    supported_strategies: [{type: mongoose.Schema.ObjectId, ref: 'Supported_Strategies'}], 
    isNationa: {type: Boolean, required: true},
    isFundersMember: {type: Boolean, required: true}

});

schema.statics.create = function(org_name, user, year, state, funder_type, asset_size, annual_grantmaking, annual_grantmaking_homelessness, annual_grantmaking_vulnerable_population, isNational, isFundersMember, callback) {
    var newOrganization = new Organization({
        organization_name: org_name,
        user: user, 
        year: year, 
        state: state, 
        funder_type: funder_type, 
        asset_size: asset_size, 
        annual_grantmaking: annual_grantmaking, 
        annual_grantmaking_homelessness: annual_grantmaking_homelessness, 
        annual_grantmaking_vulnerable_population: annual_grantmaking_vulnerable_population,
        populations: [], 
        supported_strategies: [], 
        isNational: isNational, 
        isFundersMember: isFundersMember
    });

    newOrganization.save(callback);
}

var Organization = mongoose.model('Organization', schema);

var checkLength = function(s) {
    if (s){
        return s.length > 0;
    } else {
        return false;
    }
};

//TO DO: complete all the checks here!!!! :D
/*Organization.schema.path('organization').validate(checkLength, "Organization name cannot be empty");
Organization.schema.path('about').validate(checkLength, "About cannot be empty");*/

module.exports = Organization;