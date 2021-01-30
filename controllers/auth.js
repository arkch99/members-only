const passport = require("passport");
var User = require("../models/user");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
	new LocalStrategy({passReqToCallback:true},
		function(req, username, password, done) {
		User.findOne({ name: username }, function(err, user){
			if(err)
			{
				return done(err);
			}
			if(!user){
				return done(null, false, req.flash("msg","No user found with this name!"));
			}
			bcrypt.compare(password, user.pwd, function(err, succ)
			{
				if(succ)
				{
					return done(null, user);
				}
				else
				{
					return done(null, false, req.flash("msg", "Incorrect password!"));
				}
			});			
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
	failureRedirect: "/log-in",
	failureFlash: true
});