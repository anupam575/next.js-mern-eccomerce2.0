"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/utils/axiosInstance";
import "./resetPassword.css";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = useParams(); // 👈 captures dynamic part from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.put(`/password/reset/${token}`, {
        password,
        confirmPassword,
      });

      toast.success("🎉 Password reset successful!");
      router.push("/login"); // Redirect to login page
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={resetPasswordHandler}>
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
