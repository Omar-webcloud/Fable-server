import * as userService from "../services/userService.js";
import { updateProfileSchema } from "../validations/index.js";

export async function getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.params.id || req.user._id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const id = req.params.id || req.user._id;

    if (id !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await userService.updateProfile(id, data);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
}

export async function changeRole(req, res, next) {
  try {
    const user = await userService.changeRole(req.params.id, req.body.role);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
