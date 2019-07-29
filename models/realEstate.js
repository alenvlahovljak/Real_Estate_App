//Mongoose set up
var mongoose = require("mongoose");

//Mongoose Schema
var realEstateSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    availability: Date,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
});

//Mongoose Model Export
module.exports = mongoose.model("Real_Estates", realEstateSchema);

