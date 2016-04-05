// Grab the things we need - dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// Set up the user Schema - What defines a user.
var User = new Schema({
    username: String,
    password: String,
    firstname: {
		type: String,
		default: ''
	},
    lastname: {
 		type: String,
 		default: ''
 	},
 	admin: {
 		type: Boolean,
 		default: false
    }
});

// Custom method to get the users name
User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

// Some kind of plugin needed to use the database to store user info.
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);