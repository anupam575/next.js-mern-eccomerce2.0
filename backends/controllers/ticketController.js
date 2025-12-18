import Ticket from "../models/Ticket.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const createTicket = async (req, res) => {
  try {
    const { userEmail, subject, message } = req.body;

    if (!userEmail || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const ticketId = "TKT-" + crypto.randomUUID().slice(0, 8).toUpperCase();

    const ticket = await Ticket.create({
      ticketId,
      userEmail,
      subject,
      messages: [{ sender: "user", message }],
      status: "Pending",
    });

    // ✅ Notify Admin/Support
    await sendEmail({
      email: process.env.SUPPORT_EMAIL,
      subject: `New Ticket Created: ${ticket.ticketId}`,
      message: `User ${userEmail} created a new ticket.\n\nSubject: ${subject}\nMessage: ${message}`,
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully & admin notified",
      ticketId: ticket.ticketId,
      ticket,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* ===========================
   USER REPLY (BLOCK IF CLOSED)
   =========================== */
export const userReply = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    if (ticket.status === "Closed") return res.status(403).json({ error: "This ticket is closed" });

    ticket.messages.push({ sender: "user", message });
    ticket.status = "Pending";
    await ticket.save();

    // ✅ Notify Admin/Support
    await sendEmail({
      email: process.env.SUPPORT_EMAIL,
      subject: `New Reply on Ticket ${ticket.ticketId}`,
      message: `User ${ticket.userEmail} replied to ticket ${ticket.ticketId}:\n\n${message}`,
    });

    return res.json({
      success: true,
      message: "User message sent & admin notified via email",
      ticket,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const userViewTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    return res.json({ success: true, ticket });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



export const adminReply = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    if (ticket.status === "Closed") return res.status(403).json({ error: "This ticket is closed" });

    ticket.messages.push({ sender: "admin", message });
    ticket.status = "Replied";
    await ticket.save();

    // ✅ Notify User
    await sendEmail({
      email: ticket.userEmail,
      subject: `Reply to Your Ticket ${ticket.ticketId}`,
      message: `Admin replied to your ticket:\n\n${message}`,
    });

    return res.json({
      success: true,
      message: "Admin reply sent & user notified via email",
      ticket,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



export const closeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.status = "Closed";
    await ticket.save();

    // ✅ Optional: Notify User ticket is closed
    await sendEmail({
      email: ticket.userEmail,
      subject: `Ticket ${ticket.ticketId} Closed`,
      message: `Your ticket ${ticket.ticketId} has been closed by admin.`,
    });

    return res.json({
      success: true,
      message: "Ticket closed successfully & user notified",
      ticket,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



export const adminSearchFilter = async (req, res) => {
  try {
    const { q, status, email, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (email) filter.userEmail = email;
    if (q) filter.$or = [
      { ticketId: { $regex: q, $options: "i" } },
      { subject: { $regex: q, $options: "i" } },
      { "messages.message": { $regex: q, $options: "i" } },
    ];

    const skip = (page - 1) * limit;

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Ticket.countDocuments(filter);

    return res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      tickets,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
