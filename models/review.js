//Mongoose set up
var mongoose = require("mongoose");

//Mongoose Schema
var reviewSchema = mongoose.Schema({
    user: String,
    image: String,
    comment: String,
    rating: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        username: String,
        avatar: String,
    },
    timestamp: {type: Date, default: Date.now},
})

//Mongoose Model Export
module.exports = mongoose.model("Review", reviewSchema);