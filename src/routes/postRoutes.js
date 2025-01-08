import express from "express";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/:userId", createPost);
router.get("/posts", getAllPosts);
router.get("/user/:userId", getUserPosts);
router.delete("/:postId", deletePost);

export default router;
