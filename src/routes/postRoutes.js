import express from "express";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
  getPostById,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/:userId", createPost);
router.get("/posts", getAllPosts);
router.get("/user/:userId", getUserPosts);
router.delete("/:postId", deletePost);
router.get("/:postId", getPostById);

export default router;
