import bcrypt from "bcrypt";
import pool from "../config/db.js";
import AppErr from "../util/error.js";
import { generateToken } from "../util/jwt.js";

export async function registrationService(name, email, passw) {
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
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
  const result = await pool.query(
    `SELECT id, name, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rowCount === 0) {
    throw new AppErr(401, "Invalid email or password");
  }

  const user = result.rows[0];

  const isPasswValid = await bcrypt.compare(
    passw,
    user.password_hash
  );

  if (!isPasswValid) {
    throw new AppErr(401, "Invalid email or password");
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = generateToken(payload);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}