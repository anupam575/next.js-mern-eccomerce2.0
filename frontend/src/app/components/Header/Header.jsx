"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import { FaUserPlus, FaShoppingCart, FaClipboard } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import SearchBar from "./SearchBar";
import ThreeDotDropdown from  "../../components/Section/Dropdown";

export default function ButtonAppBar() {
  let user = null;
  let isAuthenticated = false;

  try {
    const state = useSelector((state) => state || {});
    const auth = state.auth || {};
    user = auth.user || null;
    isAuthenticated = !!user;
  } catch (err) {
    user = null;
    isAuthenticated = false;
  }

  return (
    <header className="sticky top-0 z-50 bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <div className="flex-shrink-0">
  <Link href="/" className="flex items-center">
    <img
      src="/logo.png"
      alt="Logo"
      className="h-60 w-auto object-contain transition-transform duration-200 hover:scale-105"
    />
  </Link>
</div>


          {/* SEARCH BAR */}
          <div className="flex-1 mx-4">
            <SearchBar />
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center space-x-4">

            {/* USER AVATAR (MUI COMPONENT) */}
            {isAuthenticated && user?.avatar && (
              <Link href="/me">
                <Avatar
                  src={user.avatar}
                  alt={user.name || "avatar"}
                  sx={{
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    border: "2px solid white",
                  }}
                  imgProps={{
                    onError: (e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    },
                  }}
                />
              </Link>
            )}

            {/* LOGIN ICON */}
            <Link
              href="/auth"
              className="text-white hover:text-gray-200"
              aria-label="Login or Register"
            >
              <FaUserPlus size={28} />
            </Link>

            {/* CART ICON */}
            <Link
              href="/cart"
              className="text-white hover:text-gray-200"
              aria-label="View Cart"
            >
              <FaShoppingCart size={28} />
            </Link>

            {/* ADMIN DASHBOARD */}
            <Link
              href="/admin"
              className="text-white hover:text-gray-200"
              aria-label="Admin Dashboard"
            >
              <FaClipboard size={28} />
            </Link>
                  <ThreeDotDropdown />


          </div>
        </div>
      </div>
    </header>
  );
}