import express from "express";
import {
  addComment,
  deleteComment,
  getCommentsByPost,
  getCommentById,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/add", addComment);
router.delete("/delete/:commentId", deleteComment);
router.get("/post/:postId", getCommentsByPost);
router.get("/commentId", getCommentById);

export default router;
