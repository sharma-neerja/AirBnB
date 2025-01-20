const Listing = require("./models/listing");
const Review = require("./models/review");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/expressError.js");


module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        console.log(req.session.redirectUrl);
        console.log("user not logged in");
        return res.redirect("/login");
    }
    console.log("user logged in");
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        console.log("about to store url");
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log("url saved")
        console.log(res.locals.redirectUrl)
    } else {
        console.log ("no session redirectURL available")
    }
    next();
};

module.exports.isReviewerLoggedIn = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(req.params.id);
    console.log(req.user);
    console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = `/listings/${id}`;
        req.flash("error", "You must be logged in");
        console.log(req.session.redirectUrl);
        console.log("user not logged in");
        return res.redirect("/login");
    }
    console.log("user logged in");
    next();
};

module.exports.isOwner = wrapAsync(async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.curUser._id)) {
        req.flash("error", "You don't have permission to make changes");
        console.log("not a listing owner");
        return res.redirect(`/listings/${id}`);
    };
    console.log("user is the owner of listing");
    next();
});

module.exports.isReviewAuthor = wrapAsync(async(req, res, next) => {
    let {id, reviewId} = req.params;
    console.log("deletion starts")
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.curUser._id)) {
        req.flash("error", "You don't have permission to make changes");
        console.log("not a review author");
        return res.redirect(`/listings/${id}`);
    };
    next();
});

//validation listing function
module.exports.validateListing = (req, res, next) => {
    console.log("validation starts");
    console.log(req.params);
    console.log(req.body);
    const {error} = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        console.log("Validation Error:", errMsg);
        throw new ExpressError (400, errMsg);
    } else {
        console.log("validation ends");
        next();
    }
};

//validation review function
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        console.log(error);
        throw new ExpressError (400, errMsg);
    } else {
        next();
    }
};