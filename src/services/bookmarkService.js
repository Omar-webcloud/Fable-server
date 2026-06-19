import Bookmark from "../models/Bookmark.js";
import Ebook from "../models/Ebook.js";

export async function getBookmarks(userId) {
  const bookmarks = await Bookmark.find({ userId }).populate("ebookId");
  return bookmarks.map((b) => b.ebookId).filter(Boolean);
}

export async function addBookmark(userId, ebookId) {
  const ebook = await Ebook.findById(ebookId);
  if (!ebook) {
    const err = new Error("Ebook not found");
    err.status = 404;
    throw err;
  }

  const existing = await Bookmark.findOne({ userId, ebookId });
  if (existing) {
    const err = new Error("Already bookmarked");
    err.status = 409;
    throw err;
  }

  await Bookmark.create({ userId, ebookId });
  return { message: "Bookmark added" };
}

export async function removeBookmark(userId, ebookId) {
  const bookmark = await Bookmark.findOneAndDelete({ userId, ebookId });
  if (!bookmark) {
    const err = new Error("Bookmark not found");
    err.status = 404;
    throw err;
  }
  return { message: "Bookmark removed" };
}
