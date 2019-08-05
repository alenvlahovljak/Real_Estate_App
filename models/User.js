const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

//Mongoose schema
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
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    propertiesCount: {type: Number, default: 0},
    lastActive: {type: Date, default: 0},
    impressions: {
        isPositive: [{type: String, default: undefined}],
        isNegative: [{type: String, default: undefined}]
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);