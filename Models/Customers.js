
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoginAttempts = new Schema({
    timestamp: {type: Date, default: Date.now},
    validAttempt: {type: Boolean, required: true},
    ipAddress: {type: String, required: true}
});

var Customers = new Schema({
    first_name: {type: String, trim: true, index: true, default: null},
    last_name: {type: String, trim: true, index: true, default: null},
    email: {type: String, trim: true, unique: true, index: true},
    phone_number:{type: Number , trim: true , unique: true, index: true},
    gender:{type: String, trim: true, default: null},
    address:{
        street:{type: String, trim: true, default: null},
        city:{type: String, trim: true, default: null},
        state:{type: String, trim: true, default: null},
        zipcode:{type: String, trim: true, default: null}
    },
    registrationDate: {type: Date, default: Date.now, required: true},
    loginAttempts: [LoginAttempts]
});

module.exports = mongoose.model('Customers', Customers);