import Order from "../models/orderModel.js";
import mongoose from "mongoose"; // ES6 import
import Notification from "../models/notificationModel.js";
import sendNotification from "../utils/sendNotification.js";

import Product from "../models/productModel.js";

import { calcOrderPrices } from "../utils/calcOrderPrices.js";


export const newOrder = async (req, res) => {
  try {
    const { shippingInfo, orderItems, paymentInfo } = req.body;

    // 🛑 Validate items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items found",
      });
    }

    // ✅ Calculate prices (backend safe)
    const { itemsPrice, taxPrice, shippingFee, totalPrice } =
      calcOrderPrices(orderItems, 0.18);

    // 🛑 Prevent duplicate orders
    const existingOrder = await Order.findOne({
      "paymentInfo.id": paymentInfo.id,
      user: req.user._id,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists with this payment ID.",
        order: existingOrder,
      });
    }

    // ✅ Create new order
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice: shippingFee,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    // 🔔 Notify user
    const io = req.app.get("io");
    const productNames = orderItems.map((item) => item.name).join(", ");

    await sendNotification({
      io,
      userId: req.user._id,
      type: "order",
      title: "Order Placed Successfully",
      message: `Your order has been placed for: ${productNames}`,
      orderId: order._id,
    });

    // ✅ Final response
    res.status(201).json({ success: true, order });

  } catch (error) {
    console.error("❌ Order Creation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { newOrder };



export const getSingleOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid Order ID" });
    }

    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found with this Id" });

    // Optional: restrict to owner/admin
    if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get Single Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};





export const updateOrder = async (req, res, next) => {
  try {
    const { orderIds, status: newStatus } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No orders provided" });
    }

    const io = req.app.get("io");
    const updatedOrders = [];
    const notifications = [];

    for (const orderId of orderIds) {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        console.warn("⚠️ Invalid Order ID:", orderId);
        continue;
      }

      // 🔹 Fetch order with user & products populated
      const order = await Order.findById(orderId)
        .populate("user")
        .populate({
          path: "orderItems",
          populate: { path: "product" },
        });

      if (!order) {
        console.warn("⚠️ Order not found:", orderId);
        continue;
      }

      console.log(`🔹 Updating order ${order._id} to status "${newStatus}"`);

      // 🔹 Update stock for each product
      for (const item of order.orderItems) {
        if (!item.product) continue;

        if (["Shipped", "Delivered"].includes(newStatus)) {
          await updateStock(item.product._id, item.quantity, "decrease");
        } else if (newStatus === "Cancelled") {
          await updateStock(item.product._id, item.quantity, "increase");
        }
      }

      // 🔹 Update order status fields
      order.orderStatus = newStatus;
      if (newStatus === "Delivered") order.deliveredAt = Date.now();
      if (newStatus === "Cancelled") order.cancelledAt = Date.now();
      if (newStatus === "Soon") order.soonAt = Date.now();

      await order.save({ validateBeforeSave: false });
      updatedOrders.push(order);

      // ✅ ✅ UNIVERSAL AMAZON-STYLE SINGLE NOTIFICATION
      const productNames = order.orderItems
        .map((item) => item.product?.name)
        .filter(Boolean);

      if (productNames.length > 0) {
        const notif = await sendNotification({
          io,
          userId: order.user._id,
          type: "order",
          title: `Order #${order._id.toString().slice(-6)}`,
          message: `Order status updated to "${newStatus}" for: ${productNames.join(
            ", "
          )}`,
          orderId: order._id,
        });

        notifications.push(notif);
      }
    }

    // 🔌 Emit orderUpdated event for frontend
    if (io && updatedOrders.length > 0) {
      io.emit(
        "orderUpdated",
        updatedOrders.map((o) => ({
          orderId: o._id,
          status: o.orderStatus,
        }))
      );
    }

    res.status(200).json({
      success: true,
      message: `${updatedOrders.length} orders updated successfully`,
      updatedOrders,
      notifications,
    });
  } catch (error) {
    console.error("❌ Update Multiple Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export async function updateStock(productId, quantity, operation = "decrease") {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");
  if (operation === "decrease") product.stock -= quantity;
  if (operation === "increase") product.stock += quantity;
  if (product.stock < 0) product.stock = 0;
  await product.save({ validateBeforeSave: false });
}



export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price stock")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(200).json({
      success: true,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      totalAmount,
      orders: orders.map((order) => ({
        _id: order._id,
        user: order.user,
        orderItems: order.orderItems.map((item) => ({
          product: item.product?._id || null,
          name: item.product?.name || "Deleted Product",
          price: item.product?.price || 0,
          quantity: item.quantity,
          currentStock: item.product?.stock ?? 0,
        })),
        shippingInfo: order.shippingInfo,
        paymentInfo: order.paymentInfo,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const deleteOrders = async (req, res) => {
  try {
    let { orderIds } = req.body;

    // ✅ Single ID ko bhi array bana do
    if (typeof orderIds === "string") {
      orderIds = [orderIds];
    }

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order IDs provided",
      });
    }

    // ✅ Sirf valid MongoDB ObjectIds allow karo
    const validIds = orderIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid order IDs found",
      });
    }

    // ✅ FAST BULK DELETE (No Loop)
    const result = await Order.deleteMany({
      _id: { $in: validIds },
    });

    res.status(200).json({
      success: true,
      message: "Orders deleted successfully",
      deletedCount: result.deletedCount,
      deletedOrders: validIds,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

