import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { expertAPI } from "../../services/api";
import { Colors } from "../../constants/colors";

export default function FarmerRequests() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status_filter: "",
    issue_type: "",
    crop_type: "",
    severity: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadProblems();
  }, [filters]);

  const loadProblems = async () => {
    try {
      const response = await expertAPI.getProblems(filters);
      setProblems(response.data);
    } catch (error) {
      console.error("Failed to load problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_review":
        return Colors.WarningGreen;
      case "under_review":
        return Colors.MediumGreen;
      case "advice_given":
        return Colors.LightGreen;
      case "resolved":
        return Colors.SuccessGreen;
      default:
        return "#666";
    }
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading requests...</div>;
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
        Farmer Requests
      </h2>

      {/* Filters */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#050505ff",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Status
            </label>
            <select
              value={filters.status_filter}
              onChange={(e) =>
                setFilters({ ...filters, status_filter: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                color: "#050505ff",
                borderRadius: "5px",
                border: "1px solid #050505ff",
              }}
            >
              <option value="">All</option>
              <option value="pending_review">Pending Review</option>
              <option value="under_review">Under Review</option>
              <option value="advice_given">Advice Given</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#050505ff",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Issue Type
            </label>
            <select
              value={filters.issue_type}
              onChange={(e) =>
                setFilters({ ...filters, issue_type: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                color: "#050505ff",
                border: "1px solid #ccc",
              }}
            >
              <option value="">All</option>
              <option value="disease">Disease</option>
              <option value="pest">Pest</option>
              <option value="soil">Soil</option>
              <option value="water">Water</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#050505ff",
                fontWeight: "600",
              }}
            >
              Crop Type
            </label>
            <input
              type="text"
              value={filters.crop_type}
              onChange={(e) =>
                setFilters({ ...filters, crop_type: e.target.value })
              }
              placeholder="Filter by crop"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                color: "#050505ff",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#050505ff",
                fontWeight: "600",
              }}
            >
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) =>
                setFilters({ ...filters, severity: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                color: "#050505ff",
                border: "1px solid #ccc",
              }}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {problems.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            color: "#666",
          }}
        >
          <p>No problems found matching your filters.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {problems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => navigate(`/dashboard/requests/${problem.id}`)}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderLeft: `4px solid ${getStatusColor(problem.status)}`,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateX(4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateX(0)")
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: Colors.MainHeading,
                      margin: "0 0 8px 0",
                    }}
                  >
                    {problem.issue_type} -{" "}
                    {problem.crop?.crop_type || "Unknown Crop"}
                  </h3>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    {problem.description}
                  </div>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    Farmer: {problem.farmer_name || "Unknown"} •{" "}
                    {new Date(problem.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: getStatusColor(problem.status),
                    color: "white",
                    textTransform: "capitalize",
                    marginLeft: "16px",
                  }}
                >
                  {problem.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
