const User = require("../models/user");

exports.getUserMessages = function(req, res, next)
{
	User.findById(req.user_id)
	.populate("msgs")
	.exec(function(err, user){
		if(err) res.send(err);
		console.log(user);
		res.render("user", user)
	});
};