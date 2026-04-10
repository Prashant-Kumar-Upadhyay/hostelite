require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // make sure path is correct

async function createAdmin() {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log("Admin already exists");
      return process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@hostelite.com",
      passwordHash: hashedPassword,
      role: "admin"
    });

    console.log("Admin created successfully!");
    process.exit(0);
    
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

createAdmin();
