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
        else{
            req.flash("success", "Successfully created " + property.name);
            return res.render("comments/rent/new", {property: property});
        }
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
                    console.log(err);
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.avatar = req.user.avatar;
                    comment.save();
                    property.comments.push(comment);
                    property.save();
                    res.redirect("/real-estates/rent/" + req.params.id);
                }
            });
        }
    });
});

//EDIT route
router.get("/:id_comment/edit", middleware.isCommentAuthor, function(req, res){
    Property.findById(req.params.id, function(err, property){
        if(err)
            req.flash("success", "Successfully created " + property.name);
        else{
            Comment.findById(req.params.id_comment, function(err, comment){
                if(err)
                    req.flash("success", "Successfully created " + property.name);
                else{
                    req.flash("success", "Successfully created " + property.name);
                    return res.render("comments/rent/edit", {property: property, comment: comment});
                }
            });
        }
    });
});

//UPDATE route
router.put("/:id_comment", middleware.isCommentAuthor, function(req, res){
    Property.findById(req.params.id, function(err, property){
        if(err)
            console.log(err);
        else{
            Comment.findByIdAndUpdate(req.params.id_comment, req.body.comment, function(err, comment){
                comment.timestamp = setCommentTimestamp(comment.timestamp);
                comment.save();
                if(err)
                    console.log(err);
                else
                    res.redirect("/real-estates/rent/" + req.params.id);
            });
        }
    });
});

//DESTROY route
router.delete("/:id_comment", middleware.isCommentAuthor, function(req, res){
    Property.findById(req.params.id, function(err){
        if(err)
            console.log(err);
        else{
            Comment.findByIdAndDelete(req.params.id_comment, function(err){
                if(err)
                    console.log(err);
                else
                    res.redirect("/real-estates/rent/" + req.params.id);
            }); 
        }
    });
});





function setCommentTimestamp(timestamp){
    return timestamp = Date.now();
}

module.exports = router;