import API from "../utils/axiosInstance";

// 🔹 Fetch all reviews for a product
export const fetchReviews = (productId) =>
  API.get(`/reviews?id=${productId}`);

// 🔹 Fetch review stats for a product
export const fetchReviewStats = (productId) =>
  API.get(`/reviews/stats?productId=${productId}`);

// 🔹 Create or update a review (PUT /review)
export const submitReview = ({ rating, comment, productId }) =>
  API.put(`/review`, { rating, comment, productId });

// 🔹 Delete a review by productId & reviewId
export const deleteReviewById = ({ productId, reviewId }) =>
  API.delete(`/review?productId=${productId}&id=${reviewId}`);
