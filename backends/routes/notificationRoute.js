import express from "express";
import notificationController from "../controllers/notificationController.js";

const {
  addNotification,
  getUserNotifications,
  deleteNotification,
  clearUserNotifications,
  markAsRead,
} = notificationController;

const router = express.Router();

router.post("/add", addNotification);
router.get("/user/:userId", getUserNotifications);
router.put("/mark-read/:notificationId", markAsRead);
router.delete("/delete/:notificationId", deleteNotification);
router.delete("/clear/:userId", clearUserNotifications);

export default router;
