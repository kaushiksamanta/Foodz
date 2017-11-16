'use strict';

var Service = require('../Services');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var async = require('async');
var TokenManager = require('../Lib/TokenManager');

var adminLogin = function(userData, callback) {

    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;

    async.series([
        function (cb) {
        var getCriteria = {
            email: userData.email,
            password: UniversalFunctions.CryptData(userData.password)
        };
        Service.AdminService.getAdmin(getCriteria, {}, {}, function (err, data) {
            if (err) {
                cb({errorMessage: 'DB Error: ' + err})
            } else {
                if (data && data.length > 0 && data[0].email) {
                    tokenData = {
                        id: data[0]._id,
                        username: data[0].username,
                        type : UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
                    };
                    cb()
                } else {
                    cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_USER_PASS)
                }
            }
        });
    }, function (cb) {
        var setCriteria = {
            email: userData.email
        };
        var setQuery = {
            $push: {
                loginAttempts: {
                    validAttempt: (tokenData != null),
                    ipAddress: userData.ipAddress
                }
            }
        };
        Service.AdminService.updateAdmin(setCriteria, setQuery, function (err, data) {
            cb(err,data);
        });
    }, function (cb) {
        if (tokenData && tokenData.id) {
            TokenManager.setToken(tokenData, function (err, output) {
                if (err) {
                    cb(err);
                } else {
                    tokenToSend = output && output.accessToken || null;
                    cb();
                }
            });

        } else {
            cb()
        }

    }], function (err, data) {
        responseToSend = {access_token: tokenToSend, ipAddress: userData.ipAddress};
        if (err) {
            callback(err);
        } else {
            callback(null,responseToSend)
        }

    });

};

var addCustomer = function (payload,adminData,cb) {
    Service.CustomerService.createCustomer(payload, function (err, data) {
        if (err) {
            cb({errorMessage: 'DB Error: ' + err})
        } else {
            cb(null,data);
        }
    });
};

var getCustomer = function (payload,cb) {
    if(payload.id){
        var criteria = {
            "_id":payload.id
        }
    }
    else {
        var criteria = {}
    }
    Service.CustomerService.getCustomers(criteria,function (err,data) {
        if(err){
            cb({errorMessage: 'DB Error: ' + err})
        }
        else {
            cb(null,data);
        }
    })
};

var adminLogout = function (token, callback) {
    TokenManager.expireToken(token, function (err, data) {
        if (!err) {
            callback(null, UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT);
        } else {
            callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.TOKEN_ALREADY_EXPIRED)
        }
    })
};

var updateCustomer = function (payload,callback) {
    var criteria = {
        "_id":payload._id
    };
    var dataToSet = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        gender: payload.gender,
        address: {
            street: payload.address.street,
            city: payload.address.city,
            state: payload.address.state,
            zipcode: payload.address.zipcode
        }
    };
    Service.CustomerService.updateCustomer(criteria,{$set:dataToSet},{},function (err,data) {
        if(err){
            callback({errorMessage: 'DB Error: ' + err})
        }
        else {
            callback(null,data);
        }
    });
};

module.exports = {
    adminLogin: adminLogin,
    adminLogout: adminLogout,
    addCustomer: addCustomer,
    getCustomer: getCustomer,
    updateCustomer: updateCustomer
};