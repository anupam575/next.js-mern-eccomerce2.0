"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import OrderStatusUpdater from "../../components/Section/OrderStatusUpdater";
import { AppButton } from "../../components/UI/Button";
import { AlertDialogModal } from "../../components/UI/AlertDialogModal";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Pagination
import UIPagination from "../../components/UI/UIPagination";

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  // Fetch Orders
  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await API.get(
        `/admin/orders?page=${pageNumber}&limit=10`
      );
      setOrders(data.orders);
      setTotalAmount(data.totalAmount);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Single Delete
  const confirmDelete = async () => {
    if (!deleteOrderId) return;

    const originalOrders = [...orders];
    setOrders((prev) => prev.filter((o) => o._id !== deleteOrderId));
    toast.info("Deleting...");

    try {
      await API.delete("/admin/orders", {
        data: { orderIds: [deleteOrderId] },
      });
      toast.success("Order deleted successfully");
      fetchOrders(page);
    } catch (err) {
      setOrders(originalOrders);
      toast.error("Failed to delete order");
    }

    setDeleteOrderId(null);
  };

  // Bulk Delete
  const confirmBulkDelete = async () => {
    if (selectedOrders.length === 0) return;

    const originalOrders = [...orders];
    setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o._id)));
    toast.info("Deleting selected orders...");

    try {
      await API.delete("/admin/orders", { data: { orderIds: selectedOrders } });
      toast.success("Selected orders deleted successfully");
      setSelectedOrders([]);
      fetchOrders(page);
    } catch (err) {
      setOrders(originalOrders);
      toast.error("Failed to delete selected orders");
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, []);

  // Handle select/deselect
  const toggleSelectOrder = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

  // Desktop Rows
  const desktopRows = useMemo(
    () =>
      orders.map((order) => (
        <tr
          key={order._id}
          className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
        >
          <td className="w-4 p-4 border-r border-default">
            <input
              type="checkbox"
              checked={selectedOrders.includes(order._id)}
              onChange={() => toggleSelectOrder(order._id)}
              className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
            />
          </td>
          <th className="px-6 py-4 font-medium text-heading whitespace-nowrap border-r border-default">
            {order._id}
          </th>
          <td className="px-6 py-4 border-r border-default">
            {order.user?.name}
          </td>
          <td className="px-6 py-4 border-r border-default">
            {order.user?.email}
          </td>
          <td className="px-6 py-4 font-semibold border-r border-default">
            ₹{order.totalPrice}
          </td>
          <td className="px-6 py-4 border-r border-default">
            {/* Single order status updater */}
            <OrderStatusUpdater
              orderId={order._id}
              currentStatus={order.orderStatus}
              onStatusChange={() => fetchOrders(page)}
            />
          </td>
          <td className="px-6 py-4 text-right border-r border-default">
            <AppButton
              variant="contained"
              onClick={() => router.push(`/admin/all-orders/${order._id}`)}
            >
              View
            </AppButton>
          </td>
          <td className="px-6 py-4 text-right">
            <AppButton
              variant="outlined"
              color="error"
              onClick={() => setDeleteOrderId(order._id)}
            >
              <DeleteIcon fontSize="small" /> Delete
            </AppButton>
          </td>
        </tr>
      )),
    [orders, selectedOrders, page]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto mt-10 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <InventoryIcon /> All Orders
      </h2>

      <p className="text-lg font-semibold mb-4">
        Total Revenue: ₹{totalAmount}
      </p>

      {/* Bulk Update + Bulk Delete */}
      {selectedOrders.length > 0 && (
        <div className="mb-4 flex items-center gap-4">
          <OrderStatusUpdater
            orderIds={selectedOrders}
            onStatusChange={() => fetchOrders(page)}
          />
          <AppButton
            variant="outlined"
            color="error"
            onClick={confirmBulkDelete}
          >
            <DeleteIcon /> Delete Selected ({selectedOrders.length})
          </AppButton>
        </div>
      )}

      {/* Orders Table */}
      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table className="w-full text-sm text-left rtl:text-right text-body border-collapse">
          <caption className="p-5 text-lg font-medium text-left rtl:text-right text-heading bg-gray-900 text-white">
            All Orders
            <p className="mt-1.5 text-sm font-normal text-body">
              Browse all customer orders, update status, view and delete orders.
            </p>
          </caption>

          <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-t border-default-medium bg-amber-300">
            <tr>
              <th className="px-6 py-3 font-medium border-r border-default">
                <input
                  type="checkbox"
                  checked={
                    selectedOrders.length === orders.length && orders.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                />
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Order ID
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                User
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Email
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Total
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Status
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                View
              </th>
              <th className="px-6 py-3 font-medium">Delete</th>
            </tr>
          </thead>

          <tbody>{desktopRows}</tbody>
        </table>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center mt-6 flex items-center justify-center gap-2">
          <AccessTimeIcon fontSize="small" /> Loading orders...
        </p>
      )}

      {/* Error */}
      {error && <p className="text-center text-red-600 mt-6">{error}</p>}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <UIPagination
          totalPages={totalPages}
          page={page}
          onChange={(event, value) => {
            setPage(value);
            fetchOrders(value);
          }}
        />
      </div>

      {/* Alert Dialog for single delete */}
      <AlertDialogModal
        open={!!deleteOrderId}
        onClose={() => setDeleteOrderId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
