'use strict';
var Controller = require('../Controllers');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var Joi = require('joi');

var non_auth_routes = [
    {
        method: 'POST',
        path: '/api/admin/login',
        config: {
            description: 'Login for Super Admin',
            tags: ['api', 'admin'],
            handler: function (request, reply) {
                var queryData = {
                    email: request.payload.email,
                    password: request.payload.password,
                    ipAddress: request.info.remoteAddress || null
                };
                Controller.AdminController.adminLogin(queryData, function (err, data) {
                    if (err) {
                        reply(UniversalFunctions.sendError(err))
                    } else {
                        reply(UniversalFunctions.sendSuccess(null, data))
                    }
                })
            },
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    }

];

var userRoutes = [
    {
        method: 'POST',
        path: '/api/admin/addCustomer',
        handler: function (request, reply) {
            var customerData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            Controller.AdminController.addCustomer(request.payload,customerData, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(null, "Customer added successfully !"))
                }
            });
        },
        config: {
            description: 'Add Customer Data',
            tags: ['api', 'Customer'],
            auth: 'Auth',
            validate: {
                payload: {
                    first_name: Joi.string().required().trim(),
                    last_name: Joi.string().required().trim(),
                    email: Joi.string().email().required(),
                    phone_number: Joi.number().integer(),
                    gender: Joi.string().valid('female', 'male', 'undisclosed'),
                    address: {
                        street: Joi.string().trim(),
                        city: Joi.string().trim(),
                        state: Joi.string().trim(),
                        zipcode: Joi.string().trim()
                    }
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            // plugins: {
            //     'hapi-swagger': {
            //         payloadType: 'form',
            //         responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            //     }
            // }
        }
    },
    {
        method: 'POST',
        path: '/api/admin/getCustomers',
        handler: function (request, reply) {
            Controller.AdminController.getCustomer(request.payload, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(null, data));
                }
            });
        },
        config: {
            description: 'Get All Customers Data',
            tags: ['api', 'Customer'],
            auth: 'Auth',
            validate: {
                payload: {
                    id: Joi.string()
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/admin/updateCustomer',
        handler: function (request, reply) {
            Controller.AdminController.updateCustomer(request.payload, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(null, "Customer updated successfully !"))
                }
            });
        },
        config: {
            description: 'Update Customer Data',
            tags: ['api', 'Customer'],
            auth: 'Auth',
            validate: {
                payload: {
                    _id:Joi.string().required(),
                    first_name: Joi.string().required().trim(),
                    last_name: Joi.string().required().trim(),
                    gender: Joi.string().valid('female', 'male', 'undisclosed'),
                    address: {
                        street: Joi.string().trim(),
                        city: Joi.string().trim(),
                        state: Joi.string().trim(),
                        zipcode: Joi.string().trim()
                    }
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            }
        }
    }
];

var adminLogin = [
    {
        method: 'PUT'
        , path: '/api/admin/logout'
        , handler: function (request, reply) {
        Controller.AdminController.adminLogout(request.payload.token, function (err, data) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess("Successfully Logged out !"))
            }
        });
    }, config: {
        description: 'Logout for Super Admin',
        tags: ['api', 'admin'],
        validate: {
            failAction: UniversalFunctions.failActionFunction,
            payload: {
                token: Joi.string().required()
            }
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
    }
];


var authRoutes = [].concat(userRoutes, adminLogin);

module.exports = authRoutes.concat(non_auth_routes);