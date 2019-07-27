//Modules config
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

//Mongoose models config
const User = require("./models/User");
const Property = require("./models/Property");
const Comment = require("./models/Comment");

//Routes config
const indexAuthRoute = require("./routes/index");
const propertiesBuyRoutes = require("./routes/properties/buy");
const propertiesRentRoutes = require("./routes/properties/rent");
const commentsBuyRoutes = require("./routes/comments/buy");
const commentsRentRoutes = require("./routes/comments/rent");

//Application config
mongoose.connect("mongodb://localhost:27017/Real_Estate_Application", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//Authentication config
app.use(require("express-session")({
    secret: "So many books, so little time",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Local Midleware config
app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.moment = moment;
    next();
});

//Serving usage configuration
app.use("/", indexAuthRoute);
app.use("/real-estates/buy" ,propertiesBuyRoutes);
app.use("/real-estates/rent", propertiesRentRoutes);
app.use("/real-estates/buy/:id/comments", commentsBuyRoutes);
app.use("/real-estates/rent/:id/comments", commentsRentRoutes);

//Error 404 route
app.get("*", function(req, res){
    res.send(404);
});

//Express listening route
app.listen(3000, function(){
    console.log("Application has started!");
});
