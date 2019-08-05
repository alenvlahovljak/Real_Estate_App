//Application config
const express = require("express");
const router = express.Router();

//Mongoose model config
const User = require("../models/User");

//Middleware config
const middleware = require("../middleware");

//SHOW route
router.get("/:id", function(req, res){
    User.findById(req.params.id).populate("reviews").exec(function(err, userAuthor){
        if(err)
            req.flash("error", err.message);
        else{
            if(req.user && req.user.username==userAuthor.username){
                userAuthor.lastActive = Date.now();
                userAuthor.save();
            }
            res.render("users/show", {userAuthor: userAuthor});
        }
    });
});

//CREATE route - positive impression
router.post("/:id/impressions/positive", middleware.isNotSameUserForPositiveImpression, function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err)
            req.flash("error", err);
        else{
            user.impressions.isPositive.push(req.user._id);
            let newNeagitve =  user.impressions.isNegative.filter(function(negative){
                return req.user._id == negative; 
            });
            if(newNeagitve){
                let newNegatives = user.impressions.isNegative.find(function(negative){
                    return req.user._id != negative;
                });
                user.impressions.isNegative = newNegatives;
            }
            user.save();
            req.flash("success", "Successfully added positive impression.");
            return res.redirect("back");
        }
    });
});

//CREATE route - negative impression
router.post("/:id/impressions/negative", middleware.isNotSameUserForNegativeImpression, function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err)
            req.flash("error", err);
        else{
            user.impressions.isNegative.push(req.user._id);
            let newPositive =  user.impressions.isPositive.filter(function(positive){
                return req.user._id == positive; 
            });
            if(newPositive){
                let newPositives = user.impressions.isNegative.find(function(positive){
                    return req.user._id != positive;
                });
                user.impressions.isPositive = newPositives;
            }
            user.save();
            req.flash("success", "Successfully added negative impression.");
            return res.redirect("back");
        }
    });
});

module.exports = router;