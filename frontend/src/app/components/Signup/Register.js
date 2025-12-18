"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import { TextField, CircularProgress } from "@mui/material";
import { AppButton } from "../../components/UI/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  avatar: null,
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.warn("Only JPG/PNG allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warn("File size must be < 10MB");
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  const isPasswordStrong = (pwd) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  const uploadToCloudinary = async (file) => {
    const { signature, timestamp, folder, cloudName, apiKey } = await API.get(
      "/get-signature"
    ).then((res) => res.data);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", apiKey);
    fd.append("folder", folder);
    fd.append("timestamp", timestamp);
    fd.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    return { url: data.secure_url, public_id: data.public_id };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, avatar } = formData;

    if (!name || !email || !password) {
      toast.warn("All fields are required");
      setLoading(false);
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.warn("Password must contain uppercase, lowercase, number & special character");
      setLoading(false);
      return;
    }

    try {
      let avatarData = null;
      if (avatar) avatarData = await uploadToCloudinary(avatar);

      const { data } = await API.post("/register", {
        name,
        email,
        password,
        avatar: avatarData,
      });

      toast.success(data.message || "Registration successful!");
      setFormData(initialFormData);
      setPreview(null);
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-10">
  <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md mt-[-100px]">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">
      Create an Account
    </h2>


        <form onSubmit={handleSubmit} className="space-y-4">

          {inputFields.map((field) => (
            <div key={field.name} className="relative">
              {field.type === "password" ? (
                <TextField
                  label={field.label}
                  type={showPassword ? "text" : "password"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <button
                        type="button"
                        onClick={handleTogglePassword}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </button>
                    ),
                  }}
                />
              ) : (
                <TextField
                  label={field.label}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              )}
            </div>
          ))}

          {/* Avatar Upload */}
          <label className="flex items-center gap-2 mt-2 cursor-pointer text-gray-700">
            <CloudUploadIcon />
            Upload Avatar (optional)
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover mt-2 border"
            />
          )}

          <AppButton
            type="submit"
            variant="contained"
            fullWidth
            className="mt-4"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </AppButton>
        </form>
      </div>
    </div>
  );
}
