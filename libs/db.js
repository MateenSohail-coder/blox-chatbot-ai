import mongoose from "mongoose";
const mongodb_uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/pratice";
export async function ConnectDB() {
  if (mongoose.connection.readyState >= 1) {
    return null;
  }
  await mongoose.connect(mongodb_uri);
}
