const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const Cafe = require("../models/cafe.js");
const cafeController = require("../controllers/cafeController.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });


// =========================
// Index + Create
// =========================

router
    .route("/")
    .get(
        wrapAsync(cafeController.index)
    )
    .post(
        isLoggedIn,
        upload.single("place[image][url]"),
        validateListing,
        wrapAsync(cafeController.createPlace)
    );


// =========================
// New
// =========================

router.get(
    "/new",
    isLoggedIn,
    wrapAsync(cafeController.renderNewForm)
);


// =========================
// Show + Update + Delete
// =========================

router
    .route("/:id")
    .get(
        wrapAsync(cafeController.showPlace)
    )

    .put(
        isLoggedIn,
        isOwner(Cafe, "/cafes"),
        upload.single("place[image][url]"),
        validateListing,
        wrapAsync(cafeController.updatePlace)
    )

    .delete(
        isLoggedIn,
        isOwner(Cafe, "/cafes"),
        wrapAsync(cafeController.deletePlace)
    );


// =========================
// Edit
// =========================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner(Cafe, "/cafes"),
    wrapAsync(cafeController.renderEditForm)
);


module.exports = router;