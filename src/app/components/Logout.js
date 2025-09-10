"use client";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = () => {

    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="btn logout"
      style={{
        marginLeft: "10px",
        padding: "8px 15px",
        background: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
