const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const messSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        default: "Mess",
        enum: ["Mess"]
    },

    description: {
        type: String,
        required: true
    },

    image: {
        url: String,
        filename: String
    },

    price: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    country: {
        type: String,
        default: "India",
        required: true
    },

    ownerContact: {
        type: String,
        required: true
    },

    mealType: {
        type: String,
        enum: ["Veg", "Non-Veg", "Both"],
        required: true
    },

    meals: [{
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner"]
    }],

    openingTime: {
        type: String,
        required: true
    },

    closingTime: {
        type: String,
        required: true
    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    college: {
        type: Schema.Types.ObjectId,
        ref: "College",
        required: true
    },

    geocoding: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },

        coordinates: {
            type: [Number],
            required: true
        }
    }

});

messSchema.index({
    geocoding: "2dsphere"
});

messSchema.post("findOneAndDelete", async function (mess) {
    if (mess) {
        await Review.deleteMany({
            _id: { $in: mess.reviews }
        });
    }
});

module.exports = mongoose.model("Mess", messSchema);