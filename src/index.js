import 'dotenv/config';
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import flash from "connect-flash";
import passport from "passport";
import { supabase } from "./supabaseClient.js";
import "./auth.js";

const app = express();
const port = 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ─── Session ──────────────────────────────────────────────────
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// ─── Passport ─────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Flash Messages ───────────────────────────────────────────
app.use(flash());

// ─── Global Template Variables ────────────────────────────────
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// ─── Auth Guard ───────────────────────────────────────────────
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/sign-in');
}

// ═════════════════════════════════════════════════════════════
//  ROUTES
// ═════════════════════════════════════════════════════════════

// Index
app.get("/", (req, res) => {
    const currentYear = new Date().getFullYear();
    res.render("index", { currentYear });
});

// ─── Sign Up ──────────────────────────────────────────────────
app.get("/sign-up", (req, res) => {
    res.render("sign-up");
});

app.post("/sign-up", async (req, res) => {
    const { username, email, password } = req.body;

    // Create auth user via Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        return res.status(400).send(authError.message);
    }

    if (authData.user) {
        // Insert into public users table
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                username,
                email,
            });

        if (profileError) {
            return res.status(500).send("Error creating user profile: " + profileError.message);
        }

        return res.send("Sign up successful! Please check your email to confirm your account.");
    }

    res.status(500).send("An unknown error occurred during sign up.");
});

// ─── Sign In ──────────────────────────────────────────────────
app.get("/sign-in", (req, res) => {
    res.render("sign-in", { message: req.flash('error') });
});

app.post("/sign-in", async (req, res, next) => {
    const { email, password } = req.body;

    // Verify credentials with Supabase Auth
    const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError || !authUser) {
        req.flash('error', 'Invalid credentials. Please try again.');
        return res.redirect('/sign-in');
    }

    // Fetch the matching profile from the public users table
    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (profileError || !userProfile) {
        req.flash('error', 'Could not find user profile.');
        return res.redirect('/sign-in');
    }

    // Log the user into the session
    req.login(userProfile, (err) => {
        if (err) return next(err);
        res.redirect("/logged-in");
    });
});

// ─── Google OAuth ─────────────────────────────────────────────
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/sign-in" }),
    (req, res) => {
        res.redirect("/logged-in");
    }
);

// ─── Logged In ────────────────────────────────────────────────
app.get("/logged-in", ensureAuthenticated, async (req, res) => {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*, users(username)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error.message);
    }

    res.render("logged-in", { user: req.user, posts: posts || [] });
});

// ─── Logout ───────────────────────────────────────────────────
app.get("/logged-out", ensureAuthenticated, (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

// ─── Server ───────────────────────────────────────────────────
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});