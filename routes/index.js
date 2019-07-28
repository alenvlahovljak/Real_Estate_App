//Application config
const express = require("express");
const router = express.Router();

//Authentication config
const passport = require("passport");

//Mongoose model config
const User = require("../models/User");

//Root route
router.get("/", function(req, res){
    res.render("index");
});

//Real Estate route
router.get("/real-estates", function(req, res){
    res.render("landing");
});

//NEW Register route
router.get("/register", function(req, res){
    res.render("register");
});

//CREATE Register route
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        gender: req.body.gender,
        email: req.body.email,
        phoneNum: req.body.phoneNum,
        street: req.body.street,
        streetNum: req.body.streetNum,
        state: req.body.state,
        zipCode: req.body.zipCode,
        country: req.body.country,
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome for the first time " + req.user.username);
            res.redirect("/real-estates");
        }); 
    });
});

//NEW Login route
router.get("/login", function(req, res){
    res.render("login");
});

//CREATE Login route
router.post("/login", passport.authenticate("local", 
    {   
        successRedirect: "/real-estates",
        failureRedirect: "/login",
    }), function(req, res){
});

//Logout route
router.get("/logout", function(req, res){
    req.flash("success", "Goodbye " + req.user.username);
    req.logout();
    return res.redirect("/");
});

module.exports = router;