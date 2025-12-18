"use client";

import { useState, useEffect } from "react";
import AuthModal from "../components/Signup/AuthModal";
import { Button, Box } from "@mui/material";

const AuthPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // पूरे page का background sky blue करना
  useEffect(() => {
    document.body.style.backgroundColor = "#87CEEB";
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  return (
    <Box className="min-h-screen flex justify-center items-center">
      <Button
        variant="contained"
        size="large"
        onClick={() => setIsModalOpen(true)}
        className="!bg-blue-600 !px-8 !py-3 !text-xl !rounded-lg shadow-md hover:!bg-blue-700"
      >
        Login / Register
      </Button>

      {isModalOpen && <AuthModal closeModal={() => setIsModalOpen(false)} />}
    </Box>
  );
};

export default AuthPage;
