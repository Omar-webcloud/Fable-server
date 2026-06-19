import * as adminService from "../services/adminService.js";
import { roleSchema } from "../validations/index.js";
import * as userService from "../services/userService.js";

export async function getStats(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const analytics = await adminService.getAnalytics();
    res.json(analytics);
  } catch (err) {
    next(err);
  }
}

export async function getTransactions(req, res, next) {
  try {
    const transactions = await adminService.getTransactions();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role } = roleSchema.parse(req.body);
    const user = await userService.changeRole(req.params.id, role);
    res.json(user);
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

export async function getTopWriters(req, res, next) {
  try {
    const writers = await adminService.getTopWriters();
    res.json(writers);
  } catch (err) {
    next(err);
  }
}

export async function getMonthlySales(req, res, next) {
  try {
    const data = await adminService.getMonthlySales();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getGenreDistribution(req, res, next) {
  try {
    const data = await adminService.getGenreDistribution();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
