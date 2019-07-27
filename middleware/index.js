const Property = require("../models/Property");
const Comment = require("../models/Comment");

//MIDDLEWARES
var middlewareObj = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated())
            next();
        else{
            req.flash("error", "You need to be login to do that!");
            return res.redirect("/login");
        }
    },
    isPropertyAuthor: function(req, res, next){
        if(req.isAuthenticated()){
            Property.findById(req.params.id, function(err, property){
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
    isCommentAuthor: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.id_comment, function(err, comment){
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
    }
}

module.exports = middlewareObj;