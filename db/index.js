import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB Connection failed:", error);
    process.exit(1); // Stop the server if DB fails
  }
};
export default connectDB;
