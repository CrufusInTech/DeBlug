import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // This is the crucial part. It must match the route in index.js
      callbackURL: "http://localhost:3000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    (accessToken, refreshToken, profile, cb) => {
      // Here you would find or create a user in your database
      // For now, we'll just pass the profile to the serializeUser function
      console.log(profile);
      return cb(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  // Store user information in the session (e.g., user.id)
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  // Retrieve user information from the session
  // In a real app, you'd fetch the user from the DB using the id
  cb(null, user);
});