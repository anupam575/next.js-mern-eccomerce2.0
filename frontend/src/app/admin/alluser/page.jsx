"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "@/utils/axiosInstance";
import { AppButton } from "../../components/UI/Button";
import { AlertDialogModal } from "../../components/UI/AlertDialogModal";
import SelectBasic from "../../components/UI/Select";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminUsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // ✅ Fetch All Users
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Single User
  const fetchSingleUser = async (id) => {
    try {
      const { data } = await API.get(`/admin/user/${id}`);
      setSelectedUser(data.user);
    } catch (err) {
      toast.error("Failed to fetch user details");
    }
  };

  // ✅ Update User Role
  const updateUserRole = async (id, role) => {
    const original = [...users];
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    try {
      await API.put(`/admin/user/${id}`, { role });
      toast.success("Role updated successfully");
    } catch (err) {
      setUsers(original);
      toast.error("Failed to update role");
    }
  };

  // ✅ Delete User
  const confirmDelete = async () => {
    if (!deleteUserId) return;

    const original = [...users];
    setUsers((prev) => prev.filter((u) => u._id !== deleteUserId));

    try {
      await API.delete(`/admin/user/${deleteUserId}`);
      toast.success("User deleted successfully");
    } catch (err) {
      setUsers(original);
      toast.error("Failed to delete user");
    }

    setDeleteUserId(null);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default bg-gray-400">
      {loading ? (
        <p className="p-6 text-gray-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="p-6 text-gray-600">No users found.</p>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-body border-collapse bg-gray-900 text-white">
          {/* ✅ Caption */}
          <caption
            className="p-5 text-lg font-medium text-left rtl:text-right text-heading bg-gray-900 text-white
"
          >
            Admin Users
            <p className="mt-1.5 text-sm font-normal text-body">
              Browse all users, update roles, view details and delete accounts.
            </p>
          </caption>

          {/* ✅ Thead WITH VERTICAL LINES */}
          <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-t border-default-medium bg-amber-400">
            <tr>
              <th className="px-6 py-3 font-medium border-r border-default">
                User ID
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Name
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Email
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Role
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                View
              </th>
              <th className="px-6 py-3 font-medium border-r border-default">
                Delete
              </th>

            </tr>
          </thead>

          {/* ✅ Tbody WITH VERTICAL LINES */}
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="bg-neutral-primary-soft border-b border-default"
              >
                <th className="px-6 py-4 font-medium text-heading whitespace-nowrap border-r border-default">
                  {u._id}
                </th>

                <td className="px-6 py-4 border-r border-default">{u.name}</td>

                <td className="px-6 py-4 border-r border-default">{u.email}</td>

                <td className="px-6 py-4 border-r border-default">
                  <SelectBasic
                    value={u.role}
                    onChange={(val) => updateUserRole(u._id, val)}
                    options={["user", "admin"]}
                  />
                </td>

                <td className="px-6 py-4 text-right border-r border-default">
                  <AppButton
                    variant="outlined"
                    className="rounded-full p-2 border border-gray-400 hover:bg-gray-100"
                    onClick={() => fetchSingleUser(u._id)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </AppButton>
                </td>

                <td className="px-6 py-4 text-right">
                  <AppButton
                    color="error"
                    variant="outlined"
                    className="rounded-full p-2 border border-red-400 text-red-500 hover:bg-red-50"
                    onClick={() => setDeleteUserId(u._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </AppButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ User Detail Card */}
      {selectedUser && (
        <div className="m-5 p-4 bg-neutral-secondary-soft rounded-base shadow-xs border border-default">
          <h3 className="text-lg font-semibold mb-2">User Details:</h3>
          <p>
            <strong>ID:</strong> {selectedUser._id}
          </p>
          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Role:</strong> {selectedUser.role}
          </p>
        </div>
      )}

      {/* ✅ Alert Dialog */}
      <AlertDialogModal
        open={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminUsersPanel;
