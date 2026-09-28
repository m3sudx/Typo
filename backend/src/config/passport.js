import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import { findOrCreateOAuthUser } from "../service/auth.service.js";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3003";

/** Google: lowercased, VERIFIED email or null. */
function pickGoogleEmail(profile) {
  const first = profile.emails?.[0];
  const verified = profile._json?.email_verified ?? first?.verified;
  return verified && first?.value ? first.value.trim().toLowerCase() : null;
}

/**
 * GitHub: ask the API directly for the user's emails.
 * profile.emails is unreliable (depends on library version and privacy settings).
 * Needs the "user:email" scope. Requires Node 18+ (global fetch).
 */
async function fetchGitHubEmail(accessToken) {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "typo-app", // GitHub rejects requests without a User-Agent
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub /user/emails failed with status ${res.status}`);
  }

  const emails = await res.json();

  const picked =
    emails.find((e) => e.primary && e.verified) ??
    emails.find((e) => e.verified);

  return picked?.email?.trim().toLowerCase() ?? null;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await findOrCreateOAuthUser({
          provider: "google",
          providerUserId: String(profile.id),
          name: profile.displayName,
          email: pickGoogleEmail(profile),
        });

        done(null, result);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = await fetchGitHubEmail(accessToken);

        const result = await findOrCreateOAuthUser({
          provider: "github",
          providerUserId: String(profile.id),
          name: profile.displayName || profile.username,
          email,
        });

        done(null, result);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;