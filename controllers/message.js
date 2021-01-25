const Message = require("../models/message");
const { DateTime } = require("luxon");

exports.getAllMessages = function(req, res) {	
	Message.find({})
	.populate("user")
	.exec(function(err, messageList){
		if(err) res.send(err);		
		console.log(messageList)
		res.render("index", {user:req.user, messageList: messageList, DateTime: DateTime});
	});
};

exports.newMessage = function(req, res) {
	console.log(req.user);
	var message = new Message({
		title: req.body.title,
		timestamp: DateTime.local(),
		user: req.user._id,
		text: req.body.text
	}
	);
	message.save(function(err){
		if(err) res.send(err);
		res.redirect("/");
	});
}

exports.deleteMessage = function(req, res) {
	if(!req.user || (req.user && req.user.privilege != 2))
	{
		res.redirect("/"); //TODO: Make this go somewhere actually useful
	}
	else{
		Message.deleteOne({_id:req.params.message_id}, function(err){
			if(err) res.send(err);
			res.redirect("/");
		});
	}
}
