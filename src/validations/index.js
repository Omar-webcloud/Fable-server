import { z } from "zod";
import { ROLES } from "../constants/index.js";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([ROLES.USER, ROLES.WRITER]).optional().default(ROLES.USER),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export const ebookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  fullContent: z.string().optional(),
  genre: z.string().min(1, "Genre is required"),
  coverImage: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
});

export const checkoutSchema = z.object({
  ebookId: z.string().min(1, "Ebook ID is required"),
});

export const roleSchema = z.object({
  role: z.enum(Object.values(ROLES)),
});
