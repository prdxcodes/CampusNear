const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const homeController = require("../controllers/home.js");

const College = require("../models/college.js");


// ======================================================
// HOME
// ======================================================

router.get(
    "/",
    wrapAsync(homeController.renderHome)
);


// ======================================================
// COLLEGE SEARCH API
// ======================================================

router.get(
    "/colleges/search",
    wrapAsync(async (req, res) => {

        const colleges = await College.find({})
            .select("name shortName city state")
            .sort({ name: 1 });

        res.json(colleges);

    })
);


module.exports = router;