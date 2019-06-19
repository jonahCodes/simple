// ALL THE MIDDLE WARE
var middlewareObj={};
var Campground = require("../models/campground.js");
var Comment= require("../models/comment.js");

//CAMPGROUND OWNERSHIP 
middlewareObj.checkCampgroundOwnerShip = function checkCampgroundOwnerShip(req,res,next){
		if(req.isAuthenticated()){
	Campground.findById(req.params.id,function(err, foundCampground){
    		if(err || !foundCampground){
			req.flash("Error","can not find Campground");
        		res.redirect("back");
    		}else{
    //does the user own the campgrounds
        	if(foundCampground.author.id.equals(req.user._id)){
        		next();
    		}else{
			req.flash("error","You don't have Permission");
            		res.redirect("back");
        	}
    	}

	});
		}else{
			res.redirect("back");
}
}
//COMMENT OWNERSHIP
middlewareObj.checkCommentOwnerShip = function(req,res,next){
if(req.isAuthenticated()){

    Comment.findById(req.params.comment_id,function(err, foundComment){
    	if(err || !foundComment){
		req.flash("Error","Comment not found");
        	res.redirect("back");
    	}else{
    //does the user own the campgrounds
        	if(foundComment.author.id.equals(req.user._id)){
        		next();
    	}else{	req.flash("Error","Loggin first");
            	res.redirect("back");
        	}
    	}

});
}else{
	res.redirect("back");
}
}

//ISLOGGEDIN AUTH
middlewareObj.isLoggedIn = function(req,res,next){
	
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("Error","Login First!");	
  res.redirect("/login");
}






module.exports = middlewareObj
