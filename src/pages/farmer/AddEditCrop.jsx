import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cropAPI } from "../../services/api";
import { Colors } from "../../constants/colors";
import InputField from "../../components/General/input";
import CustomButton from "../../components/General/Button";

export default function AddEditCrop() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    crop_type: "",
    field_name: "",
    area: "",
    planting_date: "",
    harvest_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      loadCrop();
    }
  }, [id]);

  const loadCrop = async () => {
    try {
      const response = await cropAPI.getById(id);
      const crop = response.data;
      setFormData({
        crop_type: crop.crop_type || "",
        field_name: crop.field_name || "",
        area: crop.area?.toString() || "",
        planting_date: crop.planting_date
          ? new Date(crop.planting_date).toISOString().split("T")[0]
          : "",
        harvest_date: crop.harvest_date
          ? new Date(crop.harvest_date).toISOString().split("T")[0]
          : "",
      });
    } catch (error) {
      console.error("Failed to load crop:", error);
      setError("Failed to load crop details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.crop_type ||
      !formData.field_name ||
      !formData.area ||
      !formData.planting_date
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        area: parseFloat(formData.area),
        planting_date: new Date(formData.planting_date).toISOString(),
        harvest_date: formData.harvest_date
          ? new Date(formData.harvest_date).toISOString()
          : null,
      };

      if (isEdit) {
        await cropAPI.update(id, submitData);
      } else {
        await cropAPI.create(submitData);
      }
      navigate("/dashboard/crops");
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to save crop");
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
        {isEdit ? "Edit Crop" : "Add New Crop"}
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
        <InputField
          label="Crop Type *"
          value={formData.crop_type}
          onChange={(e) =>
            setFormData({ ...formData, crop_type: e.target.value })
          }
          placeholder="e.g., Wheat, Rice, Cotton"
          newStyle={{ width: "100%" }}
        />

        <InputField
          label="Field Name *"
          value={formData.field_name}
          onChange={(e) =>
            setFormData({ ...formData, field_name: e.target.value })
          }
          placeholder="Enter field name"
          newStyle={{ width: "100%" }}
        />

        <InputField
          label="Area (in units) *"
          type="number"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          placeholder="Enter area"
          newStyle={{ width: "100%" }}
        />

        <InputField
          label="Planting Date *"
          type="date"
          value={formData.planting_date}
          onChange={(e) =>
            setFormData({ ...formData, planting_date: e.target.value })
          }
          newStyle={{ width: "100%" }}
        />

        <InputField
          label="Expected Harvest Date"
          type="date"
          value={formData.harvest_date}
          onChange={(e) =>
            setFormData({ ...formData, harvest_date: e.target.value })
          }
          newStyle={{ width: "100%" }}
        />

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <CustomButton
            type="submit"
            text={loading ? "Saving..." : isEdit ? "Update Crop" : "Add Crop"}
            disabled={loading}
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
            onClick={() => navigate("/dashboard/crops")}
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
