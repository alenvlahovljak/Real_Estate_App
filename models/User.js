const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    avatar: {type: String, default:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    gender: String,
    email: String,
    phoneNum: {type: String, default: "User dind't share phone number."},
    street: String,
    streetNum: String,
    state: String,
    zipCode: String,
    country: String,
    timestamp: {type: Date, default: Date.now},
    propertiesCount: {type: Number, default: 0}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);