//Application config
const expres = require("express");
const router = expres.Router({mergeParams: true});

//Mongoose models config
const Review = require("../models/Review");
const User = require("../models/User");

//Middleware config
const middleware = require("../middleware");

//NEW route
router.get("/new", middleware.isLoggedInAndIsNotThisUser, function(req, res){
    User.findById(req.params.id, function(err, userAuthor){
        if(err)
            req.flash("error", err.message);
        else
            res.render("reviews/new", {userAuthor: userAuthor});
    });
});

//CREATE route
router.post("/", middleware.isLoggedInAndIsNotThisUser, function(req, res){
    User.findById(req.params.id, function(err, userAuthor){
        if(err)
            req.flash("error", err.message);
        else{
            Review.create(req.body.review, function(err, review){
                if(err)
                    req.flash("error", err.message);
                else{
                    review.author.id = req.user._id;
                    review.author.username = req.user.username;
                    review.author.avatar = req.user.avatar;
                    review.save();
                    userAuthor.reviews.push(review);
                    userAuthor.save();
                    req.flash("success", "Successfully created review.");
                    return res.redirect("/real-estates/users/" + req.params.id);
                }
            });
        }
    });
});

//EDIT route
router.get("/:id_review/edit", middleware.isReviewAuthor, function(req, res){
    User.findById(req.params.id, function(err, userAuthor){
        if(err)
            req.flash("error", err.message);
        else{
            Review.findById(req.params.id_review, function(err, review){
                if(err)
                    req.flash("error", err.message);
                else
                    res.render("reviews/edit", {userAuthor: userAuthor, review: review});
            });
        }
    });
});

//UPDATE route
router.put("/:id_review", middleware.isReviewAuthor, function(req, res){
    User.findById(req.params.id, function(err){
        if(err)
            req.flash("error", err.message);
        else{
            Review.findByIdAndUpdate(req.params.id_review, req.body.review, function(err, review){
                review.timestamp = setCommentTimestamp(review.timestamp);
                review.save();
                if(err)
                    req.flash("error", err.message);
                else{
                    req.flash("success", "Successfully edited review.");
                    return res.redirect("/real-estates/users/" + req.params.id);
                }
            });
        }
    });
});

//DESTROY route
router.delete("/:id_review", middleware.isReviewAuthor, function(req, res){
    User.findById(req.params.id, function(err){
        if(err)
            req.flash("error", err.message);
        else{
            Review.findByIdAndDelete(req.params.id_review, function(err){
                if(err)
                    req.flash("error", err.message);
                else{
                    req.flash("success", "Successfully deleted review.");
                    return res.redirect("/real-estates/users/" + req.params.id);
                }
            });
        }
    })
});

function setCommentTimestamp(timestamp){
    return timestamp = Date.now();
}

module.exports = router;