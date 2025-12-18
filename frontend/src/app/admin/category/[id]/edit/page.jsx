"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../../../utils/axiosInstance";

// ✅ MUI Imports
import { Box, Button, TextField, Typography } from "@mui/material";

const UpdateCategory = () => {
  const { id } = useParams();
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch category by ID
  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const { data } = await API.get(`/category/${id}`);
        setCategoryName(data.category.name);
      } catch (err) {
        toast.error(err.response?.data?.message || "❌ Failed to load category");
      }
    };

    fetchCategory();
  }, [id]);

  // ✅ Update category
  const handleUpdate = async () => {
    if (!categoryName.trim()) {
      toast.warn("⚠️ Category name cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      await API.put(`/admin/category/${id}`, { name: categoryName });
      toast.success("✅ Category updated successfully!");
      router.push("/admin/category");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Box className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h5" className="text-center font-bold mb-6">
          Update Category
        </Typography>

        <div className="space-y-5">
          <TextField
            fullWidth
            label="Category Name"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            disabled={loading}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdate}
            disabled={loading}
            className="!py-3 !text-base"
          >
            {loading ? "Updating..." : "Update Category"}
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default UpdateCategory;
