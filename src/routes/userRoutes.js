import express from "express";
import {
  followUser,
  getFollowers,
  getFollowing,
  getUserProfile,
  unfollowUser,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:userId", getUserProfile);
router.put("/:userId", updateUserProfile);
router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

export default router;
