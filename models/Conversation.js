import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "New Conversation",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
