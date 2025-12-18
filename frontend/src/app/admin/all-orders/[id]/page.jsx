"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../../utils/axiosInstance";
import { Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from "@mui/material";

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
      <Typography className="text-center text-red-600 mt-6">{error}</Typography>
    );

  if (!order)
    return <Typography className="text-center mt-6">No order found.</Typography>;

  const Section = ({ title, children }) => (
    <Card className="mb-6 shadow-lg">
      <CardContent>
        <Typography variant="h6" className="mb-2 font-semibold">
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box className="p-6 max-w-3xl mx-auto">
      <Typography variant="h4" className="mb-6 font-bold text-center">
        Order Details
      </Typography>

      {/* Shipping Info */}
      <Section title="Shipping Info">
        <Typography><strong>Address:</strong> {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state}, {order.shippingInfo?.country} - {order.shippingInfo?.pinCode}</Typography>
        <Typography><strong>Phone:</strong> {order.shippingInfo?.phoneNo}</Typography>
      </Section>

      {/* User Info */}
      <Section title="User Info">
        <Typography><strong>Name:</strong> {order.user?.name}</Typography>
        <Typography><strong>Email:</strong> {order.user?.email}</Typography>
      </Section>

      {/* Order Items */}
      {order.orderItems?.length > 0 && (
        <Section title="Order Items">
          <Table className="min-w-full border border-gray-300">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50">
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{currencyFormatter.format(item.price)}</TableCell>
                  <TableCell>{currencyFormatter.format(item.price * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      )}

      {/* Payment Info */}
      <Section title="Payment Info">
        <Typography><strong>Status:</strong> {order.paymentInfo?.status || "N/A"}</Typography>
        <Typography><strong>Paid At:</strong> {order.paidAt ? new Date(order.paidAt).toLocaleString() : "N/A"}</Typography>
      </Section>

      {/* Price Summary */}
      <Section title="Price Summary">
        <Typography><strong>Items:</strong> {currencyFormatter.format(order.itemsPrice)}</Typography>
        <Typography><strong>Tax:</strong> {currencyFormatter.format(order.taxPrice)}</Typography>
        <Typography><strong>Shipping:</strong> {currencyFormatter.format(order.shippingPrice)}</Typography>
        <Typography><strong>Total:</strong> {currencyFormatter.format(order.totalPrice)}</Typography>
      </Section>

      {/* Order Status */}
      <Section title="Order Status">
        <Typography><strong>Status:</strong> {order.orderStatus}</Typography>
        {order.orderStatus === "Delivered" && order.deliveredAt && (
          <Typography><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</Typography>
        )}
        {order.orderStatus === "Soon" && order.soonAt && (
          <Typography><strong>Soon At:</strong> {new Date(order.soonAt).toLocaleString()}</Typography>
        )}
        {order.orderStatus === "Cancelled" && order.cancelledAt && (
          <Typography><strong>Cancelled At:</strong> {new Date(order.cancelledAt).toLocaleString()}</Typography>
        )}
      </Section>
    </Box>
  );
};

export default OrderDetailPage;
