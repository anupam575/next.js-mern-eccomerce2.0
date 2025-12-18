"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSelector } from "react-redux";
import LogoutButton from "../components/Signup/LogoutButton";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const formatRole = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1) : "Not assigned";

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  return parts.map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");
};

export default function MyProfile() {
  const { user, isAuthenticated } = useSelector(
    (state) => state?.auth ?? { user: null, isAuthenticated: false }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <Typography variant="h6" className="text-red-500 text-center mt-6">
        ⚠️ You are not logged in
      </Typography>
    );
  }

  return (
    <Box className="min-h-screen flex justify-center items-start p-6">
      <Card className="w-full max-w-md p-6 rounded-3xl shadow-xl border border-gray-200 bg-white">
        <CardContent>
          <Typography
            variant="h5"
            className="font-bold text-center mb-6 text-gray-800"
          >
            My Profile
          </Typography>

          {/* Avatar */}
          <Box className="flex justify-center my-6">
            {user?.avatar ? (
              <>
                <Avatar
                  src={user.avatar}
                  alt={user?.name || "User Avatar"}
                  className="w-80 h-40 cursor-pointer shadow-xl hover:scale-105 transition-transform duration-300"
                  onClick={() => setIsModalOpen(true)}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/150?text=${getInitials(
                      user?.name
                    )}`;
                  }}
                />

                {/* Full Image Modal */}
                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                  <Box className="absolute top-1/2 left-1/2 bg-white rounded-xl p-4 shadow-2xl transform -translate-x-1/2 -translate-y-1/2 max-w-sm">
                    <IconButton
                      className="absolute top-2 right-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <CloseIcon />
                    </IconButton>
                    <img
                      src={user.avatar}
                      alt="Full Avatar"
                      className="w-full h-auto rounded-lg"
                    />
                  </Box>
                </Modal>
              </>
            ) : (
              <Avatar className="w-40 h-40 bg-blue-600 text-white text-5xl shadow-xl">
                {getInitials(user?.name)}
              </Avatar>
            )}
          </Box>

          {/* User Info */}
          <Card className="mb-6 shadow-md rounded-2xl p-4 bg-gray-50">
            <CardContent className="space-y-3 text-gray-700">
              <Typography>
                <strong>Name:</strong> {user?.name || "N/A"}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user?.email || "N/A"}
              </Typography>
              <Typography>
                <strong>Role:</strong> {formatRole(user?.role)}
              </Typography>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Box className="mt-4 flex justify-center">
            <LogoutButton />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
