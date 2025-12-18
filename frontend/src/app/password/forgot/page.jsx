"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "@/utils/axiosInstance";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const router = useRouter();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const token = loggedInUser?.token;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Call your backend API
      const { data } = await API.post("/password/forgot", { email });

      toast.success(data.message || "Reset link sent successfully!");

      // ✅ If backend returns a token directly (optional)
      if (data.resetToken) {
        router.push(`/password/reset/${data.resetToken}`);
      } else {
        toast.info("📧 Please check your email for the password reset link.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error(error.response?.data?.message || "❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={forgotPasswordHandler}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="forgot-input"
        />

        <button
          type="submit"
          disabled={loading}
          className="forgot-btn"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
