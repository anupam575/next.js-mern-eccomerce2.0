"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "@/utils/socket";
import { addLocalNotification } from "@/redux/slices/notificationSlice";

export default function SocketListener() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  // Support id / _id
  const userId = currentUser?.id || currentUser?._id;

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ No userId — skipping socket connection");
      return;
    }

    // Connect socket only if not connected
    if (!socket.connected) {
      console.log("🔌 Connecting socket…");
      socket.connect();
    }

    // JOIN ROOM
    const joinRoom = () => {
      console.log(`📨 Joining room: ${userId}`);
      socket.emit("join", userId);
    };

    // Join once connected
    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    // Normalize notification data
    const normalize = (data) => ({
      ...data,
      _id: String(data?._id?.$oid || data?._id || ""),
      userId: String(data?.userId?.$oid || data?.userId || userId),
      orderId: data?.orderId?.$oid || data?.orderId || "",
      productId: data?.productId?.$oid || data?.productId || "",
      read: Boolean(data?.read),

      createdAt: data?.createdAt?.$date?.$numberLong
        ? new Date(Number(data.createdAt.$date.$numberLong))
        : new Date(data.createdAt),

      updatedAt: data?.updatedAt?.$date?.$numberLong
        ? new Date(Number(data.updatedAt.$date.$numberLong))
        : new Date(data.updatedAt),
    });

    // Handle notification
    const handleNotification = (raw) => {
      if (!raw) return console.warn("⚠️ Empty notification received");
      const parsed = normalize(raw);
      dispatch(addLocalNotification(parsed));
    };

    // Add listeners
    socket.on("notification", handleNotification);
    socket.on("connect", () =>
      console.log("🟢 SOCKET CONNECTED:", socket.id)
    );
    socket.on("disconnect", (reason) =>
      console.warn("🔴 SOCKET DISCONNECTED:", reason)
    );

    // Debug (optional)
    socket.onAny((event, ...args) =>
      console.log(`⚡ Event: ${event}`, args)
    );

    // Cleanup
    return () => {
      console.log("♻️ Cleaning socket listeners");
      socket.off("notification", handleNotification);
      socket.off("connect");
      socket.off("disconnect");
      socket.offAny();
    };
  }, [userId, dispatch]);

  return null;
}
