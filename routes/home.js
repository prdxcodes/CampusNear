const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Pg = require("../models/pg.js");

const homeController = require("../controllers/home.js");

router.get("/", wrapAsync(homeController.renderHome));

module.exports = router;