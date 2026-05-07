import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      default: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  },
);
if (mongoose.models.Message) {
  delete mongoose.models.Message;
}

export default mongoose.model("Message", messagesSchema);
// export default mongoose.models.Message ||
//   mongoose.model("Message", messagesSchema);
