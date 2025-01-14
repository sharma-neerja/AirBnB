if (process.env.NODE_ENV != "production"){
require('dotenv').config();
};
// console.log(process.env);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;
// console.log("process.env:",process.env.ATLASDB_URL);
// console.log("dbUrl:", dbUrl);

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

const store = MongoStore.create ({
    mongoUrl: dbUrl,
    crypto: {
        secret: "mySuperSecretCode",
    },
    touchAfter: 24*3600,
});
store.on("error", () => {
    console.log("error in mongo session store", error);
});

const sessionOptions = {
    store,
    secret: "mySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user
    next();
});

app.get("/demouser", async(req, res) => {
    let fakeUser = new User({
        email: "abc@gmail.com",
        username: "abc",
    })
    let registeredUser = await User.register(fakeUser, "hello");
    res.send(registeredUser);
});

// app.get("/", (req, res) => {
//     res.send("hi, I am root")}
// );

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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
