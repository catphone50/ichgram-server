import express from "express";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
  getPostById,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:userId", authMiddleware, createPost);
router.get("/posts", getAllPosts);
router.get("/user/:userId", getUserPosts);
router.delete("/:postId", authMiddleware, deletePost);
router.get("/:postId", getPostById);

export default router;
