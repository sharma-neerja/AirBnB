const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.postReview = async (req, res) => {
    // console.log(req.params);
    let listing = await Listing.findById(req.params.id);
    // console.log(req.body);
    // console.log(Review);
    let newReview = new Review (req.body.review);
    newReview.author = req.user._id; 
    console.log(newReview.autor);
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Your Review Added");
    res.redirect(`/listings/${listing._id}`);
    };

module.exports.deleteReview = async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("review deleted", reviewId);
    req.flash("success", "Your Review Deleted");
    res.redirect(`/listings/${id}`);
};