//App config
const express = require("express");
const router = express.Router();

//Mongoose model config
const Property = require("../../models/Property");
const Comment = require("../../models/Comment");

//Middleware config
const middleware = require("../../middleware");

//INDEX route
router.get("/", function(req, res){
    Property.find({}, function(err, properties){
        if(err)
            console.log(err);
        else
            res.render("real_estates/rent/index", {properties: properties});
    });
});

//NEW route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("real_estates/rent/new");
});

//CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    Property.create(req.body.property, function(err, property){
        if(err)
            console.log(err);
        else{
            property.author.id = req.user.id; 
            property.author.username = req.user.username;
            property.save();
            res.redirect("/real-estates/rent");
        }
    });
});

//SHOW route
router.get("/:id", function(req, res){
    Property.findById(req.params.id).populate("comments").populate("author.id").exec(function(err, property){
        if(err)
            console.log(err);
        else
            res.render("real_estates/rent/show", {property: property});
    });
});

//EDIT route
router.get("/:id/edit", middleware.isPropertyAuthor, function(req, res){
    Property.findById(req.params.id, function(err, property){
        if(err)
            console.log(err);
        else
            res.render("real_estates/rent/edit", {property: property});
    });
});

//UPDATE route
router.put("/:id", middleware.isPropertyAuthor, function(req, res){
    Property.findByIdAndUpdate(req.params.id, req.body.property, function(err, property){
        if(err)
            console.log(err);
        else
            res.redirect("/real-estates/rent/" + req.params.id);
    });
});

//DELETE route
router.delete("/:id", middleware.isPropertyAuthor, function(req, res){
    Property.findByIdAndDelete(req.params.id, function(err, property){
        if(err)
            console.log(err);
        else{
            Comment.deleteMany({_id: {$in: property.comments}}, function(err){
                if(err)
                    console.log(err);
                else
                    res.redirect("/real-estates/rent");
            });
        }
    });
});

module.exports = router;