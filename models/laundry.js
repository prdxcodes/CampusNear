const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const laundrySchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        default: "Laundry",
        enum: ["Laundry"]
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

    serviceType: [{
        type: String,
        enum: [
            "Washing",
            "Dry Cleaning",
            "Ironing",
            "Washing & Ironing",
            "All Services"
        ]
    }],

    pickupDelivery: {
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

laundrySchema.index({
    geocoding: "2dsphere"
});

laundrySchema.post("findOneAndDelete", async function (laundry) {
    if (laundry) {
        await Review.deleteMany({
            _id: { $in: laundry.reviews }
        });
    }
});

module.exports = mongoose.model("Laundry", laundrySchema);