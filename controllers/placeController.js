const axios = require("axios");
const College = require("../models/college.js");
const Review = require("../models/review.js");

// ======================================================
// COMMON PLACE CONTROLLER FACTORY
// ======================================================

const createPlaceController = (
    Model,
    category,
    viewsPath,
    redirectPath
) => {

    return {

        // ==================================================
        // INDEX - SHOW NEARBY PLACES
        // ==================================================

        index: async (req, res, next) => {

            try {

                const { college } = req.query;

                let allPlaces = [];
                let selectedCollege = null;

                // ==================================================
                // IF COLLEGE IS SELECTED
                // ==================================================

                if (college) {

                    selectedCollege = await College.findOne({
                        $or: [
                            {
                                name: {
                                    $regex: `^${college}$`,
                                    $options: "i"
                                }
                            },
                            {
                                shortName: {
                                    $regex: `^${college}$`,
                                    $options: "i"
                                }
                            }
                        ]
                    });

                    // ==============================================
                    // COLLEGE FOUND
                    // ==============================================

                    if (selectedCollege) {

                        const [longitude, latitude] =
                            selectedCollege.location.coordinates;


                        // ==========================================
                        // FIND PLACES WITHIN 5 KM
                        // ==========================================

                        allPlaces = await Model.find({

                            geocoding: {
                                $near: {
                                    $geometry: {
                                        type: "Point",
                                        coordinates: [
                                            longitude,
                                            latitude
                                        ]
                                    },
                                    $maxDistance: 5000
                                }
                            }

                        })
                            .populate("college")
                            .populate("owner");

                    }

                }

                // ==================================================
                // NO COLLEGE SELECTED
                // ==================================================

                else {

                    allPlaces = await Model.find({})
                        .populate("college")
                        .populate("owner");

                }


                // ==================================================
                // RENDER PAGE
                // ==================================================

                res.render(
                    `${viewsPath}/index.ejs`,
                    {
                        allPlaces,
                        category,
                        selectedCollege,
                        queryCollege: college || null
                    }
                );

            } catch (err) {

                next(err);

            }

        },


        // ==================================================
        // CREATE PLACE FORM
        // ==================================================

        renderNewForm: async (req, res, next) => {

            try {

                const colleges = await College.find({})
                    .sort({ name: 1 });

                res.render(
                    `${viewsPath}/new.ejs`,
                    {
                        category,
                        colleges
                    }
                );

            } catch (err) {

                next(err);

            }

        },


        // ==================================================
        // CREATE PLACE
        // ==================================================

        createPlace: async (req, res, next) => {

            try {

                const ModelData =
                    req.body[category.toLowerCase()];


                if (!ModelData) {

                    req.flash(
                        "error",
                        "Invalid form data."
                    );

                    return res.redirect(
                        `${redirectPath}/new`
                    );

                }


                // ==============================================
                // CREATE MODEL
                // ==============================================

                const place =
                    new Model(ModelData);


                // ==============================================
                // OWNER
                // ==============================================

                if (req.user) {

                    place.owner =
                        req.user._id;

                }


                // ==============================================
                // IMAGE
                // ==============================================

                if (req.file) {

                    place.image = {

                        url: req.file.path,

                        filename: req.file.filename

                    };

                }


                // ==============================================
                // LOCATION
                // ==============================================

                const latitude =
                    parseFloat(ModelData.latitude);

                const longitude =
                    parseFloat(ModelData.longitude);


                if (
                    !isNaN(latitude) &&
                    !isNaN(longitude)
                ) {

                    place.geocoding = {

                        type: "Point",

                        coordinates: [
                            longitude,
                            latitude
                        ]

                    };

                }

                else {

                    // ==========================================
                    // FALLBACK GEOCODING
                    // ==========================================

                    try {

                        const geoResponse =
                            await axios.get(
                                "https://nominatim.openstreetmap.org/search",
                                {
                                    params: {

                                        q: ModelData.location,

                                        format: "json",

                                        limit: 1

                                    },

                                    headers: {

                                        "User-Agent":
                                            "CampusNear/1.0"

                                    }
                                }
                            );


                        if (
                            geoResponse.data &&
                            geoResponse.data.length > 0
                        ) {

                            const result =
                                geoResponse.data[0];


                            place.geocoding = {

                                type: "Point",

                                coordinates: [

                                    parseFloat(result.lon),

                                    parseFloat(result.lat)

                                ]

                            };

                        }

                    } catch (geoError) {

                        console.log(
                            "Geocoding failed:",
                            geoError.message
                        );

                    }

                }


                // ==============================================
                // REMOVE TEMPORARY FIELDS
                // ==============================================

                delete ModelData.latitude;
                delete ModelData.longitude;


                // ==============================================
                // SAVE
                // ==============================================

                await place.save();


                req.flash(
                    "success",
                    `${category} listed successfully!`
                );


                // ==============================================
                // REDIRECT
                // ==============================================

                return res.redirect(
                    `${redirectPath}/${place._id}`
                );

            } catch (err) {

                next(err);

            }

        },


        // ==================================================
        // SHOW PLACE
        // ==================================================

        showPlace: async (req, res, next) => {

            try {

                const { id } = req.params;


                const place =
                    await Model.findById(id)
                        .populate("reviews")
                        .populate("owner")
                        .populate("college");


                if (!place) {

                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(
                        redirectPath
                    );

                }


                res.render(
                    `${viewsPath}/show.ejs`,
                    {

                        place,

                        [category.toLowerCase()]:
                            place,

                        category

                    }
                );

            } catch (err) {

                next(err);

            }

        },


        // ==================================================
        // EDIT FORM
        // ==================================================

        renderEditForm: async (req, res, next) => {

            try {

                const { id } = req.params;


                const place =
                    await Model.findById(id)
                        .populate("college");


                if (!place) {

                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(
                        redirectPath
                    );

                }


                const colleges =
                    await College.find({})
                        .sort({ name: 1 });


                let originalImageUrl =
                    place.image?.url || "";


                if (originalImageUrl) {

                    originalImageUrl =
                        originalImageUrl.replace(
                            "/uploads",
                            "/uploads/h_300,w_250"
                        );

                }


                res.render(
                    `${viewsPath}/edit.ejs`,
                    {

                        place,

                        [category.toLowerCase()]:
                            place,

                        originalImageUrl,

                        category,

                        colleges

                    }
                );

            } catch (err) {

                next(err);

            }

        },


        // ==================================================
        // UPDATE PLACE
        // ==================================================

        updatePlace: async (req, res, next) => {

            try {

                const { id } = req.params;


                const placeData =
                    req.body[category.toLowerCase()];


                if (!placeData) {

                    req.flash(
                        "error",
                        "Invalid form data."
                    );

                    return res.redirect(
                        `${redirectPath}/${id}/edit`
                    );

                }


                const latitude =
                    parseFloat(
                        placeData.latitude
                    );

                const longitude =
                    parseFloat(
                        placeData.longitude
                    );


                delete placeData.latitude;
                delete placeData.longitude;


                const updateData = {
                    ...placeData
                };


                if (
                    !isNaN(latitude) &&
                    !isNaN(longitude)
                ) {

                    updateData.geocoding = {

                        type: "Point",

                        coordinates: [
                            longitude,
                            latitude
                        ]

                    };

                }


                const place =
                    await Model.findByIdAndUpdate(
                        id,
                        updateData,
                        {
                            new: true,
                            runValidators: true
                        }
                    );


                if (!place) {

                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(
                        redirectPath
                    );

                }


                if (req.file) {

                    place.image = {

                        url: req.file.path,

                        filename: req.file.filename

                    };

                    await place.save();

                }


                req.flash(
                    "success",
                    `${category} updated successfully!`
                );


                res.redirect(
                    `${redirectPath}/${id}`
                );

            } catch (err) {

                next(err);

            }

        },


        // ==================================================
        // DELETE PLACE
        // ==================================================

        deletePlace: async (req, res, next) => {

            try {

                const { id } = req.params;


                const deletedPlace =
                    await Model.findByIdAndDelete(id);


                if (!deletedPlace) {

                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(
                        redirectPath
                    );

                }


                req.flash(
                    "success",
                    `${category} deleted successfully!`
                );


                res.redirect(
                    redirectPath
                );

            } catch (err) {

                next(err);

            }

        },


        // ==================================================
        // CREATE REVIEW
        // ==================================================

        createReview: async (req, res, next) => {

            try {

                const { id } = req.params;

                const place =
                    await Model.findById(id);


                if (!place) {

                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(
                        redirectPath
                    );

                }


                const review =
                    new Review(req.body.review);


                review.author =
                    req.user._id;


                place.reviews.push(review);


                await review.save();

                await place.save();


                req.flash(
                    "success",
                    "Review added successfully!"
                );


                return res.redirect(
                    `${redirectPath}/${id}`
                );

            } catch (err) {

                next(err);

            }

        }

    };

};


module.exports = createPlaceController;