import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

userSchema.virtual("followersCount", {
  ref: "Follow",
  localField: "_id",
  foreignField: "following",
  count: true,
});

userSchema.virtual("followingCount", {
  ref: "Follow",
  localField: "_id",
  foreignField: "follower",
  count: true,
});

const User = mongoose.model("User", userSchema);

export default User;
