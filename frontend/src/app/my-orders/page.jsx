"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import API from "../../utils/axiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { format } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/orders/me");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(
        "❌ Failed to fetch orders:",
        err.response?.data?.message || err.message
      );
      setError("Failed to fetch your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Desktop Table Rows
  const desktopRows = useMemo(
    () =>
      orders.map((order) => (
        <TableRow key={order._id}>
          <TableCell>{order._id}</TableCell>
          <TableCell>{format(new Date(order.createdAt), "dd/MM/yyyy")}</TableCell>
          <TableCell>{currencyFormatter.format(order.totalPrice)}</TableCell>
          <TableCell>{order.paymentInfo?.status || "N/A"}</TableCell>
          <TableCell>
            <Button
              component={Link}
              href={`/my-orders/${order._id}`}
              variant="contained"
              size="small"
              color="primary"
            >
              View
            </Button>
          </TableCell>
        </TableRow>
      )),
    [orders]
  );

  // ✅ Mobile Cards
  const mobileCards = useMemo(
    () =>
      orders.map((order) => (
        <Card key={order._id} className="mb-4 shadow-lg rounded-xl">
          <CardContent className="flex flex-col space-y-2">
            <Typography variant="body1">
              <strong>Order ID:</strong> {order._id}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {format(new Date(order.createdAt), "dd/MM/yyyy")}
            </Typography>
            <Typography variant="body2">
              <strong>Total:</strong> {currencyFormatter.format(order.totalPrice)}
            </Typography>
            <Typography variant="body2">
              <strong>Payment Status:</strong> {order.paymentInfo?.status || "N/A"}
            </Typography>
            <Button
              component={Link}
              href={`/my-orders/${order._id}`}
              variant="contained"
              size="small"
              color="primary"
              className="mt-2"
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      )),
    [orders]
  );

  if (loading)
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
        <Typography className="ml-2">Loading your orders...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box className="flex flex-col justify-center items-center min-h-screen">
        <Typography className="text-red-600 mb-2">{error}</Typography>
        <Button variant="outlined" onClick={fetchOrders}>
          Retry
        </Button>
      </Box>
    );

  if (orders.length === 0)
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Typography>No orders found.</Typography>
      </Box>
    );

  return (
    <Box className="p-4">
      <Typography variant="h5" className="mb-4 font-semibold text-center">
        My Orders
      </Typography>

      {/* Desktop Table */}
      <Box className="hidden md:block">
        <TableContainer component={Paper} className="shadow-lg rounded-xl">
          <Table aria-label="List of My Orders">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{desktopRows}</TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Mobile Cards */}
      <Box className="md:hidden mt-4">{mobileCards}</Box>
    </Box>
  );
};

export default MyOrdersPage;