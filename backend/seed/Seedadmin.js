// Run this once to create your admin login:
//   node seed/seedAdmin.js
//
// By default creates: admin@chowdesk.com / chowdesk123
// You can override via .env: ADMIN_EMAIL, ADMIN_PASSWORD

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@chowdesk.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "chowdesk123";

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await Admin.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log(`⚠️  Admin already exists: ${ADMIN_EMAIL}`);
    } else {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

      await Admin.create({
        email: ADMIN_EMAIL,
        passwordHash,
        name: "ChowDesk Admin",
        role: "admin",
      });

      console.log("🌱 Admin account created!");
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log("⚠️  Change this password later via the admin dashboard.");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedAdmin();