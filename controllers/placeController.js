const axios = require("axios");
const College = require("../models/college.js");

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

                const College =
                    require("../models/college.js");

                const colleges =
                    await College.find({})
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

                // ------------------------------------------
                // GET CATEGORY-SPECIFIC FORM DATA
                // ------------------------------------------
                // PG  -> req.body.pg
                // Cafe -> req.body.cafe
                // Mess -> req.body.mess
                // Laundry -> req.body.laundry

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


                // ------------------------------------------
                // CREATE NEW PLACE
                // ------------------------------------------

                const place =
                    new Model(ModelData);


                // ------------------------------------------
                // OWNER
                // ------------------------------------------

                if (req.user) {

                    place.owner =
                        req.user._id;

                }


                // ------------------------------------------
                // IMAGE
                // ------------------------------------------

                if (req.file) {

                    place.image = {

                        url: req.file.path,

                        filename: req.file.filename

                    };

                }


                // ------------------------------------------
                // EXACT MAP LOCATION
                // ------------------------------------------

                const latitude =
                    parseFloat(
                        ModelData.latitude
                    );

                const longitude =
                    parseFloat(
                        ModelData.longitude
                    );


                // ------------------------------------------
                // SAVE EXACT COORDINATES
                // ------------------------------------------

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


                // ------------------------------------------
                // FALLBACK GEOCODING
                // ------------------------------------------
                // If user didn't select a location
                // from the map, geocode the text location.

                else {

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


                        // ----------------------------------
                        // CHECK GEOCODING RESULT
                        // ----------------------------------

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

                        console.log(
                            "Geocoding failed:",
                            geoError.message
                        );

                    }

                }


                // ------------------------------------------
                // SAVE TO DATABASE
                // ------------------------------------------

                await place.save();


                // ------------------------------------------
                // SUCCESS MESSAGE
                // ------------------------------------------

                req.flash(
                    "success",
                    `${category} listed successfully!`
                );


                // ------------------------------------------
                // REDIRECT TO SHOW PAGE
                // ------------------------------------------

                res.redirect(
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


                const College =
                    require("../models/college.js");


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
                    req.body.place;


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

        }

    };

};


module.exports = createPlaceController;
