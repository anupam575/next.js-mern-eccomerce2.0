"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance";

// ✅ MUI
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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

const steps = ["Personal Info", "Shipping", "Payment"];

// ============================
// ✅ CHECKOUT FORM
// ============================
const CheckoutForm = ({ orderSummary, clientSecret, setClientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const cartItems = useSelector((state) => state.cart.items) || [];
  const shippingInfo =
    useSelector((state) => state.shipping.shippingInfo) || {};

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setPaymentError("");

    try {
      const card = elements.getElement(CardNumberElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        toast.error(result.error.message);
        setPaymentError(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
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
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          },
          ...orderSummary, // ✅ backend-calculated prices
        };

        const { data } = await API.post("/order/new", orderData);

        toast.success("Payment successful & order placed");
        router.push(`/payment/order-success/${data.order._id}`);
      }
    } catch {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {loading && (
        <div className="flex items-center gap-3">
          <CircularProgress size={20} />
          <Typography>Processing...</Typography>
        </div>
      )}

      <div className="p-4 border rounded-lg">
        <Typography variant="subtitle2">Card Number</Typography>
        <CardNumberElement />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <Typography variant="subtitle2">Expiry</Typography>
          <CardExpiryElement />
        </div>

        <div className="p-4 border rounded-lg">
          <Typography variant="subtitle2">CVC</Typography>
          <CardCvcElement />
        </div>
      </div>

      {paymentError && <Typography color="error">{paymentError}</Typography>}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={!stripe || loading}
      >
        Pay ₹{orderSummary?.totalPrice || 0}
      </Button>
    </form>
  );
};

// ============================
// ✅ PAYMENT PAGE (AMAZON STYLE)
// ============================
const PaymentPage = () => {
  const cartItems = useSelector((state) => state.cart.items) || [];
  const [orderSummary, setOrderSummary] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cartItems.length) return;

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const { data } = await API.post("/payment/process", {
          items: cartItems.map((item) => ({
            price: item.product?.price,
            quantity: item.quantity,
          })),
          shippingFee:
            cartItems.reduce(
              (acc, item) => acc + item.product?.price * item.quantity,
              0
            ) > 500
              ? 0
              : 50,
        });

        setClientSecret(data.client_secret);
        setOrderSummary(data.orderSummary); // ✅ BACKEND DATA
      } catch {
        toast.error("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [cartItems]);

  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardContent>
              <CheckoutForm
                orderSummary={orderSummary}
                clientSecret={clientSecret}
                setClientSecret={setClientSecret}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">Order Summary</Typography>

              <Divider className="my-3" />

              <Row label="Items" value={orderSummary?.itemsPrice} />
              <Row label="Tax" value={orderSummary?.taxPrice} />
              <Row label="Shipping" value={orderSummary?.shippingFee} />

              <Divider className="my-2" />

              <Row label="Total" value={orderSummary?.totalPrice} bold />
            </CardContent>
          </Card>
        </div>

        {loading && <CircularProgress />}
      </div>
    </Elements>
  );
};

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between ${bold ? "font-bold" : ""}`}>
    <span>{label}</span>
    <span>₹{value || 0}</span>
  </div>
);

export default PaymentPage;
