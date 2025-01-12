import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
