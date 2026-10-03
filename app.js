const dns = require("dns");

// MongoDB Atlas DNS fix
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

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
const staticPagesRouter = require("./routes/staticPages");

const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { error } = require("console");

const dbUrl = process.env.ATLASDB_URL;

// =========================
// SESSION
// =========================

const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

// =========================
// PASSPORT
// =========================

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// =========================
// FLASH
// =========================

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// =========================
// EJS / MIDDLEWARE
// =========================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);


// =========================
// DATABASE
// =========================

async function main() {
    try {
        await mongoose.connect(dbUrl);

        console.log("Connected to MongoDB Atlas");
        console.log("Database:", mongoose.connection.name);

    } catch (err) {
        console.error("Database connection error:");
        console.error(err.message);
    }
}

main();


// =========================
// CURRENT URL
// =========================

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});


// =========================
// ROUTES
// =========================

// Home
app.use("/", homeRouter);

// Categories
app.use("/pgs", pgRouter);

app.use("/cafes", cafeRouter);

app.use("/messes", messRouter);

app.use("/laundries", laundryRouter);


// =========================
// REVIEWS
// =========================

app.use("/pgs/:id/reviews", reviewRouter);

app.use("/cafes/:id/reviews", reviewRouter);

app.use("/messes/:id/reviews", reviewRouter);

app.use("/laundries/:id/reviews", reviewRouter);


// =========================
// USER
// =========================

app.use("/", userRouter);


// =========================
// STATIC PAGES
// =========================

app.use("/", staticPagesRouter);


// =========================
// 404 ERROR
// =========================

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
    const {
        statusCode = 500,
        message = "Something went wrong"
    } = err;

    res.status(statusCode).render("includes/error.ejs", {
        message
    });
});


// =========================
// SERVER
// =========================

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});