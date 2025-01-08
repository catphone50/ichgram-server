import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  image: { type: String, required: true },
  description: { type: String, maxlength: 500, default: "" },
  createdAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
