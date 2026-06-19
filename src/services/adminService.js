import User from "../models/User.js";
import Ebook from "../models/Ebook.js";
import Purchase from "../models/Purchase.js";
import Transaction from "../models/Transaction.js";
import { ROLES } from "../constants/index.js";

export async function getDashboardStats() {
  const [totalUsers, totalWriters, totalEbooksSold, revenueResult] =
    await Promise.all([
      User.countDocuments({ role: ROLES.USER }),
      User.countDocuments({ role: ROLES.WRITER }),
      Purchase.countDocuments(),
      Purchase.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);

  return {
    totalUsers,
    totalWriters,
    totalRevenue: revenueResult[0]?.total || 0,
    totalEbooksSold,
  };
}

export async function getAnalytics() {
  const [monthlySales, genreDistribution, stats] = await Promise.all([
    getMonthlySales(),
    getGenreDistribution(),
    getDashboardStats(),
  ]);

  return {
    ...stats,
    monthlySales,
    genreDistribution,
  };
}

export async function getMonthlySales() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return Purchase.aggregate([
    { $match: { purchaseDate: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$purchaseDate" },
          month: { $month: "$purchaseDate" },
        },
        sales: { $sum: 1 },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            { $toString: "$_id.month" },
          ],
        },
        sales: 1,
        revenue: 1,
      },
    },
  ]);
}

export async function getGenreDistribution() {
  return Ebook.aggregate([
    { $match: { status: "published" } },
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $project: { _id: 0, genre: "$_id", count: 1 } },
    { $sort: { count: -1 } },
  ]);
}

export async function getTopWriters() {
  return Purchase.aggregate([
    {
      $group: {
        _id: "$writerId",
        totalSales: { $sum: 1 },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "writer",
      },
    },
    { $unwind: "$writer" },
    {
      $project: {
        _id: 0,
        writerId: "$_id",
        name: "$writer.name",
        image: "$writer.image",
        totalSales: 1,
        revenue: 1,
      },
    },
  ]);
}

export async function getTransactions() {
  return Transaction.find().sort({ date: -1 });
}
