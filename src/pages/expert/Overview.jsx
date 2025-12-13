import { useEffect, useState } from "react";
import { dashboardAPI } from "../../services/api";
import { Colors } from "../../constants/colors";

export default function ExpertOverview() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getExpertDashboard();
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
            Total Reviewed
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: Colors.MainHeading,
            }}
          >
            {dashboard.total_reviewed}
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
            Open Cases
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: Colors.WarningGreen,
            }}
          >
            {dashboard.open_cases}
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
            Resolved Cases
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: Colors.SuccessGreen,
            }}
          >
            {dashboard.resolved_cases}
          </div>
        </div>
      </div>

      {/* Problems by Severity */}
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
          Problems by Severity
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px",
          }}
        >
          {Object.entries(dashboard.problems_by_severity || {}).map(
            ([severity, count]) => (
              <div
                key={severity}
                style={{
                  padding: "16px",
                  backgroundColor: Colors.GreenBackground,
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: Colors.MainHeading,
                    marginBottom: "4px",
                  }}
                >
                  {count}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    textTransform: "capitalize",
                  }}
                >
                  {severity}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
