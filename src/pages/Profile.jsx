import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../constants/colors";
import { PageContainer, FormLayout } from "../components/Layout";
import { Button, InputField, SuccessMessage } from "../components/General";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    specialization: "",
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile();
      const profileData = {
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        location: response.data.location || "",
        specialization: response.data.specialization || "",
      };
      setFormData(profileData);
      setOriginalData(profileData);
    } catch (error) {
      console.error("Failed to load profile:", error);
      setError("Failed to load profile information");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the validation errors");
      return;
    }

    setSaving(true);
    try {
      const response = await profileAPI.updateProfile(formData);
      setUser(response.data);
      setOriginalData(formData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  return (
    <PageContainer
      title="Profile"
      subtitle="Manage your account information"
      loading={loading}
      error={loading ? null : error}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profile" },
      ]}
      actions={
        !isEditing && (
          <Button
            text="Edit Profile"
            onClick={() => setIsEditing(true)}
            variant="primary"
            size="medium"
            style={{ width: "auto" }}
          />
        )
      }
    >
      {!loading && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {!isEditing ? (
            // View Mode
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "32px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Name
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      color: Colors.MainHeading,
                      fontWeight: "600",
                    }}
                  >
                    {formData.name || "Not provided"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Email
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      color: Colors.MainHeading,
                      fontWeight: "600",
                    }}
                  >
                    {formData.email || "Not provided"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Phone
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      color: Colors.MainHeading,
                      fontWeight: "600",
                    }}
                  >
                    {formData.phone || "Not provided"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Role
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      color: Colors.MainHeading,
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {user?.role || "Not specified"}
                  </div>
                </div>

                {formData.location && (
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Location
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        color: Colors.MainHeading,
                        fontWeight: "600",
                      }}
                    >
                      {formData.location}
                    </div>
                  </div>
                )}

                {user?.role === "expert" && formData.specialization && (
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Specialization
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        color: Colors.MainHeading,
                        fontWeight: "600",
                      }}
                    >
                      {formData.specialization}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Edit Mode
            <FormLayout
              title="Edit Profile"
              subtitle="Update your account information"
              onSubmit={handleSubmit}
              loading={saving}
              error={error}
              success={success}
            >
              <InputField
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your full name"
                required
              />

              <InputField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email address"
                required
              />

              <InputField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter your phone number"
                required
              />

              <InputField
                label="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter your location (optional)"
              />

              {user?.role === "expert" && (
                <InputField
                  label="Specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  placeholder="Enter your area of expertise (optional)"
                />
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <Button
                  type="submit"
                  text={saving ? "Saving..." : "Save Changes"}
                  disabled={saving || !hasChanges}
                  variant="primary"
                  loading={saving}
                  style={{ flex: 1 }}
                />
                <Button
                  type="button"
                  text="Cancel"
                  onClick={handleCancel}
                  variant="secondary"
                  disabled={saving}
                  style={{ flex: 1 }}
                />
              </div>
            </FormLayout>
          )}
        </div>
      )}
    </PageContainer>
  );
}
