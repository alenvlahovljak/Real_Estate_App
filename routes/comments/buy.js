//App config
const express = require("express");
const router = express.Router({mergeParams: true});

//Mongoose models config
const Property = require("../../models/Property");
const Comment = require("../../models/Comment");
const User = require("../../models/User");

//Middleware config
const middleware = require("../../middleware");

//NEW route
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Property.findById(req.params.id, (err, property)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy/" + req.params.id);
        } else
            res.render("comments/buy/new", {property: property});
    });
});

//CREATE route
router.post("/", middleware.isLoggedIn, (req, res)=>{
    Property.findById(req.params.id, (err, property)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy/" + req.params.id);
        } else{
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/buy/" + req.params.id);
                } else{
                    User.findById(req.user._id, (err, user)=>{
                        if(err){
                            req.flash("error", err.message);
                            return res.redirect("/real-estates/buy/" + req.params.id);
                        } else
                            user.commentsCount++;
                        user.save();
                    });
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
router.get("/:id_comment/edit", middleware.isCommentAuthor, (req, res)=>{
    Property.findById(req.params.id, (err, property)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy/" + req.params.id);
        } else{
            Comment.findById(req.params.id_comment, (err, comment)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/buy/" + req.params.id);
                } else
                    res.render("comments/buy/edit", {property: property, comment: comment});
            });
        }
    });
});

//UPDATE route
router.put("/:id_comment", middleware.isCommentAuthor, (req, res)=>{
    Property.findById(req.params.id, (err, property)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy/" + req.params.id);
        } else{
            Comment.findByIdAndUpdate(req.params.id_comment, req.body.comment, (err, comment)=>{
                comment.timestamp = res.locals.timestamp;
                comment.save();
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/buy/" + req.params.id);
                } else{
                    req.flash("success", "Successfully edited comment."); 
                    return res.redirect("/real-estates/buy/" + req.params.id);
                }
            });
        }
    });
});

//DESTROY route
router.delete("/:id_comment", middleware.isCommentAuthor, (req, res)=>{
    Property.findById(req.params.id, (err)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy/" + req.params.id);
        } else{
            Comment.findByIdAndDelete(req.params.id_comment, (err)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/buy/" + req.params.id);
                } else{
                    User.findById(req.user._id, (err, user)=>{
                        if(err){
                            req.flash("error", err.message);
                            return res.redirect("/real-estates/buy/" + req.params.id);
                        } else
                            user.commentsCount--;
                        user.save();
                    });
                    req.flash("success", "Successfully deleted comment."); 
                    return res.redirect("/real-estates/buy/" + req.params.id);
                }
            }); 
        }
    });
});

//Router export config
module.exports = router;

