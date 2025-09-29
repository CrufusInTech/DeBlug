// Imports
import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from 'passport';


dotenv.config();
const app = express();
const port = 3000;

// Connects to my auth.js
import './auth.js';

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Create Post Variable Array
const createPost = [];


//        Session & Passport Middleware        //
// Session Management

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Passport to manage authentication
app.use(passport.initialize());
app.use(passport.session());

// Auth-Google Route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] })
)

// Callback Url
app.get("/auth/google/callback",passport.authenticate("google", {failureRedirect:"/sign-in"}), (req, res) => {
    res.redirect("/logged-in");
})

// Middleware to check if a user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/sign-in');
}

// Index Route 
app.get("/", (req,res) =>{
    const currentYear = new Date().getFullYear();
    res.render("index", {currentYear: currentYear});
})

// Sign Up Route Form
app.get("/sign-up",(req,res) =>{
    res.render("sign-up");
});

// Sign In Route Form
app.get("/sign-in",(req,res) =>{
    res.render("sign-in");
});

// Logged-in Route
// Protect the /logged-in route
app.get("/logged-in", ensureAuthenticated, (req,res) =>{
    res.render("logged-in", { user: req.user });
});

// Logged Out Route
app.get("/logged-out", ensureAuthenticated, (req,res) =>{
    req.logOut(() =>{
        res.redirect("/");
    }); 
});


/*
// app.get("/home", (req,res) =>{
//     res.render("index",{posts: createPost});
// })

app.post("/posts",(req,res) =>{
    // Accessing my Post form details
    const postForm = req.body;
    console.log("recieved form data", postForm);

    // Sent my post form details to my create post array
    createPost.push(postForm);
    console.log("This is my updated creatPost array",createPost);
    res.redirect("/home");
    
  
});
*/

app.listen(port, () => {
    console.log(`Server starts at http:localhost:${port}`);
})