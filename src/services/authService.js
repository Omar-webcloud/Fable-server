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

export async function googleLogin(idToken) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  if (!response.ok) {
    const err = new Error("Invalid Google ID Token");
    err.status = 401;
    throw err;
  }

  const payload = await response.json();

  // Validate Audience (Client ID)
  const clientID = process.env.GOOGLE_CLIENT_ID;
  if (clientID && payload.aud !== clientID) {
    const err = new Error("Token audience mismatch");
    err.status = 401;
    throw err;
  }

  const { email, name, picture } = payload;
  if (!email) {
    const err = new Error("Email not provided by Google");
    err.status = 400;
    throw err;
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      image: picture || "",
      role: ROLES.USER,
    });
  } else if (picture && !user.image) {
    user.image = picture;
    await user.save();
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
