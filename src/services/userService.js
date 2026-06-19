import User from "../models/User.js";

export async function getProfile(userId) {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
}

export async function updateProfile(userId, data) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
}

export async function getAllUsers() {
  return User.find().select("-password").sort({ createdAt: -1 });
}

export async function deleteUser(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
}

export async function changeRole(userId, role) {
  const user = await User.findByIdAndUpdate(
    userId,
    { role, verifiedWriter: role === "writer" },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
}
