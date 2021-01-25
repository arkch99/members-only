const User = require("../models/user");
const Message = require("../models/message");
const { DateTime } = require("luxon");

exports.getUserMessages = function(req, res)
{	
	if(!req.user || (req.user && req.user.privilege < 1)){
		res.redirect("/");
	}

	User.findById(req.params.user_id)
	.exec(function(err, user){
		if(err) res.send(err);

		Message.find({user:req.params.user_id})	
		.exec(function(err, messages){
			if(err) res.send(err);	
			console.log(user);
			res.render("user", {user, messages, DateTime});
		});			
	});		
};

exports.checkPasscode = function(req, res){
	if(req.passcode == process.env.MEM_PASS)
	{
		req.user.privilege = 1;
		req.user.save(function(err){
			if(err) res.send(err);
		});
	}
	else if(req.passcode == process.env.ADMIN_PASS)
	{
		req.user.privilege = 2;
		req.user.save(function(err){
			if(err) res.send(err);
		});
	}
	res.redirect("/");
}