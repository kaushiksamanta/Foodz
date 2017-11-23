'use strict';

var mongoURL;

if (process.env.NODE_ENV == 'test') {
    mongoURL = "mongodb://"+process.env.MONGO_USER_DEV+":"+process.env.MONGO_PASS_DEV+"@"+process.env.DB_IP+"/foodz_test";
} else if (process.env.NODE_ENV == 'dev') {
    mongoURL = "mongodb://"+process.env.MONGO_USER_DEV+":"+process.env.MONGO_PASS_DEV+"@"+process.env.DB_IP+"/"+process.env.DB_NAME_DEV;
}else {
    //mongoURL = 'mongodb://localhost/foodz_dev'
    mongoURL = "mongodb://foodz:1qaz2wsx3edc@ds119406.mlab.com:19406/foodz";
}

var mongo = {
    URI: mongoURL,
    port: 27017
};


module.exports = {
    mongo: mongo
};