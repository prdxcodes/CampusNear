const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const cafeSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        default: "Cafe",
        enum: ["Cafe"]
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

    cuisine: {
        type: String,
        required: true
    },

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

cafeSchema.index({
    geocoding: "2dsphere"
});

cafeSchema.post("findOneAndDelete", async function (cafe) {
    if (cafe) {
        await Review.deleteMany({
            _id: { $in: cafe.reviews }
        });
    }
});

module.exports = mongoose.model("Cafe", cafeSchema);