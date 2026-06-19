import Ebook from "../models/Ebook.js";
import { EBOOK_STATUS } from "../constants/index.js";

export async function getEbooks(query, user) {
  const {
    page = 1,
    limit = 12,
    genre,
    search,
    minPrice,
    maxPrice,
    sort = "newest",
    availability,
  } = query;

  const filter = {};

  if (!user || (user.role !== "admin" && user.role !== "writer")) {
    filter.status = EBOOK_STATUS.PUBLISHED;
  } else if (availability === "available") {
    filter.status = EBOOK_STATUS.PUBLISHED;
  }

  if (genre) filter.genre = new RegExp(genre, "i");
  if (search) {
    filter.$or = [
      { title: new RegExp(search, "i") },
      { writerName: new RegExp(search, "i") },
    ];
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [ebooks, total] = await Promise.all([
    Ebook.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(Number(limit)),
    Ebook.countDocuments(filter),
  ]);

  return {
    ebooks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
}

export async function getFeatured() {
  return Ebook.find({ status: EBOOK_STATUS.PUBLISHED })
    .sort({ totalSales: -1 })
    .limit(6);
}

export async function getEbookById(id, user) {
  const ebook = await Ebook.findById(id);
  if (!ebook) {
    const err = new Error("Ebook not found");
    err.status = 404;
    throw err;
  }

  const isOwner = user && ebook.writerId.toString() === user._id.toString();
  const isAdmin = user?.role === "admin";

  if (ebook.status !== EBOOK_STATUS.PUBLISHED && !isOwner && !isAdmin) {
    const err = new Error("Ebook not found");
    err.status = 404;
    throw err;
  }

  return ebook;
}

export async function createEbook(data, user) {
  return Ebook.create({
    ...data,
    writerId: user._id,
    writerName: user.name,
    status: EBOOK_STATUS.UNPUBLISHED,
  });
}

export async function updateEbook(id, data, user) {
  const ebook = await Ebook.findById(id);
  if (!ebook) {
    const err = new Error("Ebook not found");
    err.status = 404;
    throw err;
  }

  const isOwner = ebook.writerId.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  Object.assign(ebook, data);
  await ebook.save();
  return ebook;
}

export async function deleteEbook(id, user) {
  const ebook = await Ebook.findById(id);
  if (!ebook) {
    const err = new Error("Ebook not found");
    err.status = 404;
    throw err;
  }

  const isOwner = ebook.writerId.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  await ebook.deleteOne();
  return ebook;
}

export async function setPublishStatus(id, status, user) {
  const ebook = await Ebook.findById(id);
  if (!ebook) {
    const err = new Error("Ebook not found");
    err.status = 404;
    throw err;
  }

  const isOwner = ebook.writerId.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  ebook.status = status;
  await ebook.save();
  return ebook;
}

export async function getWriterEbooks(userId) {
  return Ebook.find({ writerId: userId }).sort({ createdAt: -1 });
}

export async function getAllEbooksAdmin() {
  return Ebook.find().sort({ createdAt: -1 });
}
