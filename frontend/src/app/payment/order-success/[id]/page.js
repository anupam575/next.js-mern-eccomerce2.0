"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

// ✅ MUI
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from "@mui/material";

// ✅ MUI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = ["Personal Info", "Shipping", "Payment"];

const OrderSuccessPage = () => {
  const { id } = useParams();
  const router = useRouter();

  return (
    <Box className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-12">

      {/* ✅ TOP STEPPER */}
      <Box className="w-full max-w-4xl mb-12">
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ✅ SUCCESS CARD */}
      <Card className="max-w-2xl w-full shadow-3xl rounded-3xl hover:shadow-4xl transition-shadow duration-300">
        <CardContent className="flex flex-col items-center gap-6 text-center p-10">

          {/* ✅ SUCCESS ICON */}
          <CheckCircleIcon
            className="text-green-600 animate-bounce"
            sx={{ fontSize: 80 }}
          />

          {/* ✅ SUCCESS MESSAGE */}
          <Typography variant="h4" className="font-bold text-green-600">
            Order Placed Successfully!
          </Typography>

          <Typography variant="body1" className="text-gray-700 max-w-md">
            Thank you for your order. Your payment was successful, and your
            order is now being processed.
          </Typography>

          <Divider className="my-4 w-full max-w-sm" />

          {/* ✅ ORDER ID */}
          <Typography className="text-sm text-gray-500">
            Order ID: <span className="font-semibold text-gray-800">{id}</span>
          </Typography>

          {/* ✅ ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-sm">
            <Button
              variant="contained"
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white text-lg font-medium transition-all duration-300 rounded-2xl"
              onClick={() => router.push(`/my-orders/${id}`)}
            >
              View Order Details
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              className="flex-1 py-3 text-lg font-medium rounded-2xl"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderSuccessPage;
