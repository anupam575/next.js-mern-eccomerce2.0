"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import { AppButton } from "../../components/UI/Button";
import SelectBasic from "../UI/Select";
import { AlertDialogModal } from "../../components/UI/AlertDialogModal";

// Status options
const statusOptions = [
  "Processing",
  "Shipped",
  "Soon",
  "Delivered",
  "Cancelled",
];

const OrderStatusUpdater = ({
  orderId,          // single id
  orderIds = [],     // multiple ids
  currentStatus,
  onStatusChange,
}) => {
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isMultiple = orderIds.length > 0; // 🔥 detect multiple update mode

  useEffect(() => {
    // Only for single order
    if (!isMultiple) setStatus(currentStatus || "");
  }, [currentStatus]);

  // OPEN UPDATE MODAL
  const handleUpdateClick = () => {
    if (!status) return;

    if (!isMultiple && ["Delivered", "Cancelled"].includes(currentStatus)) {
      return;
    }

    setShowModal(true);
  };

  // CONFIRM UPDATE
  const confirmUpdate = async () => {
    setLoading(true);

    try {
      const idsToUpdate = isMultiple ? orderIds : [orderId];

      await API.put("/admin/orders", {
        orderIds: idsToUpdate,
        status,
      });

      toast.success(
        isMultiple
          ? `Selected ${orderIds.length} orders updated to "${status}"`
          : `Order updated to "${status}"`
      );

      onStatusChange && onStatusChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const isDisabled =
    loading ||
    (!isMultiple && status === currentStatus) ||
    (!isMultiple && ["Delivered", "Cancelled"].includes(currentStatus));

  const disableDropdown =
    !isMultiple && ["Delivered", "Cancelled"].includes(currentStatus);

  return (
    <div className="flex items-center gap-2">

      {/* ====== STATUS DROP DOWN ====== */}
      <SelectBasic
        value={status}
        onChange={setStatus}
        options={statusOptions}
        disabled={disableDropdown}
        className="min-w-[120px]"
      />

      {/* ====== UPDATE BUTTON ====== */}
      <AppButton
        variant="contained"
        color="primary"
        onClick={handleUpdateClick}
        disabled={isDisabled}
      >
        {loading ? "Updating..." : "Update"}
      </AppButton>

      {/* ====== CONFIRMATION MODAL ====== */}
      <AlertDialogModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmUpdate}
        message={
          isMultiple
            ? `Are you sure you want to update ${orderIds.length} selected orders to "${status}"?`
            : `Are you sure you want to change status from "${currentStatus}" to "${status}"?`
        }
        confirmText="Update"
      />
    </div>
  );
};

export default OrderStatusUpdater;
