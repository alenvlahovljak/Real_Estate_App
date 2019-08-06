//Application config
const express = require("express");
const router = express.Router();

//Mongoose model config
const User = require("../models/User");

//Middleware config
const middleware = require("../middleware");

//SHOW route
router.get("/:id", (req, res)=>{
    User.findById(req.params.id).populate("reviews").exec((err, userAuthor)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/users/" + req.params.id);
        } else{
            if(req.user && req.user.username==userAuthor.username){
                userAuthor.lastActive = Date.now();
                userAuthor.save();
            }
            res.render("users/show", {userAuthor: userAuthor});
        }
    });
});

//CREATE route - positive impression
router.post("/:id/impressions/positive", middleware.isNotSameUserForPositiveImpression, (req, res)=>{
    User.findById(req.params.id, (err, user)=>{
        if(err){
            req.flash("error", err);
            return res.redirect("/real-estates/users/" + req.params.id);
        } else{
            user.impressions.isPositive.push(req.user._id);
            let newNeagitve =  user.impressions.isNegative.filter((negative)=>{
                return req.user._id == negative; 
            });
            if(newNeagitve){
                let newNegatives = user.impressions.isNegative.find((negative)=>{
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
router.post("/:id/impressions/negative", middleware.isNotSameUserForNegativeImpression, (req, res)=>{
    User.findById(req.params.id, (err, user)=>{
        if(err){
            req.flash("error", err);
            return res.redirect("/real-estates/users/" + req.params.id);
        } else{
            user.impressions.isNegative.push(req.user._id);
            let newPositive =  user.impressions.isPositive.filter((positive)=>{
                return req.user._id == positive; 
            });
            if(newPositive){
                let newPositives = user.impressions.isNegative.find((positive)=>{
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

//Router export config
module.exports = router;