var express=require("express");
var router = express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware = require("../middleware/index.js");


router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if (err) {
      console.log(err);
      redirect("/campgrounds");
    }else{
      res.render("comments/new",{campground:campground})
    }
  });
});
//comment create
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err)
    }else{
      Comment.create(req.body.comment,function(err,comment) {
        if(err){
          console.log(err)
        }else{
          //add username and id to comments then save comments
          comment.author.id =req.user._id;
          comment.author.username=req.user.username
          comment.save();
          
          campground.comments.push(comment);
          campground.save();
	  req.flash("success","Successfully added Comment");
          res.redirect("/campgrounds/"+campground._id);
        }

      });

      }

  });
});


//GET EDIT COMMENT===========
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnerShip,function(req,res){
	Campground.findById(req.params.id,function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("Error","Can find Campground");
			return res.redirect("back");
		}
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			console.log(foundComment);		
		res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});		
			}	
		})	
	})
})

//EDIT POST UPDATE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnerShip,function(req,res){
  
Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("/campgrounds");
        }else{
	    req.flash("success","Comment has been Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});
//DESTORY 
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnerShip,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
 		if(err){
			console.log(back);	
		}else{
			res.redirect("/campgrounds/"+req.params.id);	
		} 
  })
})




module.exports = router;
