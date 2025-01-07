const express = require("express");
const app = express();
const users = require ("./routes/users.js");
const posts = require ("./routes/posts.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");
const sessionOptions = {
    secret: "mysuperstring",
    resave: false, 
    saveUninitialized: true
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser("secret"));
app.use(flash());

// app.use(session({secret: "mysuperstring", resave: false, saveUninitialized: true
// }));



app.use(session(sessionOptions));

app.get("/", (req, res) => {
    console.dir(req.cookies);
    console.log(req.signedCookies);
    res.send("Hi, I am root");
});

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste");
    res.send("sent some cookies");
});

app.get("/getcookiesagain", (req, res) => {
    res.cookie("capital", "Delhi", {signed: true});
    res.cookie("madeIn", "India");
    res.send("sent some more cookies");
});

app.get("/greet", (req, res) => {
    let {name = "anonymous"} = req.cookies;
    res.send(`hello ${name}`);
});

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.failureMsg = req.flash("failure");
    next();
});

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if (name === "anonymous") {
        req.flash ("failure", "user not registered");
    } else {
        req.flash("success", "user registered successfully");
    };
    res.redirect("/hello");
});
app.get("/hello", (req,res) => {
    // res.locals.successMsg = req.flash("success");
    // res.locals.failureMsg = req.flash("failure");
    // res.render("page.ejs", {name: req.session.name,  msg: req.flash("success")});
    res.render("page.ejs", {name: req.session.name});
});



app.use ("/users", users);
app.use ("/posts", posts);

app.listen(3000, () => {
    console.log("listening on port 3000")
});