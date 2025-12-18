"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

import { AppButton } from "../../components/UI/Button";
import { AlertDialogModal } from "../../components/UI/AlertDialogModal";

// MUI Icons
import InventoryIcon from "@mui/icons-material/Inventory";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AdminProductsPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [error, setError] = useState("");

  // ✅ Fetch All Products
  const fetchAdminProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/products");
      setProducts(data.products || []);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load products";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  // ✅ Delete Product
  const confirmDelete = async () => {
    if (!deleteProductId) return;

    const original = [...products];
    setProducts((prev) => prev.filter((p) => p._id !== deleteProductId));

    try {
      await API.delete(`/admin/product/${deleteProductId}`);
      toast.success("Product deleted successfully");
    } catch (err) {
      setProducts(original);
      toast.error("Failed to delete product");
    }

    setDeleteProductId(null);
  };

  // ✅ TABLE ROWS
  const tableRows = useMemo(
    () =>
      products.map((p) => (
        <tr
          key={p._id}
          className="bg-neutral-primary-soft border-b border-default"
        >
          <th className="px-6 py-4 font-medium text-heading whitespace-nowrap border-r border-default">
            {p._id}
          </th>

          <td className="px-6 py-4 border-r border-default">
            {p.name}
          </td>

          <td className="px-6 py-4 border-r border-default">
            ₹{p.price}
          </td>

          <td className="px-6 py-4 border-r border-default">
            {p.stock}
          </td>

          <td className="px-6 py-4 text-right border-r border-default">
            <Link
              href={`/admin/products/${p._id}/update`}
              className="rounded-full p-2 border border-gray-400 hover:bg-gray-100 inline-flex"
            >
              <EditIcon fontSize="small" />
            </Link>
          </td>

          <td className="px-6 py-4 text-right">
            <AppButton
              color="error"
              variant="outlined"
              className="rounded-full p-2 border border-red-400 text-red-500 hover:bg-red-50"
              onClick={() => setDeleteProductId(p._id)}
            >
              <DeleteIcon fontSize="small" />
            </AppButton>
          </td>
        </tr>
      )),
    [products]
  );

  return (
    <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default mt-10 bg-gray-900 text-white">

      {/* ✅ HEADER */}
      <div className="flex items-center gap-2 p-5 border-b border-default">
        <InventoryIcon />
        <h2 className="text-lg font-semibold bg-gray-900 text-white">Admin Products Panel</h2>
      </div>

      {loading ? (
        <p className="p-6 flex items-center gap-2 text-gray-600">
          <AccessTimeIcon fontSize="small" /> Loading products...
        </p>
      ) : error ? (
        <p className="p-6 text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="p-6 text-gray-500">No products found.</p>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-body border-collapse bg-gray-900 text-white
">

          {/* ✅ CAPTION */}
          <caption className="p-5 text-lg font-medium text-left rtl:text-right text-heading">
            Our Products
            <p className="mt-1.5 text-sm font-normal text-body">
              Browse all admin products, manage stock, edit and delete items.
            </p>
          </caption>

          {/* ✅ THEAD */}
          <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-t border-default-medium bg-amber-400">
            <tr>
              <th className="px-6 py-3 font-medium border-r border-default">
                Product ID
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Name
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Price
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Stock
              </th>
                            <th className="px-6 py-3 font-medium border-r border-default">
                Edit
              </th>
                            <th className="px-6 py-3 font-medium border-r border-default">
                Delete
              </th>


            </tr>
          </thead>

          {/* ✅ TBODY */}
          <tbody>{tableRows}</tbody>
        </table>
      )}

      {/* ✅ DELETE CONFIRMATION */}
      <AlertDialogModal
        open={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminProductsPanel;
