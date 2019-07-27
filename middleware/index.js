const Property = require("../models/Property");
const Comment = require("../models/Comment");

//MIDDLEWARES
var middlewareObj = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated())
            next();
        else
            res.redirect("/login");
    },
    isPropertyAuthor: function(req, res, next){
        if(req.isAuthenticated()){
            Property.findById(req.params.id, function(err, property){
                if(err)
                    console.log(err);
                else{
                    if(property.author.id.equals(req.user._id))
                        next();
                    else
                        res.redirect("back");
                }
            });
        } else
            res.redirect("/login");
    },
    isCommentAuthor: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.id_comment, function(err, comment){
                if(err)
                    console.log(err);
                else{
                    if(comment.author.id.equals(req.user._id))
                        next();
                    else
                        res.redirect("back");
                }
            });
        } else
            res.redirect("/login");
    }
}

module.exports = middlewareObj;

/*
function isLoggedIn(req, res, next){
    
}

function isPropertyAuthor(req, res, next){
    
}

function isCommentAuthor(req, res, next){
    
}

*/
