//Application config
const express = require("express");
const router = express.Router();

//Mongoose model config
const User = require("../models/User");

//SHOW route
router.get("/:id", function(req, res){
    User.findById(req.params.id).populate("reviews").exec(function(err, userAuthor){
        if(err)
            req.flash("error", err.message);
        else
            res.render("users/show", {userAuthor: userAuthor});
    });
});

module.exports = router;