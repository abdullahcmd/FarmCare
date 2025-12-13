import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cropAPI, problemAPI } from "../../services/api";
import { Colors } from "../../constants/colors";
import InputField from "../../components/General/input";
import CustomButton from "../../components/General/Button";

export default function ReportIssue() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cropIdParam = searchParams.get("crop_id");

  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    crop_id: cropIdParam || "",
    issue_type: "",
    description: "",
    images: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCrops();
    if (cropIdParam) {
      setFormData((prev) => ({ ...prev, crop_id: cropIdParam }));
    }
  }, []);

  const loadCrops = async () => {
    try {
      const response = await cropAPI.getAll();
      setCrops(response.data);
    } catch (error) {
      console.error("Failed to load crops:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.crop_id || !formData.issue_type || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await problemAPI.create({
        ...formData,
        crop_id: parseInt(formData.crop_id),
      });
      navigate("/dashboard/problems");
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to report issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "600",
          color: Colors.MainHeading,
          marginBottom: "24px",
        }}
      >
        Report an Issue
      </h2>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: Colors.MainHeading,
            }}
          >
            Select Crop *
          </label>
          <select
            value={formData.crop_id}
            onChange={(e) =>
              setFormData({ ...formData, crop_id: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: Colors.textInputBackground,
            }}
          >
            <option value="">Select a crop</option>
            {crops.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.field_name} - {crop.crop_type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: Colors.MainHeading,
            }}
          >
            Issue Type *
          </label>
          <select
            value={formData.issue_type}
            onChange={(e) =>
              setFormData({ ...formData, issue_type: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: Colors.textInputBackground,
            }}
          >
            <option value="">Select issue type</option>
            <option value="disease">Disease</option>
            <option value="pest">Pest</option>
            <option value="soil">Soil Issue</option>
            <option value="water">Water Issue</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <InputField
          label="Description *"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the issue in detail..."
          newStyle={{ width: "100%" }}
        />

        <InputField
          label="Images (URLs, comma-separated)"
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          placeholder="Enter image URLs separated by commas"
          newStyle={{ width: "100%" }}
        />

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <CustomButton
            type="submit"
            text={loading ? "Submitting..." : "Submit Report"}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: Colors.WarningGreen,
              color: "white",
              padding: "12px",
            }}
          />
          <CustomButton
            type="button"
            text="Cancel"
            onClick={() => navigate("/dashboard/problems")}
            style={{
              flex: 1,
              backgroundColor: "#6c757d",
              color: "white",
              padding: "12px",
            }}
          />
        </div>
      </form>
    </div>
  );
}
