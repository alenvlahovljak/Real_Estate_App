const mongoose = require("mongoose");

//Mongoose schema
const reviewSchema = new mongoose.Schema({
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String,
        avatar: String,
    },
    rating: Number,
    text: String,
    timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Review", reviewSchema);