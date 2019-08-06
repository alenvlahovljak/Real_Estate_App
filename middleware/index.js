const Property = require("../models/Property");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Review = require("../models/Review");

//MIDDLEWARES
var middlewareObj = {
    isLoggedIn(req, res, next){
        if(req.isAuthenticated())
            return next();
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You need to be login to do that!");
        return res.redirect("/login");
    },
    isPropertyAuthor(req, res, next){
        if(req.isAuthenticated()){
            Property.findById(req.params.id, (err, property)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("back");
                } else{
                    if(property.author.id.equals(req.user._id))
                        next();
                    else{
                        req.flash("error", "You don't have permisson to do that!");
                        return res.redirect("back");
                    }
                }
            });
        } else{
            req.flash("error", "You need to be login to do that!");
            return res.redirect("/login");
        }
    },
    isCommentAuthor(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.id_comment, (err, comment)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("back");
                } else{
                    if(comment.author.id.equals(req.user._id))
                        next();
                    else{
                        req.flash("error", "You don't have permisson to do that!");
                        return res.redirect("back");
                    }
                }
            });
        } else{
            req.flash("error", "You need to be login to do that!");
            return res.redirect("/login");
        }
    },
    isLoggedInAndIsNotThisUser(req, res, next){
        if(req.isAuthenticated()){
            if(req.params.id==req.user._id){
                req.flash("error", "You can't give yourself a review.");
                return res.redirect("/real-estates/users/" + req.params.id);
            } else
                next();
        }else{
            req.session.returnTo = req.originalUrl;
            req.flash("error", "You need to be login to do that!");
            return res.redirect("/login");
        }
    },
    isReviewAuthor(req, res, next){
        if(req.isAuthenticated()){
            Review.findById(req.params.id_review, (err, review)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/users/" + req.params.id);
                } else{
                    if(review.author.id.equals(req.user._id))
                        next();
                    else{
                        req.flash("error", "You don't have permisson to do that!");
                        return res.redirect("/real-estates/users/" + req.params.id);
                    }
                }
            });          
        } else{
            req.session.returnTo = req.originalUrl;
            req.flash("error", "You need to be login to do that!");
            return res.redirect("/login");
        }
    },
    isNotSameUserForPositiveImpression(req, res, next){
        if(req.isAuthenticated()){
            if(req.params.id==req.user._id){
                req.flash("error", "You can't give yourself an impression.");
                return res.redirect("back");
            } else{
                User.findById(req.params.id, (err, user)=>{
                    if(err)
                        req.flash("error", err);
                    else{
                        let positiveImpression = user.impressions.isPositive.find((positive)=> req.user._id == positive);
                        if(positiveImpression){
                            req.flash("error", "You already gave a positive impression!");
                            return res.redirect("back");
                        } else
                            next();
                    }
                });
            }
        } else{
            req.flash("error", "You need to be login to do that!");
            return res.redirect("/login");
        }
    },
    isNotSameUserForNegativeImpression(req, res, next){
        if(req.isAuthenticated()){
            if(req.params.id==req.user._id){
                req.flash("error", "You can't give yourself an impression.");
                return res.redirect("back");
            } else{
                User.findById(req.params.id, (err, user)=>{
                    if(err)
                        req.flash("error", err);
                    else{
                        let negativeImpression = user.impressions.isNegative.find((negative)=> req.user._id == negative);
                        if(negativeImpression){
                            req.flash("error", "You already gave a negative impression");
                            return res.redirect("back");
                        } else
                            next();
                    }
                });
            }
        } else{
            req.flash("error", "You need to be login to do that!");
            return res.redirect("/login");
        }
    }
}

module.exports = middlewareObj;