const User = require("../models/user");
const Message = require("../models/message");
const { DateTime } = require("luxon");
const bcrypt = require("bcryptjs");
const user = require("../models/user");

exports.getUserMessages = function(req, res)
{	
	// if(!req.user || (req.user && req.user.privilege < 1)){
	// 	res.redirect("/");
	// }

	User.findById(req.params.user_id)
	.exec(function(err, user){
		if(err) res.send(err);

		Message.find({user:req.params.user_id})	
		.exec(function(err, messages){
			if(err) res.send(err);	
			console.log(user);
			res.render("user", {user, messages, DateTime, currentUser:req.user});
		});			
	});		
};

exports.checkPasscode = function(req, res){
	//conos
	if(req.body.passcode == process.env.MEM_PASS)
	{
		req.user.privilege = 1;
		req.user.save(function(err){
			if(err) res.send(err);
			res.redirect("/");
		});		
	}
	else if(req.body.passcode == process.env.ADMIN_PASS)
	{
		req.user.privilege = 2;
		req.user.save(function(err){
			if(err) res.send(err);
			res.redirect("/");
		});		
	}
	
}

exports.newUser = function(req, res) {
	if(req.body.confirmpassword !== req.body.password)
	{
		// console.log(req.body);
		// console.log(req.body.confirmpassword);
		// console.log(req.body.password);
		req.flash("msg", "Invalid username or password");
		//res.render("signup", {mismatch: true});
		res.redirect("/sign-up");
	}
	else{
		User.find({name:req.body.username}, function(err, user){
			console.log(user);
			if(err) res.send(err);
			if(user.length)
			{
				req.flash("msg", "Username taken!");
				res.redirect("/sign-up");
			}
			else{
				bcrypt.hash(req.body.password, 10, function(err, hashedPwd) {
					if(err) console.log("Password hashing failed!");
					var newUser = new User();
					newUser.name = req.body.username;
					newUser.pwd = hashedPwd;
					newUser.privilege = 0;
					newUser.save(function(err){
						if(err) res.send(err);
						res.redirect("/");
					});
				});
			}
		});		
	}	
};

exports.deleteUser = function(req, res) {
	Message.remove({ user: req.params.user_id }, function(err){
		if(err) res.send(err);
		User.findByIdAndRemove(req.params.user_id, function(err){
			if(err) res.send(err);
			console.log("User deletion successful");
			res.redirect("/");
		});				
	});
}