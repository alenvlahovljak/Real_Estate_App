const monogoose = require("mongoose");

const commentSchema = new monogoose.Schema({
    author: {
        id:{
            type: monogoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        avatar: String,
    },
    rating: Number,
    text: String,
    timestamp: {type: Date, default: Date.now},
});

module.exports = monogoose.model("Comment", commentSchema);