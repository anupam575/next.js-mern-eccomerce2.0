// models/Ticket.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "admin"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  userEmail: {
    type: String,
    required: true,
    index: true
  },

  subject: {
    type: String,
    required: true
  },

  messages: [MessageSchema],   // ✅ SINGLE USER THREAD + ADMIN HISTORY

  status: {
    type: String,
    enum: ["Pending", "Replied", "Closed"],
    default: "Pending",
    index: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
