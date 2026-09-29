const Joi = require("joi");


// =====================================================
// PG SCHEMA
// =====================================================

module.exports.pgSchema = Joi.object({

    pg: Joi.object({

        title: Joi.string().required(),

        description: Joi.string().required(),

        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null)
        }),

        price: Joi.number()
            .required()
            .min(0),

        country: Joi.string()
            .required(),

        location: Joi.string()
            .required(),

        ownerContact: Joi.string()
            .required(),

        gender: Joi.string()
            .valid("Male", "Female", "Unisex")
            .required(),

        sharingType: Joi.string()
            .valid(
                "Single",
                "Double",
                "Triple",
                "4 Sharing",
                "Other"
            )
            .required(),

        foodIncluded: Joi.boolean()
            .required(),

        college: Joi.string()
            .required(),

        // Map coordinates
        latitude: Joi.number()
            .min(-90)
            .max(90)
            .allow("", null),

        longitude: Joi.number()
            .min(-180)
            .max(180)
            .allow("", null)

    }).required()

});


// =====================================================
// CAFE SCHEMA
// =====================================================

module.exports.cafeSchema = Joi.object({

    cafe: Joi.object({

        title: Joi.string()
            .required(),

        description: Joi.string()
            .required(),

        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null)
        }),

        price: Joi.number()
            .required()
            .min(0),

        location: Joi.string()
            .required(),

        country: Joi.string()
            .required(),

        ownerContact: Joi.string()
            .required(),

        cuisine: Joi.string()
            .required(),

        openingTime: Joi.string()
            .required(),

        closingTime: Joi.string()
            .required(),

        college: Joi.string()
            .required(),

        // Map coordinates
        latitude: Joi.number()
            .min(-90)
            .max(90)
            .allow("", null),

        longitude: Joi.number()
            .min(-180)
            .max(180)
            .allow("", null)

    }).required()

});


// =====================================================
// MESS SCHEMA
// =====================================================

module.exports.messSchema = Joi.object({

    mess: Joi.object({

        title: Joi.string().required(),

        description: Joi.string().required(),

        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null)
        }),

        price: Joi.number()
            .required()
            .min(0),

        country: Joi.string()
            .required(),

        location: Joi.string()
            .required(),

        ownerContact: Joi.string()
            .required(),

        mealType: Joi.string()
            .valid("Veg", "Non-Veg", "Both")
            .required(),

        meals: Joi.array()
            .items(
                Joi.string().valid(
                    "Breakfast",
                    "Lunch",
                    "Dinner"
                )
            )
            .min(1)
            .required(),
            
        openingTime: Joi.string()
            .required(),

        closingTime: Joi.string()
            .required(),

        college: Joi.string()
            .required(),

        latitude: Joi.number()
            .min(-90)
            .max(90)
            .allow("", null),

        longitude: Joi.number()
            .min(-180)
            .max(180)
            .allow("", null)

    }).required()

});

// =====================================================
// LAUNDRY SCHEMA
// =====================================================

module.exports.laundrySchema = Joi.object({

    laundry: Joi.object({

        title: Joi.string()
            .required(),

        description: Joi.string()
            .required(),

        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null)
        }),

        price: Joi.number()
            .required()
            .min(0),

        location: Joi.string()
            .required(),

        country: Joi.string()
            .required(),

        ownerContact: Joi.string()
            .required(),

        serviceType: Joi.array()
            .items(
                Joi.string().valid(
                    "Washing",
                    "Dry Cleaning",
                    "Ironing",
                    "Washing & Ironing",
                    "All Services"
                )
            )
            .required(),

        pickupDelivery: Joi.boolean()
            .required(),

        college: Joi.string()
            .required(),

        // Map coordinates
        latitude: Joi.number()
            .min(-90)
            .max(90)
            .allow("", null),

        longitude: Joi.number()
            .min(-180)
            .max(180)
            .allow("", null)

    }).required()

});


// =====================================================
// REVIEW SCHEMA
// =====================================================

module.exports.reviewSchema = Joi.object({

    review: Joi.object({

        review: Joi.string()
            .required(),

        rating: Joi.number()
            .required()
            .min(1)
            .max(5)

    }).required()

});