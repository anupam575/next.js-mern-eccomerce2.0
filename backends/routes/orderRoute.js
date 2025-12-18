import express from "express";
import {
  getSingleOrder,
  newOrder,
  myOrders,
  getAllOrders,
  updateOrder,
    deleteOrders, // ✅ updated

} from "../controllers/orderController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/orders")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)   // multiple orders update
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrders); // multiple orders delete (agar body mein IDs bheji jaaye)

export default router;