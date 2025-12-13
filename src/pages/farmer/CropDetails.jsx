import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cropAPI, cropLogAPI } from "../../services/api";
import { Colors } from "../../constants/colors";
import CustomButton from "../../components/General/Button";
import InputField from "../../components/General/input";

export default function CropDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [logs, setLogs] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddLog, setShowAddLog] = useState(false);
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split("T")[0],
    stage: "",
    notes: "",
    irrigation: "",
    fertilizer: "",
  });

  useEffect(() => {
    loadCropDetails();
  }, [id]);

  const loadCropDetails = async () => {
    try {
      const response = await cropAPI.getDetails(id);
      setCrop(response.data);
      setLogs(response.data.logs || []);
      setProblems(response.data.problems || []);
    } catch (error) {
      console.error("Failed to load crop details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      await cropLogAPI.create(id, {
        ...logForm,
        irrigation: logForm.irrigation ? parseFloat(logForm.irrigation) : null,
        date: new Date(logForm.date).toISOString(),
      });
      setShowAddLog(false);
      setLogForm({
        date: new Date().toISOString().split("T")[0],
        stage: "",
        notes: "",
        irrigation: "",
        fertilizer: "",
      });
      loadCropDetails();
    } catch (error) {
      alert("Failed to add log");
    }
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  if (!crop) {
    return <div style={{ padding: "24px" }}>Crop not found</div>;
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
          {crop.field_name}
        </h2>
        <CustomButton
          text="← Back to Crops"
          onClick={() => navigate("/dashboard/crops")}
          style={{
            backgroundColor: Colors.MediumGreen,
            color: "white",
            padding: "8px 16px",
            width: "auto",
          }}
        />
      </div>

      {/* Crop Info */}
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
          Crop Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
            >
              Crop Type
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: Colors.MainHeading,
              }}
            >
              {crop.crop_type}
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
            >
              Area
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: Colors.MainHeading,
              }}
            >
              {crop.area} units
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
            >
              Planting Date
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: Colors.MainHeading,
              }}
            >
              {new Date(crop.planting_date).toLocaleDateString()}
            </div>
          </div>
          {crop.harvest_date && (
            <div>
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}
              >
                Harvest Date
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: Colors.MainHeading,
                }}
              >
                {new Date(crop.harvest_date).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Growth Logs */}
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
            Growth Logs
          </h3>
          <CustomButton
            text={showAddLog ? "Cancel" : "+ Add Log"}
            onClick={() => setShowAddLog(!showAddLog)}
            style={{
              backgroundColor: showAddLog ? "#6c757d" : Colors.MainHeading,
              color: "white",
              padding: "8px 16px",
              width: "auto",
            }}
          />
        </div>

        {showAddLog && (
          <form
            onSubmit={handleAddLog}
            style={{
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: Colors.GreenBackground,
              borderRadius: "8px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <InputField
                label="Date"
                type="date"
                value={logForm.date}
                onChange={(e) =>
                  setLogForm({ ...logForm, date: e.target.value })
                }
                newStyle={{ width: "100%" }}
              />
              <InputField
                label="Growth Stage"
                value={logForm.stage}
                onChange={(e) =>
                  setLogForm({ ...logForm, stage: e.target.value })
                }
                placeholder="e.g., Seedling, Flowering, Mature"
                newStyle={{ width: "100%" }}
              />
              <InputField
                label="Irrigation (liters)"
                type="number"
                value={logForm.irrigation}
                onChange={(e) =>
                  setLogForm({ ...logForm, irrigation: e.target.value })
                }
                newStyle={{ width: "100%" }}
              />
              <InputField
                label="Fertilizer"
                value={logForm.fertilizer}
                onChange={(e) =>
                  setLogForm({ ...logForm, fertilizer: e.target.value })
                }
                placeholder="Type of fertilizer used"
                newStyle={{ width: "100%" }}
              />
              <InputField
                label="Notes"
                value={logForm.notes}
                onChange={(e) =>
                  setLogForm({ ...logForm, notes: e.target.value })
                }
                placeholder="Additional notes"
                newStyle={{ width: "100%" }}
              />
              <CustomButton
                type="submit"
                text="Add Log"
                style={{
                  backgroundColor: Colors.MainHeading,
                  color: "white",
                  padding: "10px",
                }}
              />
            </div>
          </form>
        )}

        {logs.length === 0 ? (
          <div style={{ color: "#666", textAlign: "center", padding: "40px" }}>
            No logs yet
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {logs.map((log) => (
              <div
                key={log.id}
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
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ fontWeight: "600", color: Colors.MainHeading }}>
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                  {log.stage && (
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        backgroundColor: Colors.LightGreen,
                        color: "white",
                      }}
                    >
                      {log.stage}
                    </span>
                  )}
                </div>
                {log.notes && (
                  <div style={{ marginBottom: "8px", color: "#666" }}>
                    {log.notes}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  {log.irrigation && <div>Irrigation: {log.irrigation}L</div>}
                  {log.fertilizer && <div>Fertilizer: {log.fertilizer}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Problems */}
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
            Reported Problems
          </h3>
          <CustomButton
            text="+ Report Issue"
            onClick={() => navigate(`/dashboard/problems/new?crop_id=${id}`)}
            style={{
              backgroundColor: Colors.WarningGreen,
              color: "white",
              padding: "8px 16px",
              width: "auto",
            }}
          />
        </div>

        {problems.length === 0 ? (
          <div style={{ color: "#666", textAlign: "center", padding: "40px" }}>
            No problems reported
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {problems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => navigate(`/dashboard/problems/${problem.id}`)}
                style={{
                  padding: "16px",
                  backgroundColor: Colors.GreenBackground,
                  borderRadius: "8px",
                  borderLeft: `3px solid ${Colors.WarningGreen}`,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ fontWeight: "600", color: Colors.MainHeading }}>
                    {problem.issue_type}
                  </div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      backgroundColor: Colors.WarningGreen,
                      color: "white",
                    }}
                  >
                    {problem.status}
                  </span>
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>
                  {problem.description}
                </div>
                <div
                  style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}
                >
                  {new Date(problem.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
