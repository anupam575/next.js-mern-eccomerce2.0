"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import API from "../../utils/axiosInstance";
import UIPagination from "../components/UI/UIPagination";
import SliderSizes from "../components/UI/Slider";
import { addCartItem } from "../../redux/slices/cartSlice";
import CategoryFilter from "../components/UI/CategoryFilter";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Rating,
  CircularProgress,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const Product = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [debouncedPriceRange] = useDebounce(priceRange, 300);

  const keyword = useSelector((state) => state?.search?.keyword) || "";
  const [debouncedKeyword] = useDebounce(keyword, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, debouncedPriceRange, selectedCategory]);

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addCartItem({ productId, quantity: 1 })).unwrap();
      toast.success("🛒 Product added to cart!");
    } catch (err) {
      toast.error(err.message || "Failed to add product to cart");
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      let query = `/products?page=${page}`;

      if (debouncedKeyword.trim()) {
        query += `&keyword=${debouncedKeyword.trim()}`;
      }

      if (selectedCategory) {
        query += `&categoryId=${selectedCategory}`;
      }

      query += `&price[gte]=${debouncedPriceRange[0]}&price[lte]=${debouncedPriceRange[1]}`;

      const { data } = await API.get(query);

      setProducts(data.products || []);
      const total = data.filteredProductsCount || 0;
      const perPage = data.resultPerPage || 1;

      setTotalPages(Math.ceil(total / perPage));
    } catch (err) {
      toast.error("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, debouncedPriceRange, page, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading)
    return (
      <Box className="flex justify-center items-center mt-16">
        <CircularProgress />
      </Box>
    );

  if (!products.length)
    return (
      <Box className="flex flex-col items-center mt-16">
        <Typography variant="h6">No products found 😔</Typography>
        <Button
          variant="contained"
          sx={{ mt: 4 }}
          onClick={() => router.push("/")}
        >
          Back to Shop
        </Button>
      </Box>
    );

  return (
    <Box className="p-6">
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={6}>
        <Typography variant="h4" fontWeight="bold">
          All Products <FilterAltIcon />
        </Typography>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} gap={6}>
        {/* SIDEBAR */}
        <Box className="md:w-1/4 bg-white p-5 rounded-xl shadow sticky top-20 h-fit">
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Filters
          </Typography>

          <CategoryFilter
            categories={categories}
            setCategories={setCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <Typography variant="subtitle1" mt={4} mb={1}>
            Price
          </Typography>
          <SliderSizes
            value={priceRange}
            onChange={(e, val) => setPriceRange(val)}
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Typography>₹{priceRange[0]}</Typography>
            <Typography>₹{priceRange[1]}</Typography>
          </Stack>
        </Box>

        {/* PRODUCT GRID */}
        <Box className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card
              key={p._id}
              className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <Box
                className="w-full h-100 cursor-pointer"
                onClick={() => router.push(`/product/${p._id}`)}
              >
                <img
                  src={p.images?.[0]?.url || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
              </Box>

              <CardContent className="flex flex-col flex-1 justify-between">
                <Box>
                  <Typography fontWeight="bold">{p.name}</Typography>
                  <Typography color="primary" mt={0.5}>
                    ₹{p.price}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1} alignItems="center">
                    <Rating value={p.ratings || 0} readOnly size="small" />
                    <Typography variant="body2">
                      ({p.numOfReviews || 0})
                    </Typography>
                  </Stack>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!p.inStock}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontWeight: "bold",
                    background: p.inStock
                      ? "linear-gradient(to right, #3b82f6, #6366f1)"
                      : "#9ca3af",
                    "&:hover": {
                      background: p.inStock
                        ? "linear-gradient(to right, #6366f1, #3b82f6)"
                        : "#9ca3af",
                    },
                  }}
                  onClick={() => handleAddToCart(p._id)}
                >
                  {p.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Stack>

      {/* PAGINATION */}
      <Stack mt={8} alignItems="center">
        <UIPagination
          totalPages={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Stack>
    </Box>
  );
};

export default Product;
