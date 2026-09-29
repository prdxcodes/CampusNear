const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;