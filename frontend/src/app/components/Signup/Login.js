"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import { TextField, CircularProgress } from "@mui/material";
import { AppButton } from "../../components/UI/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputFields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("All fields are required!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format!");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }
    return true;
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await API.post("/login", formData);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("✅ Logged in successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md  mt-[-120px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

        <form onSubmit={loginHandler} className="space-y-4">
          {inputFields.map((field) => (
            <div key={field.name}>
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
                        aria-label="Toggle password visibility"
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

          <AppButton
            type="submit"
            variant="contained"
            fullWidth
            className="mt-4"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </AppButton>

          <p
            className="text-sm text-blue-600 mt-2 cursor-pointer hover:underline"
            onClick={() => router.push("/password/forgot")}
          >
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
}
