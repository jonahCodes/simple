var mongoose = require("mongoose"),
	passport = require("passport"),
	passportLocalMongoose = require("passport-local-mongoose")



var UserSchema = new mongoose.Schema({
	username:String,
	password:String,
});


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);