const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const { messSchema } = require("../schema.js");

const Mess = require("../models/mess.js");
const messController = require("../controllers/messController.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });


// =====================================================
// INDEX + CREATE
// =====================================================

router
    .route("/")

    .get(
        wrapAsync(messController.index)
    )

    .post(
        isLoggedIn,

        // Must exactly match the input name
        upload.single("mess[image][url]"),

        validateListing(messSchema),

        wrapAsync(messController.createPlace)
    );


// =====================================================
// NEW MESS FORM
// =====================================================

router.get(
    "/new",
    isLoggedIn,
    wrapAsync(messController.renderNewForm)
);


// =====================================================
// SHOW + UPDATE + DELETE
// =====================================================

router
    .route("/:id")

    // SHOW
    .get(
        wrapAsync(messController.showPlace)
    )

    // UPDATE
    .put(
        isLoggedIn,

        isOwner(Mess, "/messes"),

        // Must match edit form too
        upload.single("mess[image][url]"),

        validateListing(messSchema),

        wrapAsync(messController.updatePlace)
    )

    // DELETE
    .delete(
        isLoggedIn,

        isOwner(Mess, "/messes"),

        wrapAsync(messController.deletePlace)
    );


// =====================================================
// EDIT
// =====================================================

router.get(
    "/:id/edit",

    isLoggedIn,

    isOwner(Mess, "/messes"),

    wrapAsync(messController.renderEditForm)
);


module.exports = router;