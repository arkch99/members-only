const Message = require("../models/message");

exports.getAllMessages = function(req, res) {	
	Message.find({})
	.populate("user")
	.exec(function(err, messageList){
		if(err) res.send(err);		
		console.log(messageList)
		res.render("index", {user:req.user, messageList: messageList});
	});
};

