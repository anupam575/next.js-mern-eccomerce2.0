"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/order/${id}`);
      setOrder(res.data.order || null);
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Failed to load order details";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  if (loading)
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
        <Typography className="ml-2">⏳ Loading order details...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Typography color="error">{error}</Typography>
      </Box>
    );

  if (!order)
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Typography>No order found.</Typography>
      </Box>
    );

  const SectionCard = ({ title, children }) => (
    <Card className="mb-6 shadow-lg">
      <CardContent>
        <Typography variant="h6" className="mb-3 font-semibold text-gray-700">
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box className="p-4 max-w-5xl mx-auto">
      <Typography variant="h4" className="mb-8 font-bold text-center text-gray-800">
        Order Details
      </Typography>

      {/* Shipping Info */}
      <SectionCard title="Shipping Info">
        <Typography className="mb-1">
          <strong>Address:</strong>{" "}
          {`${order.shippingInfo?.address}, ${order.shippingInfo?.city}, ${order.shippingInfo?.state}, ${order.shippingInfo?.country} - ${order.shippingInfo?.pinCode}`}
        </Typography>
        <Typography>
          <strong>Phone:</strong> {order.shippingInfo?.phoneNo}
        </Typography>
      </SectionCard>

      {/* User Info */}
      <SectionCard title="User Info">
        <Typography className="mb-1"><strong>Name:</strong> {order.user?.name}</Typography>
        <Typography><strong>Email:</strong> {order.user?.email}</Typography>
      </SectionCard>

      {/* Order Items */}
      {order.orderItems?.length > 0 && (
        <SectionCard title="Order Items">
          {/* Desktop Table */}
          <Box className="hidden md:block">
            <TableContainer component={Paper} className="shadow rounded-lg">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{currencyFormatter.format(item.price)}</TableCell>
                      <TableCell>{currencyFormatter.format(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Cards */}
          <Box className="md:hidden flex flex-col gap-4">
            {order.orderItems.map((item, idx) => (
              <Card key={idx} className="shadow-md p-4">
                <Typography><strong>Product:</strong> {item.name}</Typography>
                <Typography><strong>Qty:</strong> {item.quantity}</Typography>
                <Typography><strong>Price:</strong> {currencyFormatter.format(item.price)}</Typography>
                <Typography><strong>Subtotal:</strong> {currencyFormatter.format(item.price * item.quantity)}</Typography>
              </Card>
            ))}
          </Box>
        </SectionCard>
      )}

      {/* Payment Info */}
      <SectionCard title="Payment Info">
        <Typography className="mb-1"><strong>Status:</strong> {order.paymentInfo?.status || "N/A"}</Typography>
        <Typography><strong>Paid At:</strong> {order.paidAt ? new Date(order.paidAt).toLocaleString() : "N/A"}</Typography>
      </SectionCard>

      {/* Price Summary */}
      <SectionCard title="Price Summary">
        <Typography className="mb-1"><strong>Items:</strong> {currencyFormatter.format(order.itemsPrice)}</Typography>
        <Typography className="mb-1"><strong>Tax:</strong> {currencyFormatter.format(order.taxPrice)}</Typography>
        <Typography className="mb-1"><strong>Shipping:</strong> {currencyFormatter.format(order.shippingPrice)}</Typography>
        <Typography><strong>Total:</strong> {currencyFormatter.format(order.totalPrice)}</Typography>
      </SectionCard>

      {/* Order Status */}
      <SectionCard title="Order Status">
        <Typography className="mb-1"><strong>Status:</strong> {order.orderStatus}</Typography>
        {order.orderStatus === "Delivered" && order.deliveredAt && (
          <Typography><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</Typography>
        )}
        {order.orderStatus === "Soon" && order.soonAt && (
          <Typography><strong>Soon At:</strong> {new Date(order.soonAt).toLocaleString()}</Typography>
        )}
        {order.orderStatus === "Cancelled" && order.cancelledAt && (
          <Typography><strong>Cancelled At:</strong> {new Date(order.cancelledAt).toLocaleString()}</Typography>
        )}
      </SectionCard>
    </Box>
  );
};

export default OrderDetailPage;
