// The dependencies - NPMs
var express = require('express');
var router = express.Router();
var passport = require('passport');
// local deps
var User = require('../models/user');
var Verify = require('./verify');

/* GET ~/users endpoint listing for admin. */
router.get('/', Verify.verifyAdmin, function(req, res, next) {
	User.find({}, function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});

/* GET users listing. */
/*router.get('/',Verify.verifyAdmin, function (req, res, next) {
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
          userMap[user._id] = user;
        });

        res.send(userMap);  
      });
});*/

// POST to ~/users/register endpoint
router.post('/register', function(req, res) {
	
	// Register the user as new with the {username} and password, + callback
    User.register(new User({ username : req.body.username }),
      req.body.password, function(err, user) {
        if (err) {
			// This error handler probably checks for user already existing which should handle that very different
            return res.status(500).json({err: err});
        }
		
		// Adding firstname and lastname to db if provided at registration.
		if (req.body.firstname) {
			user.firstname = req.body.firstname;
		}
		if (req.body.lastname) {
			user.lastname = req.body.lastname;
		}
		
		// Checking to see if registration was successful
        passport.authenticate('local')(req, res, function () {			
            return res.status(200).json({status: 'Registration Successful!'});
			
			// This is probably where we should login this user with the full login code that follows!
        });
    });
});

// POST to ~/users/login endpoint
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
	// Just some system error
      return next(err);
    }
    if (!user) {
	// Error because the user parameter does not exist - 
		// wrong password OR not registered username
      return res.status(401).json({
        err: info
      });
    }
	
	// With no errors then logIn the user with the user information
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
// Read out the user object to the console.
console.log('user in users: ', user);
		
      // Give out the Token  
      var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
	  // Something happens here
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
	
	// This is where we should kill the token?
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;
