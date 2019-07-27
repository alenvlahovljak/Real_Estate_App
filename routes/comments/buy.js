//App config
const express = require("express");
const router = express.Router({mergeParams: true});

//Mongoose models config
const Property = require("../../models/Property");
const Comment = require("../../models/Comment");

//Middleware config
const middleware = require("../../middleware");

//NEW route
router.get("/new", middleware.isLoggedIn, function(req, res){
    Property.findById(req.params.id, function(err, property){
        if(err)
            req.flash("error", err.message);
        else
            res.render("comments/buy/new", {property: property});
    });
});

//CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    Property.findById(req.params.id, function(err, property){
        if(err)
            req.flash("error", err.message);
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err)
                    req.flash("error", err.message);
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.avatar = req.user.avatar;
                    comment.save();
                    property.comments.push(comment);
                    property.save();
                    req.flash("success", "Successfully created comment."); 
                    return res.redirect("/real-estates/buy/" + property._id);
                }
            });
        }
    });
});

//EDIT route
router.get("/:id_comment/edit", middleware.isCommentAuthor, function(req, res){
    Property.findById(req.params.id, function(err, property){
        if(err)
            req.flash("error", err.message);
        else{
            Comment.findById(req.params.id_comment, function(err, comment){
                if(err)
                    req.flash("error", err.message);
                else
                    res.render("comments/buy/edit", {property: property, comment: comment});
            });
        }
    });
});

//UPDATE route
router.put("/:id_comment", middleware.isCommentAuthor, function(req, res){
    Property.findById(req.params.id, function(err, property){
        if(err)
            req.flash("error", err.message);
        else{
            Comment.findByIdAndUpdate(req.params.id_comment, req.body.comment, function(err, comment){
                comment.timestamp = setCommentTimestamp(comment.timestamp);
                comment.save();
                if(err)
                    req.flash("error", err.message);
                else{
                    req.flash("success", "Successfully edited comment."); 
                    return res.redirect("/real-estates/buy/" + req.params.id);
                }
            });
        }
    });
});

//DESTROY route
router.delete("/:id_comment", middleware.isCommentAuthor, function(req, res){
    Property.findById(req.params.id, function(err){
        if(err)
            req.flash("error", err.message);
        else{
            Comment.findByIdAndDelete(req.params.id_comment, function(err){
                if(err)
                    req.flash("error", err.message);
                else{
                    req.flash("success", "Successfully deleted comment."); 
                    return res.redirect("/real-estates/buy/" + req.params.id);
                }
            }); 
        }
    });
});

function setCommentTimestamp(timestamp){
    return timestamp = Date.now();
}

module.exports = router;

