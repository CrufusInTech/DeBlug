// Imports
import 'dotenv/config'; // Make sure this is the first import
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
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

  // 1️⃣ Check for existing email or username
  const { data: existingEmail } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  const { data: existingUsername } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (existingEmail) return res.send("Email already in use");
  if (existingUsername) return res.send("Username already taken");

  // 2️⃣ Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // 3️⃣ Insert user
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({ username, email, password_hash })
    .select()
    .single();

  if (error) return res.send(error.message);

  res.send("Sign up successful! Please confirm your email before logging in.");
});

// Sign In Route Form
app.get("/sign-in", (req,res) =>{
    res.render("sign-in");
});

app.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) return res.send("Email or password incorrect");

  if (!user.password_hash)
    return res.send("This account was created with Google. Please log in with Google.");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.send("Email or password incorrect");

  req.login(user, (err) => {
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