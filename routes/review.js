const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn} = require("../middleware.js");



//Post Review Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    // console.log(req.params);
    let listing = await Listing.findById(req.params.id);
    // console.log(req.body);
    // console.log(Review);
    let newReview = new Review (req.body.review);
    
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Your Review Added");
    res.redirect(`/listings/${listing._id}`);
    }));

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("review deleted", reviewId);
    req.flash("success", "Your Review Deleted");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;