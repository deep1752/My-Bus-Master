"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useUserContext } from "@/context/UserContext";

export default function ProfilePage() {
  const { userInfo, setUserInfo, loading, error, setLoading } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userInfo) setNewName(userInfo.name);
  }, [userInfo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push("/login");
    }
  }, [error, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUserInfo(null);
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      setIsSaving(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update/${userInfo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newName,
            email: userInfo.email,
            password: userInfo.password,
            mob_number: userInfo.mob_number,
            role: userInfo.role,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update name.");

      toast.success("Name updated successfully!");
      setUserInfo({ ...userInfo, name: newName });
      localStorage.setItem("userName", newName);
      setIsEditing(false);
    } catch (err) {
      toast.error("Error updating name.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <ReloadIcon className="profile-loading-icon" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <CardContent className="profile-card-content">
          <div className="profile-header">
            <h2 className="profile-title">User Profile</h2>

            {isEditing ? (
              <div className="profile-edit-form">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="profile-edit-input"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNameUpdate}
                  disabled={isSaving}
                  className="profile-save-button"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <div className="profile-name-display">
                <p className="profile-welcome-text">Welcome, {userInfo?.name}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  title="Edit name"
                  className="profile-edit-button"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="profile-details">
            <p className="profile-detail-item">
              <strong className="profile-detail-label">Email:</strong> {userInfo?.email}
            </p>
            <p className="profile-detail-item">
              <strong className="profile-detail-label">Mobile:</strong> {userInfo?.mob_number}
            </p>
            <p className="profile-detail-item">
              <strong className="profile-detail-label">Role:</strong> {userInfo?.role}
            </p>
            <p className="profile-detail-item">
              <strong className="profile-detail-label">Created At:</strong>{" "}
              {new Date(userInfo?.created_at).toLocaleString()}
            </p>
          </div>

          <Button 
            onClick={handleLogout} 
            className="profile-logout-button"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}