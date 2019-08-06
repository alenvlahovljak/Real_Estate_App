//Application config
const express = require("express");
const router = express.Router();

//Authentication config
const passport = require("passport");

//Mongoose model config
const User = require("../models/User");

//Root route
router.get("/", (req, res)=> res.render("index"));

//Real Estate route
router.get("/real-estates", (req, res)=> res.render("landing"));

//NEW Register route
router.get("/register", (req, res)=> res.render("register"));

//CREATE Register route
router.post("/register", (req, res)=>{
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
        lastActive: Date.now()
    });
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome for the first time " + user.username);
            res.redirect("/real-estates");
        }); 
    });
});

//NEW Login route
router.get("/login", (req, res)=> res.render("login"));

//CREATE Login route
router.post("/login", passport.authenticate("local", 
    {   
        successReturnToOrRedirect: "/real-estates",
        failureRedirect: "/login",
        successFlash: "Welcome back!",
        failureFlash: true,
    }), (req, res)=>{       
});

//Logout route
router.get("/logout", (req, res)=>{
    User.findById(req.user._id, (err, user)=>{
        if(err)
            req.flash("error", err.message);
        else{
            user.lastActive = Date.now();
            user.save();
        }
    });
    req.flash("success", "Goodbye " + req.user.username);
    req.logout();
    return res.redirect("/");
});

module.exports = router;