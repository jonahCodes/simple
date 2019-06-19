var express=require("express");
var router = express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware = require("../middleware/index.js");


router.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res){
    
    // Get all campgrounds from DB

    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn,function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    var newCampground = {name: name, image: image, description: desc,author:author, price:price}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/campgrounds/new",middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs"); 
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id",function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("Error","campground not found");
		res.redirect("back");
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT =====CHECK OWENERSHIP=====
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnerShip,function(req,res){
//is user logged at all
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit.ejs",{campground:foundCampground});
	})
});

//UPDATEcampground route
router.put("/campgrounds/:id",middleware.checkCampgroundOwnerShip,function(req,res){
    //find and update the correct campgrounds
   
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err,updatedCampground){
        if(err){
	    req.flash("Error","Permission denied");
            res.redirect("/campgrounds");
        }else{
	    req.flash("success","your Campground has been updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })

});

///DESTROY CAMPGROUNDS 
router.delete("/campgrounds/:id",function(req,res){
        //destroy 
        Campground.findByIdAndRemove(req.params.id,function(err, deletePage){
            if(err){
                console.log(err);
                res.redirect("/campgrounds");
            }else{
		req.flash("success","Your campground has been Deleted");
                res.redirect("/campgrounds");
            }
        })
        //redirect somewhere

});




module.exports = router;
