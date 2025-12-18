"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "@/utils/axiosInstance";
import { setFetchedUser, setError, setLoading } from "../../../redux/slices/authSlice";
import { Card, CardContent, CircularProgress, Typography, Avatar } from "@mui/material";

export default function GetUser() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const fetchUser = useCallback(async () => {
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      const { data } = await API.get("/me");
      if (data?.user) {
        dispatch(setFetchedUser(data.user));
        toast.success("✅ User data fetched successfully");
      } else {
        dispatch(setError("User data not found"));
        toast.error("❌ User data not found");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch user";
      dispatch(setError(message));
      toast.error(`❌ ${message}`);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const formatDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(
        new Date(dateString)
      );
    } catch {
      return "Date not available";
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 py-10">
      <div className="w-full max-w-md">
        <Typography variant="h5" className="mb-4 text-gray-800 font-bold">
          User Details
        </Typography>

        {loading && (
          <div className="flex justify-center my-6">
            <CircularProgress />
            <Typography className="ml-2">Loading user...</Typography>
          </div>
        )}

        {!loading && error && (
          <Typography color="error" className="text-center my-4">
            {error}
          </Typography>
        )}

        {!loading && user && (
          <Card className="shadow-md">
            <CardContent className="space-y-2">
              <Typography>
                <strong>Name:</strong> {user?.name || "N/A"}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user?.email || "N/A"}
              </Typography>

              <div className="flex justify-center my-2">
                {user?.avatar ? (
                  <Avatar
                    src={user.avatar}
                    alt={user?.name || "User Avatar"}
                    sx={{ width: 100, height: 100 }}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/100?text=No+Image")}
                  />
                ) : (
                  <Avatar sx={{ width: 100, height: 100 }}>N/A</Avatar>
                )}
              </div>

              <Typography>
                <strong>Role:</strong> {user?.role || "Role not available"}
              </Typography>
              <Typography>
                <strong>Joined:</strong> {user?.createdAt ? formatDate(user.createdAt) : "Date not available"}
              </Typography>
            </CardContent>
          </Card>
        )}

        {!loading && !user && !error && (
          <Typography className="text-center text-gray-500 mt-4">No user found</Typography>
        )}
      </div>
    </div>
  );
}
