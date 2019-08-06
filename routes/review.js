//Application config
const expres = require("express");
const router = expres.Router({mergeParams: true});

//Mongoose models config
const Review = require("../models/Review");
const User = require("../models/User");

//Middleware config
const middleware = require("../middleware");

//NEW route
router.get("/new", middleware.isLoggedInAndIsNotThisUser, (req, res)=>{
    User.findById(req.params.id, (err, userAuthor)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/users/" + req.params.id);
        } else
            res.render("reviews/new", {userAuthor: userAuthor});
    });
});

//CREATE route
router.post("/", middleware.isLoggedInAndIsNotThisUser, (req, res)=>{
    User.findById(req.params.id, (err, userAuthor)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/users/" + req.params.id);
        } else{
            Review.create(req.body.review, (err, review)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/users/" + req.params.id);
                } else{
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
router.get("/:id_review/edit", middleware.isReviewAuthor, (req, res)=>{
    User.findById(req.params.id, (err, userAuthor)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/users/" + req.params.id);
        } else{
            Review.findById(req.params.id_review, (err, review)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/users/" + req.params.id);
                } else
                    res.render("reviews/edit", {userAuthor: userAuthor, review: review});
            });
        }
    });
});

//UPDATE route
router.put("/:id_review", middleware.isReviewAuthor, (req, res)=>{
    User.findById(req.params.id, (err)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/users/" + req.params.id);
        } else{
            Review.findByIdAndUpdate(req.params.id_review, req.body.review, (err, review)=>{
                review.timestamp = res.locals.timestamp;
                review.save();
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/users/" + req.params.id);
                } else{
                    req.flash("success", "Successfully edited review.");
                    return res.redirect("/real-estates/users/" + req.params.id);
                }
            });
        }
    });
});

//DESTROY route
router.delete("/:id_review", middleware.isReviewAuthor, (req, res)=>{
    User.findById(req.params.id, (err)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/users/" + req.params.id);
        } else{
            Review.findByIdAndDelete(req.params.id_review, (err)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/users/" + req.params.id);
                } else{
                    req.flash("success", "Successfully deleted review.");
                    return res.redirect("/real-estates/users/" + req.params.id);
                }
            });
        }
    })
});

//Router export config
module.exports = router;