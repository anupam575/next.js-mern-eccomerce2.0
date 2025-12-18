"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";
import { AppButton } from "../../components/UI/Button";
import { AlertDialogModal } from "../../components/UI/AlertDialogModal";

// MUI Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteCatId, setDeleteCatId] = useState(null);
  const router = useRouter();

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/categories");
      setCategories(res.data.categories || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async () => {
    if (!deleteCatId) return;
    const original = [...categories];
    setCategories((prev) => prev.filter((c) => c._id !== deleteCatId));
    setDeleteCatId(null);

    try {
      await API.delete(`/admin/category/${deleteCatId}`);
    } catch (err) {
      setCategories(original); // rollback
      setError(err.response?.data?.message || err.message);
    }
  };

  // Desktop table rows
  const desktopRows = useMemo(
    () =>
      categories.map((cat) => (
        <tr
          key={cat._id}
          className="border-t border-gray-300 hover:bg-gray-50 transition"
        >
          <td className="px-4 py-3 border-r border-gray-300">{cat.name}</td>

          <td className="px-4 py-3 text-center border-r border-gray-300">
            <AppButton
              variant="outlined"
              className="rounded-full p-2 border border-gray-400 hover:bg-gray-100"
              onClick={() => router.push(`/admin/category/${cat._id}/edit`)}
            >
              <EditIcon fontSize="small" />
            </AppButton>
          </td>

          <td className="px-4 py-3 text-center">
            <AppButton
              color="error"
              variant="outlined"
              className="rounded-full p-2 border border-red-400 text-red-500 hover:bg-red-50"
              onClick={() => setDeleteCatId(cat._id)}
            >
              <DeleteIcon fontSize="small" />
            </AppButton>
          </td>
        </tr>
      )),
    [categories]
  );

  // Mobile cards
  const mobileCards = useMemo(
    () =>
      categories.map((cat) => (
        <div
          key={cat._id}
          className="category-card border border-gray-300 p-4 rounded-xl shadow-sm bg-white"
        >
          <h3 className="text-lg font-semibold">{cat.name}</h3>
          <div className="flex gap-3 mt-3">
            <AppButton
              variant="outlined"
              className="rounded-full p-2 border border-gray-400 hover:bg-gray-100"
              onClick={() => router.push(`/admin/category/${cat._id}/edit`)}
            >
              <EditIcon fontSize="small" />
            </AppButton>
            <AppButton
              color="error"
              variant="outlined"
              className="rounded-full p-2 border border-red-400 text-red-500 hover:bg-red-50"
              onClick={() => setDeleteCatId(cat._id)}
            >
              <DeleteIcon fontSize="small" />
            </AppButton>
          </div>
        </div>
      )),
    [categories]
  );

  return (
    <div className="admin-category-container p-4 mt-10">
      <div className="flex items-center gap-2 mb-6">
        <CategoryIcon fontSize="medium" />
        <h2 className="text-xl font-semibold">Category Management</h2>
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-gray-600">
          <AccessTimeIcon fontSize="small" /> Loading categories...
        </p>
      )}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {categories.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="desktop-users overflow-x-auto mt-4 hidden md:block">
            <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 border-r font-semibold text-left">Category Name</th>
                  <th className="px-4 py-3 border-r text-center font-semibold">Edit</th>
                  <th className="px-4 py-3 text-center font-semibold">Delete</th>
                </tr>
              </thead>
              <tbody>{desktopRows}</tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-users grid grid-cols-1 gap-4 mt-4 md:hidden">
            {mobileCards}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No categories found.</p>
      )}

      {/* Delete confirmation modal */}
      <AlertDialogModal
        open={!!deleteCatId}
        onClose={() => setDeleteCatId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CategoryList;
