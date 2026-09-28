import AppErr from "../util/error.js";
import {
  registrationService,
  loginService,
  linkOAuthAccount,
} from "../service/auth.service.js";

export async function registerController(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      throw new AppErr(400, "Name, email and password are required");
    }

    const user = await registrationService(name.trim(), email, password);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const { email, password, linkToken } = req.body;

    if (!email?.trim() || !password) {
      throw new AppErr(400, "Email and password are required");
    }

    const result = await loginService(email, password);

    // Password verified -> safe to attach the pending Google/GitHub identity
    if (linkToken) {
      await linkOAuthAccount(result.user, linkToken);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}