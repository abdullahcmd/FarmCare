import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { problemAPI } from "../../services/api";
import { Colors } from "../../constants/colors";
import CustomButton from "../../components/General/Button";

export default function ProblemsList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadProblems();
  }, [filter]);

  const loadProblems = async () => {
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const response = await problemAPI.getAll(params);
      setProblems(response.data);
    } catch (error) {
      console.error("Failed to load problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (id) => {
    try {
      await problemAPI.close(id);
      loadProblems();
    } catch (error) {
      alert("Failed to close problem");
    }
  };

  const handleReopen = async (id) => {
    try {
      await problemAPI.reopen(id);
      loadProblems();
    } catch (error) {
      alert("Failed to reopen problem");
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
    return <div style={{ padding: "24px" }}>Loading problems...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "600",
            color: Colors.MainHeading,
            margin: 0,
          }}
        >
          My Problems
        </h2>
        <CustomButton
          text="+ Report New Issue"
          onClick={() => navigate("/dashboard/problems/new")}
          style={{
            backgroundColor: Colors.WarningGreen,
            color: "white",
            padding: "10px 20px",
            width: "auto",
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {[
          "all",
          "pending_review",
          "under_review",
          "advice_given",
          "resolved",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              backgroundColor:
                filter === status ? Colors.MainHeading : Colors.GreenBackground,
              color: filter === status ? "white" : Colors.MainHeading,
              cursor: "pointer",
              fontWeight: filter === status ? "600" : "400",
              textTransform: "capitalize",
            }}
          >
            {status.replace("_", " ")}
          </button>
        ))}
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
          <p>No problems found. Click "Report New Issue" to get started!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {problems.map((problem) => (
            <div
              key={problem.id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderLeft: `4px solid ${getStatusColor(problem.status)}`,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/dashboard/problems/${problem.id}`)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: Colors.MainHeading,
                      margin: "0 0 8px 0",
                    }}
                  >
                    {problem.issue_type}
                  </h3>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    {problem.description}
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
                  }}
                >
                  {problem.status.replace("_", " ")}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "12px",
                }}
              >
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {new Date(problem.created_at).toLocaleDateString()}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {problem.status === "resolved" ? (
                    <CustomButton
                      text="Reopen"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReopen(problem.id);
                      }}
                      style={{
                        backgroundColor: Colors.MediumGreen,
                        color: "white",
                        padding: "6px 12px",
                        fontSize: "12px",
                        width: "auto",
                      }}
                    />
                  ) : (
                    <CustomButton
                      text="Close"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose(problem.id);
                      }}
                      style={{
                        backgroundColor: Colors.SuccessGreen,
                        color: "white",
                        padding: "6px 12px",
                        fontSize: "12px",
                        width: "auto",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
