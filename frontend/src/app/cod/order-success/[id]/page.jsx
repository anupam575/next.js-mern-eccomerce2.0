"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// MUI Components
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

// MUI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const OrderSuccessPage = () => {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      router.push("/");
    }
  }, [id, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">

      {/* ✅ TOP SUCCESS STEPPER */}
      <Box className="w-full max-w-3xl mb-12">
        <ol className="flex items-center justify-between text-sm sm:text-base font-medium">
          {/* STEP 1 */}
          <li className="flex flex-col items-center text-green-600 relative">
            <CheckCircleIcon fontSize="large" />
            <span className="mt-1">Personal Info</span>
            <div className="absolute top-1/2 right-[-50%] w-[100%] h-0.5 bg-gray-300 z-0 hidden sm:block"></div>
          </li>
          {/* STEP 2 */}
          <li className="flex flex-col items-center text-green-600 relative">
            <CheckCircleIcon fontSize="large" />
            <span className="mt-1">Shipping</span>
            <div className="absolute top-1/2 right-[-50%] w-[100%] h-0.5 bg-gray-300 z-0 hidden sm:block"></div>
          </li>
          {/* STEP 3 */}
          <li className="flex flex-col items-center text-green-600 relative">
            <RadioButtonCheckedIcon fontSize="large" />
            <span className="mt-1 font-semibold">Confirmation</span>
          </li>
        </ol>
      </Box>

      {/* ✅ ORDER SUCCESS CARD */}
      <Card className="max-w-lg w-full shadow-3xl rounded-3xl hover:shadow-4xl transition-shadow duration-300">
        <CardContent className="flex flex-col items-center text-center gap-6 p-10">

          {/* SUCCESS ICON */}
          <CheckCircleIcon
            className="text-green-600 animate-bounce"
            sx={{ fontSize: 80 }}
          />

          {/* SUCCESS MESSAGE */}
          <Typography variant="h4" className="font-bold">
            Order Placed Successfully!
          </Typography>

          {id ? (
            <>
              <Typography variant="body1" className="text-gray-700">
                Your order ID:{" "}
                <span className="font-semibold text-gray-900">{id}</span>
              </Typography>

              {/* VIEW ORDER DETAILS BUTTON */}
              <Button
                variant="contained"
                className="w-full rounded-2xl py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white text-lg font-medium transition-all duration-300"
                onClick={() => router.push(`/my-orders/${id}`)}
              >
                View Order Details
              </Button>
            </>
          ) : (
            <Typography className="text-red-600">
              Order ID not found. Redirecting...
            </Typography>
          )}

          {/* BACK TO HOME BUTTON */}
          <Button
            variant="outlined"
            color="secondary"
            className="w-full rounded-2xl py-3 text-lg font-medium"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccessPage;
