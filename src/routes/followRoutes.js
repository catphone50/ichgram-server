import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getMutualFollowers,
} from "../controllers/followController.js";

const router = express.Router();

router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
router.get("/mutualFollowers/:userId", getMutualFollowers);

export default router;
