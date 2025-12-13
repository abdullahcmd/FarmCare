import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { expertAPI, cropLogAPI } from "../../services/api";
import { Colors } from "../../constants/colors";
import InputField from "../../components/General/input";
import CustomButton from "../../components/General/Button";

export default function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [diagnosisForm, setDiagnosisForm] = useState({
    diagnosis: "",
    severity: "",
    recommended_actions: "",
    recovery_estimate: "",
    follow_up: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    try {
      const response = await expertAPI.getProblem(id);
      setProblem(response.data);

      // Load crop logs if crop exists
      if (response.data.crop?.id) {
        try {
          const logsResponse = await cropLogAPI.getAll(response.data.crop.id);
          setLogs(logsResponse.data);
        } catch (error) {
          console.error("Failed to load logs:", error);
        }
      }

      // If advice exists, populate form
      if (response.data.expert_advice) {
        setDiagnosisForm({
          diagnosis: response.data.expert_advice.diagnosis || "",
          severity: response.data.expert_advice.severity || "",
          recommended_actions:
            response.data.expert_advice.recommended_actions || "",
          recovery_estimate:
            response.data.expert_advice.recovery_estimate || "",
          follow_up: response.data.expert_advice.follow_up || "",
        });
        setShowDiagnosis(true);
      }
    } catch (error) {
      console.error("Failed to load problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDiagnosis = async (e) => {
    e.preventDefault();
    if (
      !diagnosisForm.diagnosis ||
      !diagnosisForm.severity ||
      !diagnosisForm.recommended_actions
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (problem.expert_advice) {
        await expertAPI.updateDiagnosis(id, diagnosisForm);
      } else {
        await expertAPI.diagnose(id, diagnosisForm);
      }
      setShowDiagnosis(false);
      loadProblem();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to submit diagnosis");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!window.confirm("Mark this problem as resolved?")) return;
    try {
      await expertAPI.resolve(id);
      loadProblem();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to resolve problem");
    }
  };

  const handleAddFollowup = async () => {
    const followup = window.prompt("Enter follow-up comment:");
    if (!followup) return;

    try {
      await expertAPI.addFollowup(id, { follow_up: followup });
      loadProblem();
    } catch (error) {
      alert("Failed to add follow-up");
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
          text="← Back to Requests"
          onClick={() => navigate("/dashboard/requests")}
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
              Farmer
            </div>
            <div style={{ fontSize: "16px", color: Colors.MainHeading }}>
              {problem.farmer_name || "Unknown"}
            </div>
          </div>
        </div>
      </div>

      {/* Crop Logs */}
      {logs.length > 0 && (
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
            Crop Growth Logs
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "12px",
                  backgroundColor: Colors.GreenBackground,
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                  {new Date(log.date).toLocaleDateString()} -{" "}
                  {log.stage || "Update"}
                </div>
                {log.notes && <div style={{ color: "#666" }}>{log.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnosis Form */}
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: Colors.MainHeading,
              margin: 0,
            }}
          >
            {problem.expert_advice ? "Update Diagnosis" : "Provide Diagnosis"}
          </h3>
          {!showDiagnosis && (
            <CustomButton
              text={problem.expert_advice ? "Edit Diagnosis" : "Add Diagnosis"}
              onClick={() => setShowDiagnosis(true)}
              style={{
                backgroundColor: Colors.MainHeading,
                color: "white",
                padding: "8px 16px",
                width: "auto",
              }}
            />
          )}
        </div>

        {showDiagnosis ? (
          <form
            onSubmit={handleSubmitDiagnosis}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <InputField
              label="Diagnosis *"
              value={diagnosisForm.diagnosis}
              onChange={(e) =>
                setDiagnosisForm({
                  ...diagnosisForm,
                  diagnosis: e.target.value,
                })
              }
              placeholder="Describe the diagnosis..."
              newStyle={{ width: "100%" }}
            />

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: Colors.MainHeading,
                }}
              >
                Severity *
              </label>
              <select
                value={diagnosisForm.severity}
                onChange={(e) =>
                  setDiagnosisForm({
                    ...diagnosisForm,
                    severity: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  backgroundColor: Colors.textInputBackground,
                }}
              >
                <option value="">Select severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <InputField
              label="Recommended Actions *"
              value={diagnosisForm.recommended_actions}
              onChange={(e) =>
                setDiagnosisForm({
                  ...diagnosisForm,
                  recommended_actions: e.target.value,
                })
              }
              placeholder="What should the farmer do?"
              newStyle={{ width: "100%" }}
            />

            <InputField
              label="Recovery Estimate"
              value={diagnosisForm.recovery_estimate}
              onChange={(e) =>
                setDiagnosisForm({
                  ...diagnosisForm,
                  recovery_estimate: e.target.value,
                })
              }
              placeholder="e.g., 2-3 weeks"
              newStyle={{ width: "100%" }}
            />

            <InputField
              label="Follow-up Notes"
              value={diagnosisForm.follow_up}
              onChange={(e) =>
                setDiagnosisForm({
                  ...diagnosisForm,
                  follow_up: e.target.value,
                })
              }
              placeholder="Additional notes..."
              newStyle={{ width: "100%" }}
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <CustomButton
                type="submit"
                text={submitting ? "Saving..." : "Save Diagnosis"}
                disabled={submitting}
                style={{
                  flex: 1,
                  backgroundColor: Colors.MainHeading,
                  color: "white",
                  padding: "12px",
                }}
              />
              <CustomButton
                type="button"
                text="Cancel"
                onClick={() => setShowDiagnosis(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#6c757d",
                  color: "white",
                  padding: "12px",
                }}
              />
            </div>
          </form>
        ) : problem.expert_advice ? (
          <div
            style={{
              padding: "16px",
              backgroundColor: Colors.GreenBackground,
              borderRadius: "8px",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
              >
                Diagnosis
              </div>
              <div style={{ fontSize: "16px", color: "#333" }}>
                {problem.expert_advice.diagnosis}
              </div>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
              >
                Severity
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: Colors.MainHeading,
                  color: "white",
                  textTransform: "capitalize",
                }}
              >
                {problem.expert_advice.severity}
              </span>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
              >
                Recommended Actions
              </div>
              <div style={{ fontSize: "16px", color: "#333" }}>
                {problem.expert_advice.recommended_actions}
              </div>
            </div>
            {problem.expert_advice.recovery_estimate && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  Recovery Estimate
                </div>
                <div style={{ fontSize: "16px", color: Colors.MainHeading }}>
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
                  Follow-up
                </div>
                <div style={{ fontSize: "16px", color: "#333" }}>
                  {problem.expert_advice.follow_up}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {problem.expert_advice && problem.status !== "resolved" && (
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <CustomButton
              text="Add Follow-up"
              onClick={handleAddFollowup}
              style={{
                backgroundColor: Colors.MediumGreen,
                color: "white",
                padding: "10px 20px",
                width: "auto",
              }}
            />
            <CustomButton
              text="Mark as Resolved"
              onClick={handleResolve}
              style={{
                backgroundColor: Colors.SuccessGreen,
                color: "white",
                padding: "10px 20px",
                width: "auto",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
