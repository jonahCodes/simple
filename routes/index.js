//LOGIN AUTHLOGOUT REGISTER

var express=require("express");
var router = express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var passport=require("passport");
var User=require("../models/user");

//show the regiter form 
router.get("/register",function(req,res){
  res.render("register");

});
router.post("/register",function(req,res){
  var newUser = new User({username:req.body.username});
//make sure error for a username already made.
User.register(newUser, req.body.password,function(err,user){
  if(err){
    
	req.flash("Error",err.message);
     return res.render("register");
  }else{
    passport.authenticate("local")(req,res,function(){
      req.flash("success","Welcome to Yelpcamp "+user.username);		
      res.redirect("/campgrounds");
    })
  }
});

});
//================================
//LOGIN ROUTE
//show login form
router.get("/login",function(req,res){
  res.render("login");
});
//app.post("/login",middleware,callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
	   
});

  

//=====================
//LOGOUT/////////////
router.get("/logout",function(req,res){
  req.logout();
  req.flash("success","You have logged Out!");
  res.redirect("/campgrounds");
});



/////==================
/////MIDDLE WARE
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
