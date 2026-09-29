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
        // INDEX - SHOW ALL PLACES
        // ==================================================

        index: async (req, res, next) => {

            try {

                const allPlaces = await Model.find({})
                    .populate("college")
                    .populate("owner");

                res.render(
                    `${viewsPath}/index.ejs`,
                    {
                        allPlaces,
                        category
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


                // =========================
                // CREATE MODEL
                // =========================

                const place =
                    new Model(ModelData);


                // =========================
                // OWNER
                // =========================

                if (req.user) {

                    place.owner =
                        req.user._id;

                }


                // =========================
                // IMAGE
                // =========================

                if (req.file) {

                    place.image = {

                        url: req.file.path,

                        filename: req.file.filename

                    };

                }


                // =========================
                // LOCATION
                // =========================

                const latitude =
                    parseFloat(
                        ModelData.latitude
                    );

                const longitude =
                    parseFloat(
                        ModelData.longitude
                    );


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

                } else {

                    // =========================
                    // FALLBACK GEOCODING
                    // =========================

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

                                    parseFloat(
                                        result.lon
                                    ),

                                    parseFloat(
                                        result.lat
                                    )

                                ]

                            };

                        }

                    } catch (geoError) {

                        // Geocoding failure should not crash
                        // the application.

                    }

                }


                // =========================
                // REMOVE TEMPORARY FIELDS
                // =========================

                delete ModelData.latitude;
                delete ModelData.longitude;


                // =========================
                // SAVE TO DATABASE
                // =========================

                await place.save();


                // =========================
                // SUCCESS
                // =========================

                req.flash(
                    "success",
                    `${category} listed successfully!`
                );


                // =========================
                // REDIRECT
                // =========================

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

                const { id } =
                    req.params;


                const place =
                    await Model.findById(id)
                        .populate("reviews")
                        .populate("owner")
                        .populate("college");


                // ------------------------------------------
                // PLACE NOT FOUND
                // ------------------------------------------

                if (!place) {

                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(
                        redirectPath
                    );

                }


                // ------------------------------------------
                // RENDER SHOW PAGE
                // ------------------------------------------

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

                const { id } =
                    req.params;


                // ------------------------------------------
                // FIND PLACE
                // ------------------------------------------

                const place =
                    await Model.findById(id)
                        .populate("college");


                // ------------------------------------------
                // PLACE NOT FOUND
                // ------------------------------------------

                if (!place) {

                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(
                        redirectPath
                    );

                }


                // ------------------------------------------
                // GET COLLEGES
                // ------------------------------------------

                const colleges =
                    await College.find({})
                        .sort({
                            name: 1
                        });


                // ------------------------------------------
                // EXISTING IMAGE
                // ------------------------------------------

                let originalImageUrl =
                    place.image?.url || "";


                if (originalImageUrl) {

                    originalImageUrl =
                        originalImageUrl.replace(
                            "/uploads",
                            "/uploads/h_300,w_250"
                        );

                }


                // ------------------------------------------
                // RENDER EDIT FORM
                // ------------------------------------------

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

                const { id } =
                    req.params;


                // ------------------------------------------
                // GET FORM DATA
                // ------------------------------------------

                const placeData =
                    req.body[category.toLowerCase()];


                // ------------------------------------------
                // VALIDATE FORM DATA
                // ------------------------------------------

                if (!placeData) {

                    req.flash(
                        "error",
                        "Invalid form data."
                    );

                    return res.redirect(
                        `${redirectPath}/${id}/edit`
                    );

                }


                // ------------------------------------------
                // GET LATITUDE / LONGITUDE
                // ------------------------------------------

                const latitude =
                    parseFloat(
                        placeData.latitude
                    );

                const longitude =
                    parseFloat(
                        placeData.longitude
                    );


                // ------------------------------------------
                // REMOVE TEMPORARY FORM FIELDS
                // ------------------------------------------

                delete placeData.latitude;
                delete placeData.longitude;


                // ------------------------------------------
                // PREPARE UPDATE DATA
                // ------------------------------------------

                const updateData = {
                    ...placeData
                };


                // ------------------------------------------
                // SAVE EXACT MAP LOCATION
                // ------------------------------------------

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


                // ------------------------------------------
                // UPDATE DATABASE
                // ------------------------------------------

                const place =
                    await Model.findByIdAndUpdate(
                        id,
                        updateData,
                        {
                            new: true,
                            runValidators: true
                        }
                    );


                // ------------------------------------------
                // PLACE NOT FOUND
                // ------------------------------------------

                if (!place) {

                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(
                        redirectPath
                    );

                }


                // ------------------------------------------
                // IMAGE UPDATE
                // ------------------------------------------

                if (req.file) {

                    place.image = {

                        url: req.file.path,

                        filename:
                            req.file.filename

                    };

                    await place.save();

                }


                // ------------------------------------------
                // SUCCESS MESSAGE
                // ------------------------------------------

                req.flash(
                    "success",
                    `${category} updated successfully!`
                );


                // ------------------------------------------
                // REDIRECT
                // ------------------------------------------

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

                const { id } =
                    req.params;


                const deletedPlace =
                    await Model.findByIdAndDelete(id);


                // ------------------------------------------
                // PLACE NOT FOUND
                // ------------------------------------------

                if (!deletedPlace) {

                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(
                        redirectPath
                    );

                }


                // ------------------------------------------
                // SUCCESS MESSAGE
                // ------------------------------------------

                req.flash(
                    "success",
                    `${category} deleted successfully!`
                );


                // ------------------------------------------
                // REDIRECT
                // ------------------------------------------

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

                const place = await Model.findById(id);

                if (!place) {
                    req.flash(
                        "error",
                        `${category} does not exist!`
                    );

                    return res.redirect(redirectPath);
                }

                const review = new Review(req.body.review);

                // Logged-in user ko author banao
                review.author = req.user._id;

                // Review ko place ke reviews array mein add karo
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