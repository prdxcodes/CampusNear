const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const pgSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        default: "PG",
        enum: ["PG"]
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

    gender: {
        type: String,
        enum: ["Male", "Female", "Unisex"],
        required: true
    },

    sharingType: {
        type: String,
        enum: ["Single", "Double", "Triple", "4 Sharing", "Other"],
        required: true
    },

    foodIncluded: {
        type: Boolean,
        default: false
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

pgSchema.index({
    geocoding: "2dsphere"
});

pgSchema.post("findOneAndDelete", async function (pg) {
    if (pg) {
        await Review.deleteMany({
            _id: { $in: pg.reviews }
        });
    }
});

module.exports = mongoose.model("Pg", pgSchema);