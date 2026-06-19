import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { ROLES } from "../constants/index.js";

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
}

export async function register({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already registered");
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role === ROLES.WRITER ? ROLES.WRITER : ROLES.USER,
    verifiedWriter: role === ROLES.WRITER,
  });

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), token };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), token };
}

export async function getMe(userId) {
  const user = await User.findById(userId).populate("bookmarks purchasedBooks");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return sanitizeUser(user);
}
