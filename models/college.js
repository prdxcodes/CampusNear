const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    shortName: {
        type: String,
        trim: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    state: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },

        coordinates: {
            type: [Number],
            required: true,

            validate: {
                validator: function (value) {
                    return value.length === 2;
                },
                message: "Coordinates must contain longitude and latitude."
            }
        }
    }
});

collegeSchema.index({
    location: "2dsphere"
});

module.exports = mongoose.model("College", collegeSchema);