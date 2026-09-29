const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const Laundry = require("../models/laundry.js");

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
        upload.single("place[image][url]"),
        validateListing,
        wrapAsync(laundryController.createPlace)
    );


// ===============================
// NEW
// ===============================

router.get(
    "/new",
    isLoggedIn,
    laundryController.renderNewForm
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
        upload.single("place[image][url]"),
        validateListing,
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