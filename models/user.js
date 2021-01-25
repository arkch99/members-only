const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	name: String,
	pwd: String,
	privilege: Number, // 0 = registered, 1 = member, 2 = admin
	//msgs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }]
});

UserSchema.virtual('url').get(function(){
	return "/users/" + this._id;
});

module.exports = mongoose.model('User', UserSchema);