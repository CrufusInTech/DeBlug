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

        // Check if email already exists in users table
        const { data: existingUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (existingUser) {
          // Link Google ID if not already linked
          if (!existingUser.google_id) {
            await supabase
              .from("users")
              .update({ google_id: profile.id })
              .eq("email", email);
          }
          return cb(null, existingUser);
        }

        //  If no user, create a new one with Google data
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
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

