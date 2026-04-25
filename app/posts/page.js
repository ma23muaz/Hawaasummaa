"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/auth";
import {
  createPost,
  getAllPosts,
  deletePost,
} from "@/services/database";

export default function PostsPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // ✅ success message
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const userData = await getCurrentUser();

      if (userData?.success) {
        setUser(userData.user);

        const postsResult = await getAllPosts();
        setPosts(postsResult.success ? postsResult.posts : []);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    setPosting(true);
    setMessage("");

    const result = await createPost(
      user.id,
      user.email,
      user.name,
      newPost
    );

    if (result.success) {
      setNewPost("");
      setMessage("✅ You posted successfully!");
      init();

      // auto-hide message
      setTimeout(() => setMessage(""), 3000);
    }

    setPosting(false);
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.$id !== id));
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📰 Social Feed</h1>

        {/* SUCCESS MESSAGE */}
        {message && <div style={styles.success}>{message}</div>}

        {/* CREATE POST */}
        {user && (
          <div style={styles.card}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              style={styles.textarea}
            />

            <button
              onClick={handleCreatePost}
              disabled={posting}
              style={styles.postBtn}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        )}

        {/* POSTS */}
        {posts.length === 0 && (
          <p style={styles.empty}>No posts yet 🚀</p>
        )}

        {posts.map((post) => (
          <div key={post.$id} style={styles.postCard}>
            <p style={styles.content}>{post.content}</p>

            <div style={styles.postFooter}>
              <span style={styles.author}>
                {post.userName} • {post.userEmail}
              </span>

              {user?.id === post.userid && (
                <button
                  onClick={() => handleDelete(post.$id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "600px",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },

  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    resize: "none",
  },

  postBtn: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  postCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },

  content: {
    marginBottom: "10px",
    fontSize: "15px",
  },

  postFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  author: {
    fontSize: "12px",
    color: "#666",
  },

  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "red",
    cursor: "pointer",
  },

  success: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center",
  },

  empty: {
    textAlign: "center",
    color: "#666",
  },
};