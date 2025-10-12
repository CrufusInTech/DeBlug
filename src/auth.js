import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { supabase } from "./supabaseClient.js"; // your supabase client

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails[0].value;

        // 1. Check if a user profile already exists in our public 'users' table
        const { data: existingUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        // If the user exists, return their profile from our table
        if (existingUser) {
          // Optional: Link Google ID if not already linked
          if (!existingUser.google_id) {
            await supabase
              .from("users")
              .update({ google_id: profile.id })
              .eq("email", email);
          }
          return cb(null, existingUser);
        }

        // 2. If no user, create a new one in our public 'users' table
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            id: profile.id, // Use the google profile id as the user id
            username: profile.displayName.replace(/\s+/g, "_"),
            email,
            google_id: profile.id,
          })
          .select()
          .single();

        if (insertError) return cb(insertError, null);

        return cb(null, newUser);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});
