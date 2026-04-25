"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser, logoutUser } from "@/services/auth";
import { createPost } from "@/services/database";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ FIXED

  useEffect(() => {
    (async () => {
      try {
        const userData = await getCurrentUser();
        if (userData?.success) {
          setUser(userData.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      setError("Post cannot be empty");
      return;
    }

    if (!user) return;

    setPosting(true);
    setError("");
    setSuccess("");

    try {
      const result = await createPost(
        user.id,
        user.email,
        user.name,
        content
      );

      if (result?.success) {
        setContent("");
        setShowForm(false);

        setSuccess("✅ You posted successfully!");

        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result?.error || "Failed to create post");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <p>Loading...</p>
      </div>
    );
  }

  const isLoggedIn = !!user;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Hawaasummaa</h1>
        <p style={styles.subtitle}>Connect • Share • Post</p>

        {isLoggedIn ? (
          <div style={styles.section}>
            <div style={styles.userBox}>
              <div style={styles.avatar}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={styles.name}>{user?.name}</p>
                <p style={styles.email}>{user?.email}</p>
              </div>
            </div>

            <div style={styles.actions}>
              <button
                onClick={() => setShowForm((prev) => !prev)}
                style={styles.secondaryBtn}
              >
                ✍️ Create Post
              </button>

              <Link href="/posts" style={styles.secondaryBtn}>
                👤 My Posts
              </Link>
            </div>

            {showForm && (
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  style={styles.textarea}
                />

                <button
                  onClick={handleCreatePost}
                  disabled={posting}
                  style={{
                    ...styles.primaryBtn,
                    marginTop: "10px",
                    opacity: posting ? 0.6 : 1,
                  }}
                >
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
            )}

            {/* ✅ Messages (correct place) */}
            {success && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {success}
              </p>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={handleLogout} style={styles.dangerBtn}>
              Logout
            </button>
          </div>
        ) : (
          <div style={styles.section}>
            <p style={styles.text}>You are not logged in</p>

            <Link href="/login" style={styles.primaryBtn}>
              Login
            </Link>

            <Link href="/register" style={styles.secondaryBtn}>
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6fb",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#666",
  },
  subtitle: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "20px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "10px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  name: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "14px",
  },
  email: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  text: {
    color: "#666",
    fontSize: "13px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginTop: "10px",
  },
  primaryBtn: {
    display: "block",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  },
  secondaryBtn: {
    display: "block",
    padding: "10px",
    background: "#e5e7eb",
    color: "#111",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  },
  dangerBtn: {
    padding: "10px",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};