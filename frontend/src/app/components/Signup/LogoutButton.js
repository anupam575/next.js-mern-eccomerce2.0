"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import { clearUser, setLoading } from "../../../redux/slices/authSlice";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));

      await API.post("/logout");

      dispatch(clearUser());
      localStorage.removeItem("user");

      toast.success("✅ Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("❌ Logout error:", error.response?.data || error.message);
      toast.error("Logout failed, please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleLogout}
      className="px-8 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
