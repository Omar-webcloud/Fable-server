import * as authService from "../services/authService.js";
import {
  registerSchema,
  loginSchema,
} from "../validations/index.js";

export async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}

export async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user._id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
