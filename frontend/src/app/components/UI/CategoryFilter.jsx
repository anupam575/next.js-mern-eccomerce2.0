"use client";

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import API from "../../../utils/axiosInstance";

const CategoryFilter = ({
  categories,
  setCategories,
  selectedCategory,
  setSelectedCategory,
}) => {
  // ✅ FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories");
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Category load failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        Category
      </Typography>

      <Stack spacing={1} mb={4}>
        {/* ✅ ALL OPTION */}
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedCategory === ""}
              onChange={() => setSelectedCategory("")}
            />
          }
          label="All"
        />

        {/* ✅ DYNAMIC CATEGORIES */}
        {categories.map((cat) => (
          <FormControlLabel
            key={cat._id}
            control={
              <Checkbox
                checked={selectedCategory === cat._id}
                onChange={() => setSelectedCategory(cat._id)}
              />
            }
            label={cat.name}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default CategoryFilter;
