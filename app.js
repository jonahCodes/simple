var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds"),
    Comment     =require("./models/comment"),
    passport    = require("passport"),
    LocalStrategy =require("passport-local"),
    User        = require("./models/user"),
    methodOverride=require("method-override"),
    flash        =require("connect-flash")

//requiring routes
var commentRoutes=require("./routes/comments"),
campgroundRoutes=require("./routes/campgrounds"),
indexRoutes = require("./routes/index")
 
app.use(flash());   
mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// seedDB();


//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret:"rusty",
  resave:false,
  saveUninitialized:false
}));
//=============================
//APP.USE \functionsas
//

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error=req.flash("Error");
  res.locals.success =req.flash("success");
  
	next();

});
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


//LISTEN++++++++++++++++++++++++
app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});
