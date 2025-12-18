"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import api from "../../utils/axiosInstance";
import {
  setFetchedUser,
  clearUser,
  setLoading,
} from "../../redux/slices/authSlice";

/**
 * ProtectedRoute Component
 * Ensures that only authenticated users with allowed roles
 * can access wrapped components.
 *
 * ✅ Handles:
 *  - User fetching
 *  - Role-based authorization
 *  - Redirects unauthenticated/unauthorized users
 *  - Prevents unnecessary remounts
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true; // prevent setState on unmounted component

    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await api.get("/me");
        if (isMounted) {
          dispatch(setFetchedUser(data.user));
        }
      } catch (err) {
        if (isMounted) {
          dispatch(clearUser());
        }
      } finally {
        if (isMounted) {
          dispatch(setLoading(false));
          setCheckingAuth(false);
        }
      }
    };

    // Only fetch if user not available & not logged out manually
    if (!user && typeof window !== "undefined" && !localStorage.getItem("loggedOut")) {
      fetchUser();
    } else {
      setCheckingAuth(false);
    }

    // cleanup to prevent memory leak
    return () => {
      isMounted = false;
    };
  }, [dispatch, user]);

  // ⏳ Still verifying authentication
  if (authLoading || checkingAuth) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          fontWeight: "bold",
          color: "#666",
        }}
      >
        ⏳ Checking authorization...
      </div>
    );
  }

  // 🚫 User not logged in
  if (!user) {
    router.replace("/login");
    return null;
  }

  // ⚠️ Role not allowed
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    router.replace("/unauthorized");
    return null;
  }

  // ✅ Authorized user → render child components
  return <>{children}</>;
};

export default ProtectedRoute;
