if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
};

const ExpressError = require("./utils/ExpressError.js");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const homeRouter = require("./routes/home.js");
const pgRouter = require("./routes/pg.js");
const cafeRouter = require("./routes/cafe.js");
const messRouter = require("./routes/mess.js");
const laundryRouter = require("./routes/laundry.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const aboutRouter = require("./routes/about");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// Session

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// .......

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

// DataBase

main()
    .then((res) => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/campusnear");
}

// Current URL available in all EJS files

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

//Home

app.use("/", homeRouter);

// Categories

app.use("/pgs", pgRouter);
app.use("/cafes", cafeRouter);
app.use("/messes", messRouter);
app.use("/laundries", laundryRouter);

// Review

app.use("/pgs/:id/reviews", reviewRouter);
app.use("/cafes/:id/reviews", reviewRouter);
app.use("/messes/:id/reviews", reviewRouter);
app.use("/laundries/:id/reviews", reviewRouter);

// SignUp

app.use("/", userRouter);

// About

app.use("/about", aboutRouter);

// Error Handeling

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 505, message = "Something went wrong" } = err;
    res.status(statusCode).render("pgs/error.ejs", { message });
});

// Localhost

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});  