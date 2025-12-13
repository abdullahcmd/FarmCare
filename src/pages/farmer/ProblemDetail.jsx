import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { problemAPI } from "../../services/api";
import { Colors } from "../../constants/colors";
import CustomButton from "../../components/General/Button";

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    try {
      const response = await problemAPI.getById(id);
      setProblem(response.data);
    } catch (error) {
      console.error("Failed to load problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm("Mark this problem as resolved?")) return;
    try {
      await problemAPI.close(id);
      loadProblem();
    } catch (error) {
      alert("Failed to close problem");
    }
  };

  const handleReopen = async () => {
    try {
      await problemAPI.reopen(id);
      loadProblem();
    } catch (error) {
      alert("Failed to reopen problem");
    }
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  if (!problem) {
    return <div style={{ padding: "24px" }}>Problem not found</div>;
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
          Problem Details
        </h2>
        <CustomButton
          text="← Back to Problems"
          onClick={() => navigate("/dashboard/problems")}
          style={{
            backgroundColor: Colors.MediumGreen,
            color: "white",
            padding: "8px 16px",
            width: "auto",
          }}
        />
      </div>

      {/* Problem Info */}
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
          Problem Information
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
            >
              Issue Type
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: Colors.MainHeading,
              }}
            >
              {problem.issue_type}
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
            >
              Description
            </div>
            <div style={{ fontSize: "16px", color: "#333" }}>
              {problem.description}
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
            >
              Status
            </div>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                backgroundColor: Colors.WarningGreen,
                color: "white",
                textTransform: "capitalize",
              }}
            >
              {problem.status.replace("_", " ")}
            </span>
          </div>
          {problem.crop && (
            <div>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
              >
                Crop
              </div>
              <div style={{ fontSize: "16px", color: Colors.MainHeading }}>
                {problem.crop.field_name} - {problem.crop.crop_type}
              </div>
            </div>
          )}
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
            >
              Reported On
            </div>
            <div style={{ fontSize: "16px", color: "#333" }}>
              {new Date(problem.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Expert Advice */}
      {problem.expert_advice ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderLeft: `4px solid ${Colors.SuccessGreen}`,
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
            Expert Advice
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
              >
                Diagnosis
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "#333",
                  padding: "12px",
                  backgroundColor: Colors.GreenBackground,
                  borderRadius: "8px",
                }}
              >
                {problem.expert_advice.diagnosis}
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
              >
                Severity
              </div>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: Colors.MainHeading,
                  color: "white",
                  textTransform: "capitalize",
                }}
              >
                {problem.expert_advice.severity}
              </span>
            </div>
            <div>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
              >
                Recommended Actions
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "#333",
                  padding: "12px",
                  backgroundColor: Colors.GreenBackground,
                  borderRadius: "8px",
                }}
              >
                {problem.expert_advice.recommended_actions}
              </div>
            </div>
            {problem.expert_advice.recovery_estimate && (
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  Recovery Estimate
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: Colors.SuccessGreen,
                    fontWeight: "600",
                  }}
                >
                  {problem.expert_advice.recovery_estimate}
                </div>
              </div>
            )}
            {problem.expert_advice.follow_up && (
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  Follow-up Notes
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    padding: "12px",
                    backgroundColor: Colors.GreenBackground,
                    borderRadius: "8px",
                  }}
                >
                  {problem.expert_advice.follow_up}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
            color: "#666",
          }}
        >
          <p>Waiting for expert review...</p>
        </div>
      )}

      {/* Actions */}
      {problem.status !== "resolved" && (
        <div style={{ display: "flex", gap: "12px" }}>
          <CustomButton
            text="Mark as Resolved"
            onClick={handleClose}
            style={{
              backgroundColor: Colors.SuccessGreen,
              color: "white",
              padding: "12px 24px",
              width: "auto",
            }}
          />
        </div>
      )}

      {problem.status === "resolved" && (
        <div>
          <CustomButton
            text="Reopen Problem"
            onClick={handleReopen}
            style={{
              backgroundColor: Colors.WarningGreen,
              color: "white",
              padding: "12px 24px",
              width: "auto",
            }}
          />
        </div>
      )}
    </div>
  );
}
