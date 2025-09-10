"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user)); 

    
      window.dispatchEvent(new Event("userUpdated"));

      alert("Login successful ✅");
      router.push("/Dashboard"); 
    } else {
      const error = await res.json();
      alert(error.error || "Login failed ❌");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center",
      alignItems: "center", height: "100vh" }}>
      <div style={{
        background: "white", padding: "20px", borderRadius: "8px",
        width: "300px"
      }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            required style={inputStyle} />

          <input type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            required style={inputStyle} />

          <button type="submit" style={btnStyle}>Login</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  border: "1px solid #ccc",
  borderRadius: "5px"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};
