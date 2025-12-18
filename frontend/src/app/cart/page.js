"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearError,
} from "../../redux/slices/cartSlice";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Grid,
  Snackbar,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

const Cart = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items: cartItems, status, error } = useSelector((state) => state.cart);

  // Fetch cart
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Auto clear error
  useEffect(() => {
    if (status === "failed") {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, dispatch]);

  // Total price
  const totalPrice = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;

    return cartItems
      .reduce(
        (total, item) =>
          total +
          (Number(item?.product?.price) || 0) * (Number(item?.quantity) || 0),
        0
      )
      .toFixed(2);
  }, [cartItems]);

  const handleBuyNow = () => cartItems.length && router.push("/shipping");

  const handleIncrease = (id, quantity) =>
    dispatch(updateCartItem({ cartItemId: id, quantity: quantity + 1 }));

  const handleDecrease = (id, quantity) => {
    const newQty = quantity - 1;
    newQty <= 0
      ? dispatch(removeCartItem(id))
      : dispatch(updateCartItem({ cartItemId: id, quantity: newQty }));
  };

  const handleRemove = (id) => dispatch(removeCartItem(id));

  const errorMessage =
    typeof error === "string" ? error : error?.message || error?.error || "Something went wrong";

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50">
      <Typography variant="h3" className="font-bold mb-6 text-center md:text-left">
        Your Cart
      </Typography>

      <Snackbar open={status === "failed"} autoHideDuration={4000}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>

      {!cartItems || cartItems.length === 0 ? (
        <div className="flex flex-col items-center mt-20">
          <Typography variant="h5" className="text-gray-600 mb-4">
            Your cart is empty!
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/")}
            className="!bg-blue-600 !px-6 !py-2 !text-lg"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <Grid container spacing={4}>
          {/* ✅ CART ITEMS */}
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => {
              const product = item.product || {};
              const imageUrl = product.images?.[0]?.url || "/placeholder.png";
              const productName = product.name || "Unknown Product";
              const productPrice = Number(product.price) || 0;
              const quantity = Number(item.quantity) || 0;

              return (
                <Card
                  key={item._id}
                  className="mb-6 shadow-md border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow duration-300"
                >
                  <Grid container>
                    <Grid item xs={4} sm={3}>
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={productName}
                        className="w-full h-full p-3 object-contain bg-white"
                        style={{ height: "160px", objectFit: "contain" }}
                      />
                    </Grid>

                    <Grid item xs={8} sm={9}>
                      <CardContent className="flex flex-col justify-between h-full">
                        <div>
                          <Typography variant="h6" className="font-semibold">
                            {productName}
                          </Typography>
                          <Typography className="text-gray-600 mt-1">
                            ₹{productPrice.toFixed(2)}
                          </Typography>

                          <Box className="flex items-center gap-3 mt-3">
                            <IconButton onClick={() => handleDecrease(item._id, quantity)}>
                              <Remove />
                            </IconButton>

                            <Typography>{quantity}</Typography>

                            <IconButton onClick={() => handleIncrease(item._id, quantity)}>
                              <Add />
                            </IconButton>
                          </Box>

                          <Typography className="mt-2 font-medium">
                            Total: ₹{(productPrice * quantity).toFixed(2)}
                          </Typography>
                        </div>

                        <IconButton
                          color="error"
                          className="self-end mt-2"
                          onClick={() => handleRemove(item._id)}
                        >
                          <Delete />
                        </IconButton>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              );
            })}
          </Grid>

          {/* ✅ ORDER SUMMARY */}
          <Grid item xs={12} md={4}>
            <Card className="sticky top-24 shadow-lg border border-gray-200 p-6 rounded-2xl">
              <Typography variant="h6" className="font-semibold mb-4">
                Order Summary
              </Typography>

              <Divider className="mb-4" />

              <Box className="flex justify-between mb-2">
                <Typography>Items:</Typography>
                <Typography>₹{totalPrice}</Typography>
              </Box>

              <Box className="flex justify-between mb-2">
                <Typography>Shipping:</Typography>
                <Typography>₹{totalPrice > 500 ? 0 : 50}</Typography>
              </Box>

              <Divider className="my-4" />

              <Typography variant="h5" className="font-bold text-right">
                Total: ₹
                {(
                  Number(totalPrice) + (Number(totalPrice) > 500 ? 0 : 50)
                ).toFixed(2)}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                className="!mt-6 !bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white !py-3 text-lg font-medium rounded-2xl transition-all duration-300"
                onClick={handleBuyNow}
              >
                Proceed to Shipping
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Cart;
