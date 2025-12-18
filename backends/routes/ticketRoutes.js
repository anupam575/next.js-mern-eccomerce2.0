import express from "express";
import {
  userReply,
  adminReply,
  userViewTicket,
  createTicket,
  adminSearchFilter,
  closeTicket
} from "../controllers/ticketController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

/* ===== USER ===== */
// Public ticket creation (no login required)
router.post("/user/create", createTicket);

// User reply (JWT required)
router.post("/user/reply/:ticketId", isAuthenticatedUser, userReply);

// User dashboard – view full conversation (JWT required)
router.get("/user/ticket/:ticketId", isAuthenticatedUser, userViewTicket);

/* ===== ADMIN ===== */
// Admin reply to user
router.post(
  "/admin/reply/:ticketId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  adminReply
);

// Admin search & filter with pagination
router.get(
  "/admin/search",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  adminSearchFilter
);

// Admin close ticket
router.patch(
  "/admin/close/:ticketId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  closeTicket
);

export default router;
