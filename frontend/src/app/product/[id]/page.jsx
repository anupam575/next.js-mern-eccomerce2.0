"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  Star as StarIcon,
  ErrorOutline,
  CheckCircle,
  Cancel,
  ShoppingCart,
} from "@mui/icons-material";
import { Box, Stack, Typography, Button, Chip, Rating } from "@mui/material";

import { fetchProduct, clearProduct } from "../../../redux/slices/productSlice";
import { addCartItem } from "../../../redux/slices/cartSlice";
import ReviewSection from "../../components/Section/Reviewsection";
import ImageZoom from "../../components/Header/ImageZoom";

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id;

  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);

  const [mainImage, setMainImage] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [numOfReviews, setNumOfReviews] = useState(0);

  // ✅ ✅ ✅ STABLE CALLBACK (FIXED)
  const handleUpdateSummary = useCallback((avg, total) => {
    setRatingValue(avg);
    setNumOfReviews(total);
  }, []);

  // ✅ Fetch product details
  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id))
        .unwrap()
        .then((data) => {
          setMainImage(data.mainImage || "/placeholder.png");
          setRatingValue(data.ratings || 0);
          setNumOfReviews(data.numOfReviews || 0);
        })
        .catch((err) => toast.error(err || "Failed to fetch product"));
    }

    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await dispatch(
        addCartItem({ productId: product._id, quantity: 1 })
      ).unwrap();
      toast.success("Product added to cart!");
    } catch (err) {
      toast.error(err.message || "Failed to add product to cart");
    }
  };

  if (loading)
    return <Typography className="text-center mt-10">Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Product not found.</Typography>;

  return (
    <Box className="p-6">
      {/* ✅ Product Images + Info */}
      <Box className="md:flex md:gap-8">
        {/* ✅ Left: Images */}
        <Box className="md:w-1/2">
          {mainImage && <ImageZoom src={mainImage} />}
          <Stack direction="row" spacing={2} className="mt-4 overflow-x-auto">
            {product.thumbnails?.length > 0 ? (
              product.thumbnails.map((url, idx) => (
                <img
                  key={idx}
                  src={url || "/placeholder.png"}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    mainImage === url ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(url)}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              ))
            ) : (
              <img
                src="/placeholder.png"
                alt="No image available"
                className="w-20 h-20 object-cover"
              />
            )}
          </Stack>
        </Box>

        {/* ✅ Right: Product Info */}
        <Box className="md:w-1/2 mt-6 md:mt-0 flex flex-col gap-4">
          <Typography variant="h5" fontWeight="bold">
            {product.name || "No Name"}
          </Typography>

          <Typography variant="body1" color="textSecondary">
            {product.description || "No Description Available"}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating value={ratingValue} precision={0.1} readOnly size="small" />
            <Typography variant="body2">({numOfReviews} reviews)</Typography>
          </Stack>

          <Typography variant="h6" color="primary">
            ₹{product.price ?? 0}
          </Typography>

          <Chip
            label={product.category?.name || "Uncategorized"}
            color="info"
            size="small"
          />

          {/* ✅ Stock Status */}
          {product.inStock ? (
            product.lowStock ? (
              <Chip
                icon={<ErrorOutline />}
                label={`Only ${product.stock} left!`}
                color="warning"
                variant="outlined"
                size="small"
              />
            ) : (
              <Chip
                icon={<CheckCircle />}
                label="In Stock"
                color="success"
                size="small"
              />
            )
          ) : (
            <Chip
              icon={<Cancel />}
              label="Out of Stock"
              color="error"
              size="small"
            />
          )}

          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="mt-2"
          >
            {product.inStock ? "Add to Cart" : "Unavailable"}
          </Button>
        </Box>
      </Box>

      {/* ✅ ✅ ✅ Review Section (FULLY FIXED) */}
      <Box className="mt-12 w-full">
        <ReviewSection
          initialReviews={product.reviews || []}
          initialRating={product.ratings || 0}
          initialTotal={product.numOfReviews || 0}
          onUpdateSummary={handleUpdateSummary}   // ✅ FIXED HERE
        />
      </Box>
    </Box>
  );
};

export default ProductDetails;
