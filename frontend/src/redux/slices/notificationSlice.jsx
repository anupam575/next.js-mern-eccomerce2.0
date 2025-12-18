import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/utils/axiosInstance";

// 🔹 FETCH NOTIFICATIONS
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("🔹 fetchNotifications API call for userId:", userId);
      const res = await API.get(`/user/${userId}`);
      console.log("📄 fetchNotifications API response:", res.data.notifications);

      // Normalize notifications (support both id and _id)
      const notifications = res.data.notifications.map((n) => ({
        ...n,
        _id: String(n._id || n.id || ""),   // fallback to id
        userId: String(n.userId || n.id || ""), // fallback to id
        orderId: n.orderId ? String(n.orderId) : "",
        productId: n.productId ? String(n.productId) : "",
        read: n.read || false,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      }));

      return notifications;
    } catch (err) {
      console.error("❌ fetchNotifications API error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 ADD LOCAL SOCKET NOTIFICATION
export const addLocalNotification = createAsyncThunk(
  "notifications/addLocal",
  async (notification, { rejectWithValue }) => {
    try {
      console.log("🔔 Adding local socket notification:", notification);

      // Normalize notification
      const normalized = {
        ...notification,
        _id: String(notification._id || notification.id || ""),
        userId: String(notification.userId || notification.id || ""),
        orderId: notification.orderId ? String(notification.orderId) : "",
        productId: notification.productId ? String(notification.productId) : "",
        read: notification.read || false,
        createdAt: new Date(notification.createdAt),
        updatedAt: new Date(notification.updatedAt),
      };

      return normalized;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 DELETE SINGLE
export const deleteNotificationAPI = createAsyncThunk(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 CLEAR ALL
export const clearAllNotificationsAPI = createAsyncThunk(
  "notifications/clear",
  async (userId, { rejectWithValue }) => {
    try {
      await API.delete(`/clear/${userId}`);
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 MARK AS READ
export const markReadAPI = createAsyncThunk(
  "notifications/markRead",
  async (id, { rejectWithValue }) => {
    try {
      await API.put(`/mark-read/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        console.log("📡 fetchNotifications pending...");
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        console.log("✅ fetchNotifications fulfilled:", action.payload);

        state.list = action.payload.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ fetchNotifications rejected:", action.payload);
      })

      // DELETE SINGLE
      .addCase(deleteNotificationAPI.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n._id !== action.payload);
        console.log("🗑️ Notification deleted:", action.payload);
      })

      // CLEAR ALL
      .addCase(clearAllNotificationsAPI.fulfilled, (state) => {
        state.list = [];
        console.log("🧹 All notifications cleared");
      })

      // MARK READ
      .addCase(markReadAPI.fulfilled, (state, action) => {
        const notif = state.list.find((n) => n._id === action.payload);
        if (notif) notif.read = true;
        console.log("✅ Notification marked read:", action.payload);
      })

      // ADD LOCAL SOCKET
      .addCase(addLocalNotification.fulfilled, (state, action) => {
        const n = action.payload;
        state.list = [n, ...state.list.filter((notif) => notif._id !== n._id)];
        console.log("📥 Socket notification added to state:", n);
      });
  },
});

export default notificationSlice.reducer;
