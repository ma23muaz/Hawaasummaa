'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/services/auth";
import { logoutUser } from "@/services/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // password match check
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // password length check
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const result = await registerUser(email, password, name);

    if (result.success) {
      setSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setError(result.error || "Email already exists. Please login.");
    }

    setLoading(false);
  };

  // success UI
  if (success) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 style={{ color: "green" }}>Registration Successful ✅</h2>
        <p>Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register New User</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "300px", margin: "auto" }}>
        
        <label>Name:</label><br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        /><br /><br />

        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        /><br /><br />

        <label>Password:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        /><br /><br />

        <label>Confirm Password:</label><br />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={inputStyle}
        /><br /><br />

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {/* ✅ Already have account */}
        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "green", fontWeight: "bold" }}>
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

// styles
const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "2px solid #044408fd",
  borderRadius: "6px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};