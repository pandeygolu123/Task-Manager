"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }


    const refreshUser = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener("userUpdated", refreshUser);

    return () => window.removeEventListener("userUpdated", refreshUser);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userUpdated"));
    router.push("/Login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="logo">TaskManager</Link>

        <div className="menu">
          <Link href="/">Home</Link>
          <Link href="/Tasks">Tasks</Link>
          <Link href="/Dashboard">Dashboard</Link>
          <Link href="/Calendar">Calendar</Link>
          <Link href="/About">About</Link>

          {user ? (
            <button onClick={handleLogout} className="btn logout">
              Logout
            </button>
          ) : (
            <>
              <Link href="/Login"><span className="btn login">Login</span></Link>
              <Link href="/Signup"><span className="btn signup">Signup</span></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
