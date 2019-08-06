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
router.get("/", (req, res)=>{
    Property.find({}, (err, properties)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates");
        } else
            res.render("real_estates/buy/index", {properties: properties});
    });
});

//NEW route
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    res.render("real_estates/buy/new");
});

//CREATE route
router.post("/", middleware.isLoggedIn, (req, res)=>{
    Property.create(req.body.property, (err, property)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy");
        } else{
            User.findById(req.user._id, (err, user)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/buy");
                } else
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
router.get("/:id", (req, res)=>{
    Property.findById(req.params.id).populate("comments").populate("author.id").exec((err, property)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy");
        } else
            res.render("real_estates/buy/show", {property: property});
    });
});

//EDIT route
router.get("/:id/edit", middleware.isPropertyAuthor, (req, res)=>{
    Property.findById(req.params.id, (err, property)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy/" + req.params.id);
        } else
            res.render("real_estates/buy/edit", {property: property});
    });
});

//UPDATE route
router.put("/:id", middleware.isPropertyAuthor, (req, res)=>{
    Property.findByIdAndUpdate(req.params.id, req.body.property, (err, property)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy/" + req.params.id);
        } else{
            req.flash("success", "Successfully edited property.");
            return res.redirect("/real-estates/buy/" + req.params.id);
        }
    });
});

//DESTROY route
router.delete("/:id", middleware.isPropertyAuthor, (req, res)=>{
    Property.findByIdAndDelete(req.params.id, (err, property)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/real-estates/buy/" + req.params.id);
        } else{
            User.findById(req.user._id, (err, user)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/buy/" + req.params.id);
                } else
                    user.propertiesCount--;
                user.save();
            });
            Comment.deleteMany({_id: {$in: property.comments}}, (err)=>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/real-estates/buy");
                } else{
                    req.flash("success", "Successfully deleted property.");
                    return res.redirect("/real-estates/buy");
                }
            });
        }
    });
});

//Router export config
module.exports = router;