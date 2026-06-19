import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import { ROLES } from "../src/constants/index.js";

const ADMIN_EMAIL = "admin@fable.com";
const ADMIN_PASSWORD = "Admin@123";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("Admin user already exists");
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({
    name: "Admin",
    email: ADMIN_EMAIL,
    password: hashed,
    role: ROLES.ADMIN,
    verifiedWriter: true,
  });

  console.log("Admin user seeded:");
  console.log(`  Email: ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
