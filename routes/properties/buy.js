//App config
const express = require("express");
const router = express.Router();

//Mongoose model config
const Property = require("../../models/Property");
const Comment = require("../../models/Comment");
const User = require("../../models/User");

//Middleware config
const middleware = require("../../middleware");

//INDEX route
router.get("/", function(req, res){
    Property.find({}, function(err, properties){
        if(err)
            req.flash("error", err.message);
        else
            res.render("real_estates/buy/index", {properties: properties});
    });
});

//EDIT route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("real_estates/buy/new");
});

//CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    Property.create(req.body.property, function(err, property){
        if(err)
            req.flash("error", err.message);
        else{
            User.findById(req.user._id, function(err, user){
                if(err)
                    req.flash("error", err.message);
                else
                    user.propertiesCount++;
                user.save();
            });
            property.author.id = req.user._id;
            property.author.username = req.user.username;
            property.save();
            req.flash("success", "Successfully created property.");
            return res.redirect("/real-estates/buy");
        }
    });
});

//SHOW route
router.get("/:id", function(req, res){
    Property.findById(req.params.id).populate("comments").populate("author.id").exec(function(err, property){
        if(err)
            req.flash("error", err.message);
        else
            res.render("real_estates/buy/show", {property: property});
    });
});

//EDIT route
router.get("/:id/edit", middleware.isPropertyAuthor, function(req, res){
    Property.findById(req.params.id, function(err, property){
        if(err)
            req.flash("error", err.message);
        else
            res.render("real_estates/buy/edit", {property: property});
    });
});

//UPDATE route
router.put("/:id", middleware.isPropertyAuthor, function(req, res){
    Property.findByIdAndUpdate(req.params.id, req.body.property, function(err, property){
        if(err)
            req.flash("error", err.message);
        else{
            req.flash("success", "Successfully edited property.");
            return res.redirect("/real-estates/buy/" + req.params.id);
        }
    });
});

//DESTROY route
router.delete("/:id", middleware.isPropertyAuthor, function(req, res){
    Property.findByIdAndDelete(req.params.id, function(err, property){
        console.log(property)
        if(err)
            req.flash("error", err.message);
        else{
            User.findById(req.user._id, function(err, user){
                if(err)
                    req.flash("error", err.message);
                else
                    user.propertiesCount--;
                user.save();
            });
            Comment.deleteMany({_id: {$in: property.comments}}, function(err){
                if(err)
                    req.flash("error", err.message);
                else{
                    req.flash("success", "Successfully deleted property.");
                    return res.redirect("/real-estates/buy");
                }
            });
        }
    });
});

module.exports = router;