"use client";

import { useRouter } from "next/navigation";
import GetUser from "../components/Signup/GetUser";
import UpdatePassword from "../components/Signup/UpdatePassword";
import UpdateProfile from "../components/Signup/UpdateProfile";

function Profile() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "80px auto 20px", // 🟢 Top margin added
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <button
          onClick={handleBack}
          style={{
            backgroundColor: "#f0f0f0",
            border: "none",
            padding: "8px 12px",
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            marginTop: "15px",
            marginLeft: "-150px",
          }}
        >
          ⬅ Back
        </button>
      </div>

      {/* ✅ Components */}
      <GetUser />
      <UpdateProfile />
      <UpdatePassword />
    </div>
  );
}

export default Profile;
