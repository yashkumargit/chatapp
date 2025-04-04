const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      throw new Error("⚠️ MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB Atlas...");
  } catch (error) {
    console.error("❌ MongoDB Atlas Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
