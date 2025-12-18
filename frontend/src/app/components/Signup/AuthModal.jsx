"use client";

import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";

import {
  Modal,
  Box,
  IconButton,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const AuthModal = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState("login");

  // Escape to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  return (
    <Modal open={true} onClose={closeModal}>
      <Box
        className="
          absolute top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2 
          w-full max-w-md 
          bg-white shadow-xl rounded-2xl p-6 relative mt-20
        "
      >
        {/* Close Button */}
        <IconButton
          onClick={closeModal}
          className="absolute top-2 right-2"
        >
          <CloseIcon />
        </IconButton>

        {/* Tabs */}
        <Tabs
          value={activeTab === "login" ? 0 : 1}
          onChange={(e, val) => setActiveTab(val === 0 ? "login" : "register")}
          centered
          className="mb-4"
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {/* Content */}
        <Paper elevation={0} className="p-2">
          {activeTab === "login" ? <Login /> : <Register />}
        </Paper>
      </Box>
    </Modal>
  );
};

export default AuthModal;
