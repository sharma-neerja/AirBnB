const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");

const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
// const upload = multer({ dest: 'uploads/' });
const upload = multer({storage});




//Index Route
router.get("/", wrapAsync(async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});  
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs")
});

//Show route
router.get("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/show", {listing});
}));

//Create Route
router.post("/", isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(async (req, res, next) => {
//     // let {title, description, image, price, country, location} = req.body;
//     // let listing = req.body.listing;
//     // if(!req.body.listing) {
//     //     throw new ExpressError(400, "send valid data for listing");
//     // }
//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if (result.error) {
//     //     console.log("error is:", result.error)
//     //     throw new ExpressError (400, result.error);
//     // }
//     //const newListing = new Listing(req.body.listing);
//     // if(!newListing.title) {
//     //     throw new ExpressError (400, "title is missing");
//     // }
//     // if(!newListing.description) {
//     //     throw new ExpressError (400, "description is missing");
//     // }};
    //   console.log(req.file);
    //   res.send(req.file);
    let url = req.file.path; 
    let filename = req.file.filename;
    console.log(url, "...",filename);
     const newListing = new Listing(req.body.listing);
    newListing.image = {url, filename};
    newListing.owner = req.user._id;
    console.log(newListing.owner);
    await newListing.save();
    req.flash("success", "New Listing added");
    res.redirect("/listings")
}));

// router.post("/", 
//     upload.single('listing[image]'), (req, res) => {
//     res.send(req.file);
// });

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    console.log({id});
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/edit", {listing});
}));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req, res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "send valid data for listing");
    // }
    // let {id} = req.params;
    // let listing = await Listing.findById(id);
    // if (!listing.owner.equals(res.locals.curUser._id)) {
    //     req.flash("error", "You don't have permission to make changes");
    //     console.log("not a listing owner");
    //     return res.redirect(`/listings/${id}`);
    // }
     let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Your listing updated");
    // const listing = await Listing.findById(id);
    res.redirect(`/listings/${id}`);
}));

//Destroy route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.curUser._id)) {
        req.flash("error", "You don't have permission to make changes");
        console.log("not a listing owner");
        return res.redirect(`/listings/${id}`);
    };
    

    
    // let {id} = req.params;
    console.log("id found")
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Your listing deleted");
    res.redirect("/listings");
}));

module.exports = router;
