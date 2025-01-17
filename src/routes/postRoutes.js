import express from "express";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
  getPostById,
  getPostsByLimit,
  getPostsByLikesAndLimit,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:userId", authMiddleware, createPost);
router.get("/posts", getAllPosts);
router.get("/user/:userId", getUserPosts);
router.delete("/:postId", authMiddleware, deletePost);
router.get("/:postId", getPostById);
router.get("/posts/limit/:limit", getPostsByLimit);
router.get("/posts/likes/:start/:end", getPostsByLikesAndLimit);

export default router;
