const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const { pgSchema } = require("../schema.js");

const Pg = require("../models/pg.js");
const pgController = require("../controllers/pgController.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });


// =====================================================
// INDEX + CREATE
// =====================================================

router
    .route("/")

    .get(
        wrapAsync(pgController.index)
    )

    .post(
        isLoggedIn,
        upload.single("pg[image][url]"),
        validateListing(pgSchema),
        wrapAsync(pgController.createPlace)
    );


// =====================================================
// NEW
// =====================================================

router.get(
    "/new",
    isLoggedIn,
    wrapAsync(pgController.renderNewForm)
);


// =====================================================
// SHOW + UPDATE + DELETE
// =====================================================

router
    .route("/:id")

    .get(
        wrapAsync(pgController.showPlace)
    )

    .put(
        isLoggedIn,
        isOwner(Pg, "/pgs"),
        upload.single("pg[image][url]"),
        validateListing(pgSchema),
        wrapAsync(pgController.updatePlace)
    )

    .delete(
        isLoggedIn,
        isOwner(Pg, "/pgs"),
        wrapAsync(pgController.deletePlace)
    );


// =====================================================
// EDIT
// =====================================================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner(Pg, "/pgs"),
    wrapAsync(pgController.renderEditForm)
);


module.exports = router;