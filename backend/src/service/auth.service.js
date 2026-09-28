import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import AppErr from "../util/error.js";
import { generateToken } from "../util/jwt.js";

const normalizeEmail = (email) => String(email ?? "").trim().toLowerCase();

export async function registrationService(name, email, passw) {
  email = normalizeEmail(email);

  const existingUser = await pool.query(
    `SELECT id FROM users WHERE LOWER(email) = $1`,
    [email]
  );

  if (existingUser.rowCount > 0) {
    throw new AppErr(400, "User already registered with this email");
  }

  const hashedPassw = await bcrypt.hash(passw, 12);

  const newUser = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, hashedPassw]
  );

  return newUser.rows[0];
}

export async function loginService(email, passw) {
  email = normalizeEmail(email);

  const result = await pool.query(
    `SELECT id, name, email, password_hash
     FROM users
     WHERE LOWER(email) = $1`,
    [email]
  );

  if (result.rowCount === 0) {
    throw new AppErr(401, "Invalid email or password");
  }

  const user = result.rows[0];

  // OAuth-only account: no password to compare against
  if (!user.password_hash) {
    throw new AppErr(
      401,
      "This account uses Google/GitHub sign-in. Use that button instead."
    );
  }

  const isPasswValid = await bcrypt.compare(passw, user.password_hash);

  if (!isPasswValid) {
    throw new AppErr(401, "Invalid email or password");
  }

  const token = generateToken({ id: user.id, email: user.email });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
}

/**
 * Returns either:
 *   { id, name, email }                 -> user found/created, log them in
 *   { conflict: true, linkToken }       -> email belongs to a manual account;
 *                                          user must prove ownership with password
 */
export async function findOrCreateOAuthUser({
  provider,
  providerUserId,
  name,
  email,
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Known identity -> log in
    const existingOAuthAccount = await client.query(
      `SELECT users.id, users.name, users.email
       FROM oauth_accounts
       JOIN users ON users.id = oauth_accounts.user_id
       WHERE oauth_accounts.provider = $1
         AND oauth_accounts.provider_user_id = $2`,
      [provider, providerUserId]
    );

    if (existingOAuthAccount.rowCount > 0) {
      await client.query("COMMIT");
      return existingOAuthAccount.rows[0];
    }

    // 2. Need a verified email from here on
    if (!email) {
      throw new AppErr(
        400,
        "The provider did not return a verified email address"
      );
    }

    // 3. Email already used by another account -> require password to link
    const existingUser = await client.query(
      `SELECT id, name, email, password_hash FROM users WHERE LOWER(email) = $1`,
      [email]
    );

    // 3a. Existing account has NO password => it was created via a provider that
    //     already verified this email. The new provider verified it too, so it is
    //     safe to auto-link.
    if (existingUser.rowCount > 0 && !existingUser.rows[0].password_hash) {
      const existing = existingUser.rows[0];

      await client.query(
        `INSERT INTO oauth_accounts (user_id, provider, provider_user_id)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [existing.id, provider, providerUserId]
      );

      await client.query("COMMIT");
      return { id: existing.id, name: existing.name, email: existing.email };
    }

    // 3b. Existing account HAS a password (manual signup, email never verified)
    //     => require the password once before linking.
    if (existingUser.rowCount > 0) {
      await client.query("ROLLBACK");

      const linkToken = jwt.sign(
        { provider, providerUserId, email, purpose: "oauth-link" },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );

      return { conflict: true, linkToken };
    }

    // 4. Brand new user
    const newUser = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, NULL)
       RETURNING id, name, email`,
      [name || email.split("@")[0], email]
    );

    const user = newUser.rows[0];

    await client.query(
      `INSERT INTO oauth_accounts (user_id, provider, provider_user_id)
       VALUES ($1, $2, $3)`,
      [user.id, provider, providerUserId]
    );

    await client.query("COMMIT");
    return user;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Called AFTER a successful password login, to attach the pending
 * Google/GitHub identity to that account.
 */
export async function linkOAuthAccount(user, linkToken) {
  let claims;
  try {
    claims = jwt.verify(linkToken, process.env.JWT_SECRET);
  } catch {
    throw new AppErr(400, "Link request expired. Please try Google/GitHub again.");
  }

  if (claims.purpose !== "oauth-link") {
    throw new AppErr(400, "Invalid link request.");
  }

  // The provider identity must belong to the SAME email as the account
  if (claims.email !== normalizeEmail(user.email)) {
    throw new AppErr(403, "This provider account does not match your email.");
  }

  await pool.query(
    `INSERT INTO oauth_accounts (user_id, provider, provider_user_id)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [user.id, claims.provider, claims.providerUserId]
  );
}