const mongoose = require('mongoose');
const { DateTime } = require("luxon");

var MessageSchema = new mongoose.Schema({
	title: {type:String, required: true },
	timestamp: Object,
	user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	text: {type:String, required: true}
});

module.exports = mongoose.model('Message', MessageSchema);