'use strict';
var mongoose = require('mongoose');
var Config = require('../Config');
var SocketManager = require('../Lib/SocketManager');
var Service = require('../Services');
var async = require('async');

//Connect to MongoDB
mongoose.connect(Config.dbConfig.mongo.URI, function (err) {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    } else {
        console.log('MongoDB Connected');
    }
});

exports.bootstrapAdmin = function (callback) {
    var adminData1 = {
        email: 'kaushiksamanta23@gmail.com',
        password: '1e7eebb19ca71233686f26a43bbc18a9',
        name: 'Kaushik Samanta'
    };
    async.parallel([
        function (cb) {
            insertData(adminData1.email, adminData1, cb)
        }
    ], function (err, done) {
        callback(err, 'Bootstrapping finished');
    });
};

function insertData(email, adminData, callback) {
    var needToCreate = true;
    async.series([function (cb) {
        var criteria = {
            email: email
        };
        Service.AdminService.getAdmin(criteria, {}, {}, function (err, data) {
            if (data && data.length > 0) {
                needToCreate = false;
            }
            cb()
        })
    }, function (cb) {
        if (needToCreate) {
            Service.AdminService.createAdmin(adminData, function (err, data) {
                cb(err, data)
            })
        } else {
            cb();
        }
    }], function (err, data) {
        console.log('Bootstrapping finished for ' + email);
        callback(err, 'Bootstrapping finished')
    })
}

//Start Socket Server
exports.connectSocket = SocketManager.connectSocket;


