import express from "express";
import passport from "../config/passport.js";
import { generateToken } from "../util/jwt.js";
import {
  registerController,
  loginController,
} from "../controller/auth.controller.js";

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.post("/register", registerController);
router.post("/login", loginController);

// Start sign-in
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

// Callbacks: every outcome ends in a redirect to the React app
function oauthCallback(provider) {
  return (req, res, next) => {
    passport.authenticate(provider, { session: false }, (err, result) => {
      if (err || !result) {
        console.error(`${provider} oauth error:`, err);
        return res.redirect(`${CLIENT_URL}/login?oauth=failed`);
      }

      // Email belongs to a manual account -> ask for password to link
      if (result.conflict) {
        return res.redirect(
          `${CLIENT_URL}/login?oauth=exists#link=${encodeURIComponent(result.linkToken)}`
        );
      }

      const token = generateToken({ id: result.id, email: result.email });
      res.redirect(
        `${CLIENT_URL}/oauth/callback#token=${encodeURIComponent(token)}`
      );
    })(req, res, next);
  };
}

router.get("/google/callback", oauthCallback("google"));
router.get("/github/callback", oauthCallback("github"));

export default router;