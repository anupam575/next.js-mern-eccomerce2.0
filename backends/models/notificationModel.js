import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    type: {
      type: String,
      enum: ["order", "delivery", "promo", "alert"],
      default: "alert",
    },
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    orderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order", 
      default: null 
    },
    productIds: [ // <-- array of ObjectIds
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product" 
      }
    ],
    read: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true } // ✅ createdAt & updatedAt automatically
);

// Prevent OverwriteModelError in development
const Notification =
  mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default Notification;
