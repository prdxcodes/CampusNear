const User = require("../models/user.js");


// =========================
// SIGNUP FORM
// =========================

module.exports.renderSignupForm = (req, res) => {

    res.render("user/signup.ejs");

};


// =========================
// SIGNUP
// =========================

module.exports.signup = async (req, res, next) => {

    try {

        let { username, email, password } = req.body;

        const newUser = new User({
            username,
            email
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        req.login(registeredUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash(
                "success",
                "Welcome to CampusNear"
            );

            res.redirect("/");

        });

    } catch (err) {

        req.flash(
            "error",
            err.message
        );

        res.redirect("/signup");

    }

};


// =========================
// LOGIN FORM
// =========================

module.exports.renderLoginForm = (req, res) => {

    res.render("user/login.ejs");

};


// =========================
// LOGIN
// =========================

module.exports.login = async (req, res) => {

    req.flash(
        "success",
        "Welcome to CampusNear"
    );

    const redirectUrl =
        res.locals.redirectUrl || "/";

    res.redirect(redirectUrl);

};


// =========================
// LOGOUT
// =========================

module.exports.logout = (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash(
            "success",
            "You're logged out"
        );

        res.redirect("/");

    });

};