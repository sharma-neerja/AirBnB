const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");



const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main().then (() => {
   console.log("connected to db")})
   .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("hi, I am root")}
);

//validation listing function
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError (400, errMsg);
    } else {
        next();
    }
};

//validation review function
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError (400, errMsg);
    } else {
        next();
    }
};

//Index Route
app.get("/listings", async(req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});  
});

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
});

//Show route
app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", {listing});
});

//Create Route
app.post("/listings/create", validateListing, wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
    // let listing = req.body.listing;
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "send valid data for listing");
    // }
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (result.error) {
    //     console.log("error is:", result.error)
    //     throw new ExpressError (400, result.error);
    // }
    // const newListing = new Listing(req.body.listing);
    // if(!newListing.title) {
    //     throw new ExpressError (400, "title is missing");
    // }
    // if(!newListing.description) {
    //     throw new ExpressError (400, "description is missing");
    // }};
    await newListing.save();
    res.redirect("/listings")
}));


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async(req, res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "send valid data for listing");
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // const listing = await Listing.findById(id);
    res.redirect(`/listings/${id}`);
}));

//Destroy route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Post Review Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    console.log(req.params);
    let listing = await Listing.findById(req.params.id);
    console.log(req.body);
    console.log(Review);
    let newReview = new Review (req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
    }));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("review deleted", reviewId);
    res.redirect(`/listings/${id}`);
}))

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing ({
//         title: "My new Villa",
//         description: "By the Beach",
//         price: 4000,
//         location: "Calangute, Goa",
//         Country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfully saved");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let {statusCode= 500, message= "Something went Wrong"} = err;
    res.status(statusCode).render("listings/error", {err});
    // res.status(statusCode).send(message);
    // console.log("something went wrong")
    // res.send("something went wrong");
});

app.listen(8080, () => {
    console.log("listening on port 8080")
});


