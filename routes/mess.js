const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const Mess = require("../models/mess.js");
const messController = require("../controllers/messController.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });


// =========================
// INDEX + CREATE
// =========================

router
    .route("/")
    .get(
        wrapAsync(messController.index)
    )
    .post(
        isLoggedIn,
        upload.single("place[image][url]"),
        validateListing,
        wrapAsync(messController.createPlace)
    );


// =========================
// NEW
// =========================

router.get(
    "/new",
    isLoggedIn,
    messController.renderNewForm
);


// =========================
// SHOW + UPDATE + DELETE
// =========================

router
    .route("/:id")

    .get(
        wrapAsync(messController.showPlace)
    )

    .put(
        isLoggedIn,
        isOwner(Mess, "/messes"),
        upload.single("place[image][url]"),
        validateListing,
        wrapAsync(messController.updatePlace)
    )

    .delete(
        isLoggedIn,
        isOwner(Mess, "/messes"),
        wrapAsync(messController.deletePlace)
    );


// =========================
// EDIT
// =========================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner(Mess, "/messes"),
    wrapAsync(messController.renderEditForm)
);


module.exports = router;