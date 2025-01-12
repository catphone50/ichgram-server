import express from "express";
import {
  likePost,
  unlikePost,
  getPostLikesCount,
  getPostLikes,
  likeComment,
  unlikeComment,
  getCommentLikesCount,
  getCommentLikes,
} from "../controllers/likeController.js";

const router = express.Router();

router.post("/like", likePost);
router.post("/unlike", unlikePost);
router.get("/likes/count/:postId", getPostLikesCount);
router.get("/likes/:postId", getPostLikes);

router.post("/comment/like", likeComment);
router.post("/comment/unlike", unlikeComment);
router.get("/comment/likes/count/:commentId", getCommentLikesCount);
router.get("/comment/likes/:commentId", getCommentLikes);

export default router;
