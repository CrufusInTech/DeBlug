// Imports
import 'dotenv/config'; // Make sure this is the first import
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import flash from "connect-flash";
import passport from "passport";
import { supabase } from "./supabaseClient.js";
import "./auth.js"; // import the Google auth config
import bcrypt from "bcrypt";


const app = express();
const port = 3000;

// Connects to my auth.js
import './auth.js'

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


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

// Flash messages for displaying errors
app.use(flash());

// Middleware to make user object available to all templates
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Auth-Google Route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

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
app.get("/sign-up", (req,res) =>{
    res.render("sign-up");
});

app.post("/sign-up", async (req, res) => {
    const { username, email, password } = req.body;

    // 1️⃣ Use Supabase Auth to sign up the user
    // This will send a confirmation email by default.
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (authError) {
        return res.status(400).send(authError.message);
    }

    if (authData.user) {
        // 2️⃣ If auth user is created, insert into your public 'users' table
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id, // Link to the auth.users table
                username: username,
                email: email
            });

        if (profileError) {
            // Note: In a real app, you might want to delete the auth user if profile creation fails.
            return res.status(500).send("Error creating user profile: " + profileError.message);
        }

        return res.send("Sign up successful! Please check your email to confirm your account.");
    }

    res.status(500).send("An unknown error occurred during sign up.");
});

// Sign In Route Form
app.get("/sign-in", (req,res) =>{
    res.render("sign-in", { message: req.flash('error') });
});

app.post("/sign-in", async (req, res, next) => {
    const { username, email, password } = req.body;

    // Use Supabase to sign in and verify the password
    const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    
    // If email/password is wrong, or user doesn't exist.
    if (authError || !authUser) {
        req.flash('error', 'Invalid credentials. Please try again.');
        return res.redirect('/sign-in');
    }

    // Fetch the user profile from your public 'users' table
    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
    
    // If we can't find their profile for some reason.
    if (profileError || !userProfile) {
        req.flash('error', 'Could not find user profile.');
        return res.redirect('/sign-in');
    }
    
    // Check if the username from the form matches the one in the database.
    if (userProfile.username !== username) {
        req.flash('error', 'Invalid credentials. Please try again.');
        return res.redirect('/sign-in');
    }

  // Use the full userProfile object for the session
  req.login(userProfile, (err) => {
    if (err) return next(err);
    res.redirect("/logged-in");
  });
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