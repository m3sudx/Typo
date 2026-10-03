import pool from "../config/db.js";
import AppErr from "../util/error.js";
import { verifyToken } from "../util/jwt.js";

export async function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppErr(401, "Login required");
  }

  let payload;

  try {
    payload = verifyToken(token);
  } catch {
    throw new AppErr(401, "Invalid or expired token");
  }

  const { rows } = await pool.query(
    `SELECT id, name, email
     FROM users
     WHERE id = $1`,
    [payload.id]
  );

  if (!rows[0]) {
    throw new AppErr(401, "User no longer exists");
  }

  req.user = rows[0];

  next();
}