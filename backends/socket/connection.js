import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  console.log("🔌 Socket.IO Initialized");

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Join room
    socket.on("join", (userId) => {
      console.log(`📌 Join request for userId: ${userId}`);

      if (!userId) return console.warn("⚠️ userId missing in join");

      socket.join(userId);
      console.log(`✅ Joined room: ${userId}`);

      socket.emit("joined", { userId, socketId: socket.id });
    });

    // Disconnect
    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected: ${socket.id}. Reason: ${reason}`);
    });
  });

  return io;
};

export default initSocket;
