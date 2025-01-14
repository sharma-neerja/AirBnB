const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");

const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingControllers = require("../controllers/listing.js");

const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
// const upload = multer({ dest: 'uploads/' });
const upload = multer({storage});


router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingControllers.createListing));

//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[Image]'), validateListing, wrapAsync(listingControllers.update))
.delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroy));



// router.post("/", 
//     upload.single('listing[image]'), (req, res) => {
//     res.send(req.file);
// });

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));

module.exports = router;
