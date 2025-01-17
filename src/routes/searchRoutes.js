import express from "express";
import { searchUsersWithPosts } from "../controllers/searchController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search", authMiddleware, searchUsersWithPosts);

export default router;
