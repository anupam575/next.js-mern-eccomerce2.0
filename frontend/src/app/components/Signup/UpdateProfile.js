"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

import { TextField, Button, CircularProgress, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", avatar: null });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      setFormData({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        avatar: null,
      });
      setPreview(loggedInUser.avatar || "");
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.warn("Only JPG/PNG images allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.warn("Photo must be < 10MB");
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = useCallback(async (file) => {
    try {
      const { signature, timestamp, folder, cloudName, apiKey } =
        await API.get("/get-signature").then((res) => res.data);

      const data = new FormData();
      data.append("file", file);
      data.append("api_key", apiKey);
      data.append("folder", folder);
      data.append("timestamp", timestamp);
      data.append("signature", signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: data }
      );

      const result = await res.json();
      if (!result.secure_url) throw new Error(result.error?.message || "Upload failed");
      return { url: result.secure_url, public_id: result.public_id };
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarData = null;
      if (formData.avatar) {
        avatarData = await uploadToCloudinary(formData.avatar);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        avatar: avatarData,
      };

      const { data } = await API.put("/me/update", payload);
      dispatch(setUser(data.user));
      toast.success("✅ Profile updated successfully!");
      setFormData({ ...formData, avatar: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Email", name: "email", type: "email" },
  ];

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-6"
      >
        <Typography variant="h5" className="text-center font-bold text-gray-800">
          Update Profile
        </Typography>

        {/* Dynamically render input fields with spacing */}
        <div className="flex flex-col">
          {inputFields.map((field, index) => (
            <TextField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              fullWidth
              value={formData[field.name]}
              onChange={handleChange}
              required
              margin="normal"   // Material-UI spacing
            />
          ))}
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            <CloudUploadIcon />
            <span>Upload Image</span>
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
          </label>

          {preview && (
            <div className="w-16 h-16 rounded-full overflow-hidden mt-2 md:mt-0">
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
        >
          {loading && <CircularProgress size={20} color="inherit" />}
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
