// controllers/orderController.js
import mongoose from "mongoose";
import Order from "../models/Order.js";
import { updateStock } from "../utils/stock.js";

export const updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid Order ID" });
    }

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found with this Id" });

    const newStatus = req.body.status;

    if (order.orderStatus === "Delivered" || order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: `Order already ${order.orderStatus.toLowerCase()}`,
      });
    }

    // Update stock
    if (newStatus === "Shipped" || newStatus === "Delivered") {
      for (const item of order.orderItems) {
        await updateStock(item.product, item.quantity, "decrease");
      }
    }
    if (newStatus === "Cancelled") {
      for (const item of order.orderItems) {
        await updateStock(item.product, item.quantity, "increase");
      }
    }

    // Update order status
    order.orderStatus = newStatus;
    if (newStatus === "Delivered") order.deliveredAt = Date.now();
    if (newStatus === "Cancelled") order.cancelledAt = Date.now();
    if (newStatus === "Soon") order.soonAt = Date.now();

    await order.save({ validateBeforeSave: false });

    // 🔔 Emit real-time notification using Socket.IO
    const io = req.app.get("io");
    io.emit("orderUpdated", { orderId: order._id, status: newStatus });

    res.status(200).json({
      success: true,
      message: `Order ${newStatus.toLowerCase()} successfully`,
      order,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




















import http from "http";
import { Server } from "socket.io";
import app from "./app.js"; // aapka existing Express app

const startServer = async () => {
  try {
    // ✅ Database & Cloudinary etc.
    await connectDatabase();
    
    const PORT = process.env.PORT || 4000;
    
    // ✅ Create HTTP server from Express app
    const server = http.createServer(app);

    // ✅ Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      },
    });

    // ✅ Attach io to app so controllers can access it
    app.set("io", io);

    // ✅ Socket connection listener
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    // ✅ Start server
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err.message);
    process.exit(1);
  }
};

startServer();
