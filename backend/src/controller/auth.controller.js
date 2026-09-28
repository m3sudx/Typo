import {
  loginService,
  registrationService,
} from "../service/auth.service.js";

export async function registerController(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const user = await registrationService(name, email, password);

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginService(email, password);

    return res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
}