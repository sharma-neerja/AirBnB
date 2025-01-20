const Listing = require("../models/listing");

//Index Route
module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});  
};

//New Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
};

//Show route
module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/show", {listing});
};

//Create Route
module.exports.createListing = async (req, res, next) => {
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
        console.log(newListing);
        await newListing.save();
        req.flash("success", "New Listing added");
        res.redirect("/listings")
    };

    module.exports.renderEditForm = async (req, res) => {
        let {id} = req.params;
        console.log({id});
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing doesn't exist");
            res.redirect("/listings");
        };
        let imageUrl = listing.image.url;
        imageUrl = imageUrl.replace("/upload", "/upload/c_fill,h_200,w_250");
        console.log(imageUrl);
        res.render("listings/edit", {listing, imageUrl});
    };

    //Update Route
    module.exports.update = async(req, res) => {
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
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        console.log("listing searched",listing);
       
        console.log("req.file:", req.file);
        console.log(typeof req.file);
        
        // if(req.file) { (this also works, even when type of req.file is undefind)
        if (typeof req.file != "undefined") {
            let url = req.file.path; 
            let filename = req.file.filename;
            listing.image = {url, filename};
            console.log("image updation level-1");
            await listing.save();
        };
        req.flash("success", "Your listing updated");
        res.redirect(`/listings/${id}`);
    };
    
         
    //Destroy route
    module.exports.destroy = async (req, res) => {
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
    };