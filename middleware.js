const Pg = require("./models/pg");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");

const {
    pgSchema,
    reviewSchema
} = require("./schema.js");


// =====================================================
// IS LOGGED IN
// =====================================================

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl =
            req.originalUrl;

        return res.redirect("/signup");
    }

    next();
};


// =====================================================
// SAVE REDIRECT URL
// =====================================================

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {

        res.locals.redirectUrl =
            req.session.redirectUrl;

    }

    next();
};


// =====================================================
// IS OWNER
// =====================================================

module.exports.isOwner = (Model, redirectPath) => {

    return async (req, res, next) => {

        try {

            const { id } = req.params;


            const place =
                await Model.findById(id);


            if (!place) {

                req.flash(
                    "error",
                    "Property not found"
                );

                return res.redirect(
                    redirectPath
                );

            }


            if (!res.locals.currUser) {

                req.flash(
                    "error",
                    "You must be logged in"
                );

                return res.redirect(
                    "/login"
                );

            }


            if (!place.owner) {

                req.flash(
                    "error",
                    "Property owner not found"
                );

                return res.redirect(
                    `${redirectPath}/${id}`
                );

            }


            if (
                !place.owner.equals(
                    res.locals.currUser._id
                )
            ) {

                req.flash(
                    "error",
                    "You don't have permission to edit"
                );

                return res.redirect(
                    `${redirectPath}/${id}`
                );

            }


            next();


        } catch (err) {

            next(err);

        }

    };

};


// =====================================================
// VALIDATE LISTING
// =====================================================

module.exports.validateListing = (schema) => {

    return (req, res, next) => {

        const { error } = schema.validate(req.body);

        if (error) {

            const errMsg = error.details
                .map((el) => el.message)
                .join(",");

            throw new ExpressError(400, errMsg);
        }

        next();
    };
};

// =====================================================
// VALIDATE REVIEW
// =====================================================

module.exports.validateReview = (
    req,
    res,
    next
) => {

    let { error } =
        reviewSchema.validate(req.body);


    if (error) {

        let errMsg =
            error.details
                .map((el) => el.message)
                .join(",");


        throw new ExpressError(
            400,
            errMsg
        );

    }


    next();

};


// =====================================================
// IS REVIEW AUTHOR
// =====================================================

module.exports.isReviewAuthor =
    async (req, res, next) => {

        let {
            id,
            reviewId
        } = req.params;


        let review =
            await Review.findById(reviewId);


        if (
            !review.author._id.equals(
                res.locals.currUser._id
            )
        ) {

            req.flash(
                "error",
                "You don't have permission to delete"
            );

            return res.redirect(
                `/pgs/${id}`
            );

        }


        next();

    };