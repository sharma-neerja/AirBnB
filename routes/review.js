const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewerLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");


//Post Review Route
router.post("/", isReviewerLoggedIn, validateReview, wrapAsync(reviewControllers.postReview));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewControllers.deleteReview));


module.exports = router;