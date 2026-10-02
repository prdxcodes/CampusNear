const express = require("express");

const router = express.Router();


// =========================
// ABOUT
// =========================

router.get("/about", (req, res) => {
    res.render("staticPages/about");
});


// =========================
// CONTACT US
// =========================

router.get("/contact", (req, res) => {
    res.render("staticPages/contact");
});


// =========================
// PRIVACY POLICY
// =========================

router.get("/privacy", (req, res) => {
    res.render("staticPages/privacy");
});


// =========================
// TERMS & CONDITIONS
// =========================

router.get("/terms", (req, res) => {
    res.render("staticPages/terms");
});


module.exports = router;