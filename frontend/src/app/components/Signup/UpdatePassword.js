"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import { TextField, Button, CircularProgress, Typography, Box } from "@mui/material";

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      await API.put(
        "/password/update",
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );

      toast.success("✅ Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error updating password");
    } finally {
      setLoading(false);
    }
  };

  // Array to dynamically render password fields
  const passwordFields = [
    { label: "Old Password", value: oldPassword, setter: setOldPassword },
    { label: "New Password", value: newPassword, setter: setNewPassword },
    { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword },
  ];

  return (
    <Box className="min-h-screen flex justify-center items-start bg-gray-50 py-10 px-4">
      <Box
        component="form"
        onSubmit={handleUpdate}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4"
      >
        <Typography variant="h5" className="text-gray-800 font-bold text-center">
          Update Password
        </Typography>

        {/* Dynamically render password fields with proper spacing */}
        {passwordFields.map((field) => (
          <TextField
            key={field.label}
            type="password"
            label={field.label}
            fullWidth
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            required
            margin="normal" // Material-UI margin for vertical spacing
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-2"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
        </Button>
      </Box>
    </Box>
  );
}
