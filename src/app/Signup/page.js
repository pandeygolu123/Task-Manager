"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee"); 
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, mobile, password, role }),
    });

    if (res.ok) {
      alert("Signup successful ✅ Redirecting to login...");
      setTimeout(() => router.push("/Login"), 1000);
    } else {
      const err = await res.json();
      alert("Signup failed ❌: " + err.error);
    }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", background: "#f4f4f4"
    }}>
      <div style={{
        background: "white", padding: "20px", borderRadius: "8px",
        width: "320px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name"
            value={name} onChange={(e) => setName(e.target.value)}
            required style={inputStyle} />

          <input type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            required style={inputStyle} />

          <input type="text" placeholder="Mobile Number"
            value={mobile} onChange={(e) => setMobile(e.target.value)}
            required style={inputStyle} />

          <input type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            required style={inputStyle} />

          <input type="password" placeholder="Confirm Password"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            required style={inputStyle} />

          {/* ✅ Role Dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>

          <button type="submit" style={btnStyle}>
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  border: "1px solid #ccc",
  borderRadius: "5px"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
  fontWeight: "bold"
};
