"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaUserPlus, FaShoppingCart, FaClipboard, FaEllipsisV  } from "react-icons/fa";
import SearchBar from "../Header/SearchBar";
import Dropdown from "../Section/Dropdown"
import "./Header.css";

const Header = () => {
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
    <header className="main-header">
      <Link href="/" className="header-logo-link">
        <img
          src="/logo.png"
          alt="Logo"
          width={120}
          height={50}
          className="header-logo"
        />
      </Link>

      <SearchBar />

      <div className="header-right">
        {isAuthenticated && user?.avatar ? (
          <Link href="/me" className="header-item">
            <img
              src={user.avatar}
              alt={user.name || "avatar"}
              className="header-avatar"
              width={40}
              height={40}
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
          </Link>
        ) : null}

        <Link href="/auth" className="signup-link" aria-label="Login or Register">
          <FaUserPlus />
        </Link>

        <Link href="/cart" className="carpage" aria-label="View Cart">
          <FaShoppingCart />
        </Link>

        <Link href="/admin" className="header-item dashboard-link">
          <FaClipboard size={20} />
        </Link>
        <Dropdown/>
      </div>
    </header>
  );
};

export default Header;