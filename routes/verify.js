var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode the token
    if (token) {
        // verifies secret and checks expiration - If Token is expired ask to log in(not implemented).
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated as ordinary user or token is expired!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
console.log('decoded = ', decoded);
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};

/*exports.verifyAdmin = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode the token
    if (token) {
        // verifies secret and checks expiration
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated as user!');
                err.status = 401;
                return next(err);
			}
			// Check if user is NOT admin
			else if (!decoded._doc.admin) {
                var err = new Error('You are not authenticated as admin!');
                err.status = 401;
				console.log('decoded = ', decoded);
                return next(err);
			}
            else {
                // if everything is good, save to request for use in other routes
console.log('decoded = ', decoded._doc.admin);
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};*/



exports.verifyAdmin = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                if(req.decoded._doc.admin == false){
                    var err = new Error('You are not Authorized to perform this operation!');
                    err.status = 403;
                    return next(err);
                }
                else{
                    next();
                }
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};
