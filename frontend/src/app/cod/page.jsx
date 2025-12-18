"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import API from "@/utils/axiosInstance";
import { toast } from "react-toastify";

// MUI Components
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from "@mui/material";

// MUI Icons
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const steps = ["Personal Info", "Shipping", "Confirmation"];
const TAX_RATE = 0.18; // 18% GST

const CODPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const cartItems = useSelector((state) => state.cart.items) || [];
  const shippingInfo =
    useSelector((state) => state.shipping.shippingInfo) || {};

  // ✅ Frontend Order Summary (Amazon-style UX)
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.product?.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = +(itemsPrice * TAX_RATE).toFixed(2); // ✅ Tax calculation
  const totalPrice = +(itemsPrice + taxPrice + shippingPrice).toFixed(2);

  const handleCOD = async () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingInfo,
        orderItems: cartItems.map((item) => ({
          name: item.product?.name,
          quantity: item.quantity,
          image: item.product?.images?.[0]?.url,
          price: item.product?.price,
          product: item.product?._id,
        })),
        paymentInfo: {
          id: `COD_${Date.now()}`,
          status: "Cash on Delivery",
        },
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await API.post("/order/new", orderData);

      toast.success("Order placed successfully");
      router.push(`/cod/order-success/${data.order._id}`);
    } catch (error) {
      console.error("COD Error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 pt-12 pb-12">
      {/* ✅ TOP STEPPER */}
      <Box className="w-full max-w-4xl mb-10">
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((label) => (
            <Step key={label} completed={label !== "Confirmation"}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ✅ MAIN CONTAINER */}
      <div className="max-w-4xl w-full flex flex-col lg:flex-row gap-8">
        {/* COD ACTION CARD */}
        <Card className="flex-1 shadow-2xl rounded-3xl hover:shadow-3xl transition-shadow duration-300">
          <CardContent className="p-12 flex flex-col items-center text-center gap-6">
            <LocalShippingIcon className="text-blue-600" sx={{ fontSize: 70 }} />
            <Typography variant="h4" className="font-bold">
              Cash on Delivery
            </Typography>
            <Typography variant="body1" className="text-gray-600 max-w-md">
              Review your details carefully before placing your order. You will pay when your order arrives.
            </Typography>
            <Box className="w-full mt-6">
              <Button
                variant="contained"
                color="primary"
                onClick={handleCOD}
                disabled={loading}
                className="w-full rounded-2xl py-4 text-lg font-medium"
              >
                {loading ? (
                  <Box className="flex items-center justify-center gap-3">
                    <CircularProgress size={20} color="inherit" />
                    Placing Order...
                  </Box>
                ) : (
                  `Place Order (₹${totalPrice})`
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* ORDER SUMMARY CARD */}
        <Card className="flex-1 shadow-2xl rounded-3xl hover:shadow-3xl transition-shadow duration-300">
          <CardContent className="p-10">
            <Typography variant="h5" className="font-bold mb-6 text-center">
              Order Summary
            </Typography>

            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.product?._id}
                  className="flex justify-between items-center text-sm md:text-base"
                >
                  <span className="truncate">{item.product?.name} × {item.quantity}</span>
                  <span className="font-medium">₹{item.product?.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <Divider className="my-4" />

            {/* Price Breakdown */}
            <Row label="Items" value={itemsPrice} />
            <Row label="Tax (18%)" value={taxPrice} />
            <Row label="Shipping" value={shippingPrice} />

            <Divider className="my-4" />

            <Row label="Total" value={totalPrice} bold large />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Row = ({ label, value, bold, large }) => (
  <div className={`flex justify-between ${bold ? "font-bold" : ""} ${large ? "text-xl" : ""} mb-2`}>
    <span>{label}</span>
    <span>₹{value || 0}</span>
  </div>
);

export default CODPage;
