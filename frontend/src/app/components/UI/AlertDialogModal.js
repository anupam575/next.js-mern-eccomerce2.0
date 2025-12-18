"use client";

import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

export const AlertDialogModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  message, // ✅ new prop for dynamic message
  confirmText = "Delete", // ✅ default Delete
  iconColor = "red" // optional
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{ borderRadius: "0.75rem", p: 2 }}
      >
        <DialogTitle className="flex items-center gap-2">
          <WarningRoundedIcon className={`text-${iconColor}-600`} />
          Confirmation
        </DialogTitle>

        <Divider />

        <DialogContent className="text-gray-800">
          {message || "Are you sure you want to delete this order?"}
        </DialogContent>

        <DialogActions className="flex gap-2">
          <Button
            variant="solid"
            color={confirmText === "Delete" ? "danger" : "primary"}
            onClick={onConfirm}
            className={confirmText === "Delete" ? "bg-red-500 text-white hover:bg-red-700" : "bg-blue-500 text-white hover:bg-blue-700"}
          >
            {confirmText}
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={onClose}
            className="text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};
