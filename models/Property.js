const mongoose = require("mongoose");

propertySchema = new mongoose.Schema({
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    status: String,
    name: String,
    price: Number,
    image: String,
    description: String,
    sqft: Number,
    bedrooms: Number,
    bathrooms: Number,
    parkingSpots: Number,
    street: String,
    streetNum: Number,
    state: String,
    zipCode: Number,
    country: String,
    timestamp: {type: Date, default: Date.now},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Property", propertySchema);

