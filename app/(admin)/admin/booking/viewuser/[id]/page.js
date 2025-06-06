"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ViewUserDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://127.0.0.1:8000/users/users?user_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        toast.error("❌ Failed to load user details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-message">
        ⚠️ User not found.
        <button onClick={() => router.back()} className="back-btn">
          ◀ Back
        </button>
      </div>
    );
  }

  return (
    <div className="user-details-container">
      <button onClick={() => router.back()} className="back-btn">
        ◀ Back
      </button>
      <h2 className="user-details-title">👤 User Details</h2>
      <table className="user-details-table">
        <tbody>
          <tr><td><strong>ID:</strong></td><td>{user.id}</td></tr>
          <tr><td><strong>Name:</strong></td><td>{user.name}</td></tr>
          <tr><td><strong>Email:</strong></td><td>{user.email}</td></tr>
          <tr><td><strong>Mobile:</strong></td><td>{user.mob_number}</td></tr>
          {/* <tr><td><strong>Role:</strong></td><td>{user.role}</td></tr> */}
          <tr><td><strong>Created At:</strong></td><td>{new Date(user.created_at).toLocaleString()}</td></tr>
          <tr><td><strong>Updated At:</strong></td><td>{new Date(user.updated_at).toLocaleString()}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
