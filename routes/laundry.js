const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const Laundry = require("../models/laundry.js");

const {
    laundrySchema
} = require("../schema.js");

const laundryController =
    require("../controllers/laundryController.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });


// ===============================
// INDEX + CREATE
// ===============================

router
    .route("/")
    .get(
        wrapAsync(laundryController.index)
    )
    .post(
        isLoggedIn,
        upload.single("laundry[image][url]"),
        validateListing(laundrySchema),
        wrapAsync(laundryController.createPlace)
    );


// ===============================
// NEW
// ===============================

router.get(
    "/new",
    isLoggedIn,
    wrapAsync(laundryController.renderNewForm)
);


// ===============================
// SHOW + UPDATE + DELETE
// ===============================

router
    .route("/:id")

    .get(
        wrapAsync(laundryController.showPlace)
    )

    .put(
        isLoggedIn,
        isOwner(Laundry, "/laundries"),
        upload.single("laundry[image][url]"),
        validateListing(laundrySchema),
        wrapAsync(laundryController.updatePlace)
    )

    .delete(
        isLoggedIn,
        isOwner(Laundry, "/laundries"),
        wrapAsync(laundryController.deletePlace)
    );


// ===============================
// EDIT
// ===============================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner(Laundry, "/laundries"),
    wrapAsync(laundryController.renderEditForm)
);


module.exports = router;