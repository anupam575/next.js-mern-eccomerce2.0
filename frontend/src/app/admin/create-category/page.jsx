"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

// MUI Imports
import { Box, Button, TextField, Typography } from "@mui/material";

const CreateCategory = () => {
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      toast.warn("⚠️ Please enter a category name!");
      return;
    }

    setLoading(true);
    try {
      await API.post("/admin/category/new", {
        name: newCategory,
      });

      toast.success("✅ Category created successfully!");
      setNewCategory("");

      // optional redirect
      // router.push("/admin/category");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Box className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h5" className="text-center font-bold mb-6">
          Create Category
        </Typography>

        <div className="space-y-5">
          <TextField
            fullWidth
            label="Category Name"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            disabled={loading}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleAdd}
            disabled={loading}
            className="!py-3 !text-base"
          >
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default CreateCategory;
