import express from "express";
import {
  followUser,
  getFollowers,
  getFollowing,
  getUserProfile,
  getUserProfileWithPosts,
  unfollowUser,
  updateUserProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:userId", authMiddleware, getUserProfile);
router.get("/:userId/with-posts", authMiddleware, getUserProfileWithPosts);
router.put("/:userId", authMiddleware, updateUserProfile);
router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.get("/:userId/followers", authMiddleware, getFollowers);
router.get("/:userId/following", authMiddleware, getFollowing);

export default router;
