"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchReviews,
  fetchReviewStats,
  submitReview,
  deleteReviewById,
} from "../../../utils/reviewApi";
import { AlertDialogModal } from "../../components/UI/AlertDialogModal";

import { Box, Stack, Typography, Button, Rating, LinearProgress } from "@mui/material";

const ReviewSection = ({
  initialReviews = [],
  initialRating = 0,
  initialTotal = 0,
  onUpdateSummary,
}) => {
  const user = useSelector((state) => state.auth.user);
  const product = useSelector((state) => state.product.product);
  const productId = product?._id;

  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [averageRating, setAverageRating] = useState(initialRating);
  const [totalReviews, setTotalReviews] = useState(initialTotal);
  const [breakdown, setBreakdown] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  const currentUserId = (user?._id || user?.id)?.toString();
  const currentUserRole = (user?.role || "").toLowerCase();

  const updateRatingSummary = useCallback(
    (reviewsList) => {
      if (!reviewsList) return;
      const total = reviewsList.length;
      const avg = total
        ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;
      const bd = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviewsList.forEach((r) => {
        bd[r.rating] = (bd[r.rating] || 0) + 1;
      });

      setAverageRating(avg);
      setTotalReviews(total);
      setBreakdown(bd);

      if (onUpdateSummary) onUpdateSummary(avg, total);
    },
    [onUpdateSummary]
  );

  const loadReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const { data } = await fetchReviews(productId);
      if (data?.success) {
        setReviews(data.reviews || []);
        updateRatingSummary(data.reviews || []);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId, updateRatingSummary]);

  const loadStats = useCallback(async () => {
    if (!productId) return;
    try {
      const { data } = await fetchReviewStats(productId);
      if (data?.success) {
        setAverageRating(data.average || 0);
        setTotalReviews(data.total || 0);
        setBreakdown(data.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
    } catch {
      console.error("Failed to load stats");
    }
  }, [productId]);

  const loadAllReviewData = useCallback(async () => {
    await Promise.all([loadReviews(), loadStats()]);
  }, [loadReviews, loadStats]);

  useEffect(() => {
    if (!productId) return;
    loadAllReviewData();
  }, [productId, loadAllReviewData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!rating || !comment.trim()) {
        toast.warn("Please provide rating & comment");
        return;
      }
      setLoading(true);
      try {
        const { data } = await submitReview({ productId, rating, comment });
        if (data?.success) {
          toast.success("Review submitted successfully");
          setRating(0);
          setComment("");
          await loadAllReviewData();
        }
      } catch {
        toast.error("Failed to submit review");
      } finally {
        setLoading(false);
      }
    },
    [productId, rating, comment, loadAllReviewData]
  );

  const handleDelete = useCallback(
    async () => {
      if (!reviewToDelete) return;
      setLoading(true);
      try {
        const { data } = await deleteReviewById({ productId, reviewId: reviewToDelete });
        if (data?.success) {
          toast.success("Review deleted successfully");
          await loadAllReviewData();
        }
      } catch {
        toast.error("Failed to delete review");
      } finally {
        setReviewToDelete(null);
        setShowConfirm(false);
        setLoading(false);
      }
    },
    [productId, reviewToDelete, loadAllReviewData]
  );

  if (!productId) return <Typography>Loading product info...</Typography>;

  return (
    <Box className="mt-10">
      <Typography variant="h5" className="mb-4">Customer Reviews</Typography>

      {/* Summary */}
      <Box className="mb-6 p-4 border rounded-md bg-gray-50">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Rating value={averageRating} precision={0.1} readOnly />
          <Typography>{averageRating.toFixed(1)} out of 5</Typography>
          <Typography>({totalReviews} reviews)</Typography>
        </Stack>
        <Stack spacing={1} mt={2}>
          {[5,4,3,2,1].map(star => (
            <Stack key={star} direction="row" alignItems="center" spacing={2}>
              <Typography>{star} star</Typography>
              <Box className="flex-1">
                <LinearProgress
                  variant="determinate"
                  value={(breakdown[star] || 0) * 100 / (totalReviews || 1)}
                />
              </Box>
              <Typography>{breakdown[star] || 0}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Submit Review Form */}
      {user ? (
        <Box component="form" onSubmit={handleSubmit} className="mb-6 p-4 border rounded-md bg-white">
          <Typography>Rating:</Typography>
          <Rating
            value={rating}
            onChange={(e, val) => setRating(val)}
          />
          <Typography>Comment:</Typography>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            required
            className="w-full mt-2 p-2 border rounded-md"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="mt-2"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </Box>
      ) : (
        <Typography>Please login to submit a review.</Typography>
      )}

      <hr className="my-4" />

      {/* Review List */}
      <Stack spacing={4}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} className="h-20 bg-gray-200 animate-pulse rounded-md" />
          ))
        ) : reviews.length === 0 ? (
          <Typography>No reviews yet.</Typography>
        ) : (
          reviews.map((rev) => {
            const revUserId = (rev.user?._id || rev.user?.id)?.toString();
            const canDelete = currentUserRole === "admin" || revUserId === currentUserId;

            return (
              <Box key={rev._id} className="p-4 border rounded-md bg-white">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight="bold">{rev.user?.name || "Anonymous"}</Typography>
                  <Rating value={rev.rating} readOnly size="small" />
                </Stack>
                <Typography className="mt-2">{rev.comment}</Typography>
                {canDelete && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      setReviewToDelete(rev._id);
                      setShowConfirm(true);
                    }}
                    className="mt-2"
                  >
                    Delete
                  </Button>
                )}
              </Box>
            );
          })
        )}
      </Stack>

      {/* ✅ AlertDialogModal compatible */}
      <AlertDialogModal
        open={showConfirm}
        message="Are you sure you want to delete this review?"
        onConfirm={handleDelete}
        onClose={() => setShowConfirm(false)}
        confirmText="Delete"
      />
    </Box>
  );
};

export default ReviewSection;