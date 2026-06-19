import * as bookmarkService from "../services/bookmarkService.js";

export async function getAll(req, res, next) {
  try {
    const bookmarks = await bookmarkService.getBookmarks(req.user._id);
    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    const ebookId = req.body.ebookId || req.params.ebookId;
    const result = await bookmarkService.addBookmark(req.user._id, ebookId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await bookmarkService.removeBookmark(
      req.user._id,
      req.params.ebookId
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
