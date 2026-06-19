import * as ebookService from "../services/ebookService.js";
import { ebookSchema } from "../validations/index.js";
import { EBOOK_STATUS } from "../constants/index.js";

export async function getAll(req, res, next) {
  try {
    const result = await ebookService.getEbooks(req.query, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getFeatured(req, res, next) {
  try {
    const ebooks = await ebookService.getFeatured();
    res.json(ebooks);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const ebook = await ebookService.getEbookById(req.params.id, req.user);
    res.json(ebook);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = ebookSchema.parse(req.body);
    const ebook = await ebookService.createEbook(data, req.user);
    res.status(201).json(ebook);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const data = ebookSchema.partial().parse(req.body);
    const ebook = await ebookService.updateEbook(req.params.id, data, req.user);
    res.json(ebook);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await ebookService.deleteEbook(req.params.id, req.user);
    res.json({ message: "Ebook deleted" });
  } catch (err) {
    next(err);
  }
}

export async function publish(req, res, next) {
  try {
    const ebook = await ebookService.setPublishStatus(
      req.params.id,
      EBOOK_STATUS.PUBLISHED,
      req.user
    );
    res.json(ebook);
  } catch (err) {
    next(err);
  }
}

export async function unpublish(req, res, next) {
  try {
    const ebook = await ebookService.setPublishStatus(
      req.params.id,
      EBOOK_STATUS.UNPUBLISHED,
      req.user
    );
    res.json(ebook);
  } catch (err) {
    next(err);
  }
}

export async function getWriterEbooks(req, res, next) {
  try {
    const ebooks = await ebookService.getWriterEbooks(req.user._id);
    res.json(ebooks);
  } catch (err) {
    next(err);
  }
}

export async function getAdminEbooks(req, res, next) {
  try {
    const ebooks = await ebookService.getAllEbooksAdmin();
    res.json(ebooks);
  } catch (err) {
    next(err);
  }
}
