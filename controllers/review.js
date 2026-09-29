const Review = require("../models/review.js");

const Pg = require("../models/pg.js");
const Cafe = require("../models/cafe.js");
const Mess = require("../models/mess.js");
const Laundry = require("../models/laundry.js");


// =====================================================
// GET MODEL + REDIRECT PATH
// =====================================================

const getPlaceInfo = (req) => {

    const baseUrl = req.baseUrl;

    if (baseUrl.startsWith("/pgs")) {
        return {
            Model: Pg,
            redirectPath: "/pgs"
        };
    }

    if (baseUrl.startsWith("/cafes")) {
        return {
            Model: Cafe,
            redirectPath: "/cafes"
        };
    }

    if (baseUrl.startsWith("/messes")) {
        return {
            Model: Mess,
            redirectPath: "/messes"
        };
    }

    if (baseUrl.startsWith("/laundries")) {
        return {
            Model: Laundry,
            redirectPath: "/laundries"
        };
    }

    return null;
};


// =====================================================
// CREATE REVIEW
// =====================================================

module.exports.createReview = async (req, res) => {

    const placeInfo = getPlaceInfo(req);

    if (!placeInfo) {
        req.flash("error", "Invalid service.");
        return res.redirect("/");
    }

    const { Model, redirectPath } = placeInfo;

    const place = await Model.findById(req.params.id);

    if (!place) {
        req.flash("error", "Property not found.");
        return res.redirect(redirectPath);
    }


    // Create review

    const review = new Review(req.body.review);

    review.author = req.user._id;

    await review.save();


    // Add review reference to place

    place.reviews.push(review._id);

    await place.save();


    req.flash(
        "success",
        "Thanks for review!"
    );

    res.redirect(
        `${redirectPath}/${place._id}`
    );
};


// =====================================================
// DELETE REVIEW
// =====================================================

module.exports.deleteReview = async (req, res) => {

    const placeInfo = getPlaceInfo(req);

    if (!placeInfo) {
        req.flash("error", "Invalid service.");
        return res.redirect("/");
    }

    const { Model, redirectPath } = placeInfo;

    const { id, reviewId } = req.params;


    // Remove review from place

    await Model.findByIdAndUpdate(
        id,
        {
            $pull: {
                reviews: reviewId
            }
        }
    );


    // Delete review

    await Review.findByIdAndDelete(reviewId);


    req.flash(
        "success",
        "Review deleted successfully!"
    );

    res.redirect(
        `${redirectPath}/${id}`
    );
};
