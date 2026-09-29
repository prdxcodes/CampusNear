const Review = require("../models/review.js");
const Pg = require("../models/pg.js");

module.exports.createReview = async (req, res) => {
    let pg = await Pg.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    pg.reviews.push(review);
    await review.save();
    await pg.save();
    req.flash("success", "Thanks for review!");
    res.redirect(`/pgs/${pg._id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Pg.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/pgs/${id}`);
};