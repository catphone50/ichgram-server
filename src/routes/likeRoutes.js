import express from "express";
import {
  likePost,
  unlikePost,
  getPostLikesCount,
  getPostLikes,
} from "../controllers/likeController.js";

const router = express.Router();

router.post("/like", likePost);
router.post("/unlike", unlikePost);
router.get("/likes/count/:postId", getPostLikesCount);
router.get("/likes/:postId", getPostLikes);

export default router;
