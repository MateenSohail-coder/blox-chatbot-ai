import mongoose from "mongoose";
const Userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      reqiured: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);
export default mongoose.models.User || mongoose.model("User", Userschema);
