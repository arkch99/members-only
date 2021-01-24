const passport = require("passport");
var User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ name: username }, function(err, user){
			if(err)
			{
				return done(err);
			}
			if(!user){
				return done(null, false, { msg: "No user found with this name!"});
			}
			if(user.pwd !== password){
				return done(null, false, {msg: "Incorrect password!"});
				
			}
			return done(null, user);
		});
	})
);

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	})
})

exports.isAuthenticated = passport.authenticate('local', {
	successRedirect: "/",
	failureRedirect: "/"
});