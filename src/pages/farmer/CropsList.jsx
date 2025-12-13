import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cropAPI } from "../../services/api";
import { Colors } from "../../constants/colors";
import CustomButton from "../../components/General/Button";

export default function CropsList() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      const response = await cropAPI.getAll();
      setCrops(response.data);
    } catch (error) {
      console.error("Failed to load crops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;

    try {
      await cropAPI.delete(id);
      loadCrops();
    } catch (error) {
      alert("Failed to delete crop");
    }
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading crops...</div>;
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
          My Crops
        </h2>
        <CustomButton
          text="+ Add New Crop"
          onClick={() => navigate("/dashboard/crops/new")}
          style={{
            backgroundColor: Colors.MainHeading,
            color: "white",
            padding: "10px 20px",
            width: "auto",
          }}
        />
      </div>

      {crops.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            color: "#666",
          }}
        >
          <p>No crops added yet. Click "Add New Crop" to get started!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {crops.map((crop) => (
            <div
              key={crop.id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: `2px solid ${Colors.GreenBackground}`,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
              onClick={() => navigate(`/dashboard/crops/${crop.id}`)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "12px",
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
                  {crop.field_name}
                </h3>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: Colors.LightGreen,
                    color: "white",
                  }}
                >
                  {crop.crop_type}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "14px", color: "#666" }}>
                  <strong>Area:</strong> {crop.area} {crop.area_unit || "units"}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  <strong>Planted:</strong>{" "}
                  {new Date(crop.planting_date).toLocaleDateString()}
                </div>
                {crop.harvest_date && (
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    <strong>Harvest:</strong>{" "}
                    {new Date(crop.harvest_date).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <CustomButton
                  text="View Details"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/crops/${crop.id}`);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: Colors.MainHeading,
                    color: "white",
                    padding: "8px",
                    fontSize: "14px",
                  }}
                />
                <CustomButton
                  text="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(crop.id);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
