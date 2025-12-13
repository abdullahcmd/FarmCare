import { useEffect, useState } from "react";
import { dashboardAPI } from "../../services/api";
import { Colors } from "../../constants/colors";

export default function FarmerOverview() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getFarmerDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div style={{ padding: "24px" }}>Failed to load dashboard</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "600",
          color: Colors.MainHeading,
          margin: 0,
        }}
      >
        Overview
      </h2>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderLeft: `4px solid ${Colors.MainHeading}`,
          }}
        >
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
            Total Crops
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: Colors.MainHeading,
            }}
          >
            {dashboard.total_crops}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderLeft: `4px solid ${Colors.WarningGreen}`,
          }}
        >
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
            Active Problems
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: Colors.WarningGreen,
            }}
          >
            {dashboard.active_problems}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderLeft: `4px solid ${Colors.SuccessGreen}`,
          }}
        >
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
            Resolved Problems
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: Colors.SuccessGreen,
            }}
          >
            {dashboard.resolved_problems}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: Colors.MainHeading,
            marginBottom: "16px",
            marginTop: 0,
          }}
        >
          Recent Activity
        </h3>
        {dashboard.recent_activity && dashboard.recent_activity.length > 0 ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {dashboard.recent_activity.map((activity, index) => (
              <div
                key={index}
                style={{
                  padding: "16px",
                  backgroundColor: Colors.GreenBackground,
                  borderRadius: "8px",
                  borderLeft: `3px solid ${Colors.MainHeading}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: Colors.MainHeading,
                        marginBottom: "4px",
                      }}
                    >
                      {activity.description}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {activity.crop_name} •{" "}
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor:
                        activity.type === "problem"
                          ? Colors.WarningGreen
                          : Colors.SuccessGreen,
                      color: "white",
                    }}
                  >
                    {activity.type === "problem" ? "Issue" : "Log"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#666", textAlign: "center", padding: "40px" }}>
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}
