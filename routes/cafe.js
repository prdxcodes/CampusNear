const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isOwner,
    validateListing,
    validateReview
} = require("../middleware.js");

const { cafeSchema } = require("../schema.js");

const Cafe = require("../models/cafe.js");
const cafeController = require("../controllers/cafeController.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });


// ==================================================
// INDEX + CREATE
// ==================================================

router
    .route("/")

    // =========================
    // INDEX
    // =========================

    .get(
        wrapAsync(cafeController.index)
    )

    // =========================
    // CREATE CAFE
    // =========================

    .post(
        isLoggedIn,

        // Cafe form:
        // name="cafe[image][url]"
        upload.single("cafe[image][url]"),

        // Cafe-specific Joi validation
        validateListing(cafeSchema),

        wrapAsync(cafeController.createPlace)
    );


// ==================================================
// NEW CAFE FORM
// ==================================================

router.get(
    "/new",
    isLoggedIn,
    wrapAsync(cafeController.renderNewForm)
);


// ==================================================
// SHOW / UPDATE / DELETE
// ==================================================

router
    .route("/:id")

    // =========================
    // SHOW
    // =========================

    .get(
        wrapAsync(cafeController.showPlace)
    )

    // =========================
    // UPDATE
    // =========================

    .put(
        isLoggedIn,

        isOwner(Cafe, "/cafes"),

        // Cafe edit form:
        // name="cafe[image][url]"
        upload.single("cafe[image][url]"),

        // Cafe-specific Joi validation
        validateListing(cafeSchema),

        wrapAsync(cafeController.updatePlace)
    )

    // =========================
    // DELETE
    // =========================

    .delete(
        isLoggedIn,

        isOwner(Cafe, "/cafes"),

        wrapAsync(cafeController.deletePlace)
    );


// ==================================================
// EDIT CAFE FORM
// ==================================================

router.get(
    "/:id/edit",

    isLoggedIn,

    isOwner(Cafe, "/cafes"),

    wrapAsync(cafeController.renderEditForm)
);

module.exports = router;