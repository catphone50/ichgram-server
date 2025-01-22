import express from "express";
import { markNotificationsAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/markAsRead", markNotificationsAsRead);

export default router;
