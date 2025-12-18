"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  addLocalNotification,
  deleteNotificationAPI,
  clearAllNotificationsAPI,
  markReadAPI,
} from "@/redux/slices/notificationSlice";

import {
  Notifications,
  LocalShipping,
  Warning,
  LocalOffer,
  Inventory2,
  Delete,
  ClearAll,
} from "@mui/icons-material";

import { Card, CardContent, IconButton, Typography, Box, Button } from "@mui/material";
import socket from "@/utils/socket";

function NotificationsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { list: notifications, loading, error } = useSelector(
    (s) => s.notifications
  );

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchNotifications(userId));
  }, [userId, dispatch]);

  useEffect(() => {
    if (!userId) return;
    if (!socket.connected) socket.connect();
    socket.emit("join", userId);

    const handleNotification = (n) => dispatch(addLocalNotification(n));
    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);
  }, [userId, dispatch]);

  const formatDate = (t) => new Date(t).toLocaleString();

  const getSection = (timestamp) => {
    const today = new Date();
    const date = new Date(timestamp);
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
      return "Today";

    const diff = (today - date) / (1000 * 60 * 60 * 24);
    if (diff <= 7) return "This Week";

    return "Earlier";
  };

  const icons = {
    order: <Inventory2 className="text-white" />,
    delivery: <LocalShipping className="text-white" />,
    alert: <Warning className="text-white" />,
    promo: <LocalOffer className="text-white" />,
    default: <Notifications className="text-white" />,
  };

  const colors = {
    order: "bg-blue-500",
    delivery: "bg-green-500",
    alert: "bg-red-500",
    promo: "bg-yellow-500",
    default: "bg-gray-500",
  };

  const grouped = { Today: [], "This Week": [], Earlier: [] };
  notifications.forEach((n) => grouped[getSection(n.createdAt)].push(n));

  const handleDelete = (id) => dispatch(deleteNotificationAPI(id));
  const handleClearAll = () => dispatch(clearAllNotificationsAPI(userId));
  const handleMarkRead = (id) => dispatch(markReadAPI(id));

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading notifications...</p>;
  if (!loading && notifications.length === 0)
    return <p className="text-center mt-10 text-gray-600">No notifications found.</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <Box className="p-6 max-w-4xl mx-auto">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold">Notifications</Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<ClearAll />}
          onClick={handleClearAll}
          disabled={notifications.length === 0}
          className="rounded-full px-4 py-2"
        >
          Clear All
        </Button>
      </Box>

      {["Today", "This Week", "Earlier"].map(
        (sec) =>
          grouped[sec].length > 0 && (
            <Box key={sec} className="mb-6">
              <Typography variant="h6" className="mb-2 font-semibold">{sec}</Typography>
              <Box className="flex flex-col gap-4">
                {grouped[sec].map((n) => (
                  <Card
                    key={n._id}
                    onClick={() => handleMarkRead(n._id)}
                    className={`flex items-center p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
                      n.read ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <Box className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${colors[n.type] || colors.default} mr-4`}>
                      {icons[n.type] || icons.default}
                    </Box>
                    <Box className="flex-1">
                      <Typography className="font-semibold">{n.type}</Typography>
                      <Typography>{n.message}</Typography>
                      <Typography variant="caption" className="text-gray-500">{formatDate(n.createdAt)}</Typography>
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n._id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Card>
                ))}
              </Box>
            </Box>
          )
      )}
    </Box>
  );
}

export default NotificationsPage;
