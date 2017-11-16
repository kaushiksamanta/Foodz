'use strict';

var Models = require('../Models');

//Get Customer from DB
var getCustomers = function (criteria, projection, options, callback) {
    Models.Customers.find(criteria, projection, options, callback);
};

//Insert Customer in DB
var createCustomer = function (objToSave, callback) {
    new Models.Customers(objToSave).save(callback);
};

//Update Customer in DB
var updateCustomer = function (criteria, dataToSet, options, callback) {
    Models.Customers.findOneAndUpdate(criteria, dataToSet, options, callback);
};

module.exports = {
    createCustomer: createCustomer,
    getCustomers:getCustomers,
    updateCustomer:updateCustomer
};

