const express = require("express");

const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

const {
    validateReview,
    isLoggedIn,
    isReviewAuthor
} = require("../middleware.js");

const reviewController = require("../controllers/review.js");


// =====================================================
// CREATE REVIEW
// =====================================================

router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);


// =====================================================
// DELETE REVIEW
// =====================================================

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);


module.exports = router;