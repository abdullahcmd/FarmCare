import { useEffect, useState } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../constants/colors";

// Farmer Screens
import FarmerOverview from "./farmer/Overview";
import CropsList from "./farmer/CropsList";
import AddEditCrop from "./farmer/AddEditCrop";
import CropDetails from "./farmer/CropDetails";
import ReportIssue from "./farmer/ReportIssue";
import ProblemsList from "./farmer/ProblemsList";
import ProblemDetail from "./farmer/ProblemDetail";

// Expert Screens
import ExpertOverview from "./expert/Overview";
import FarmerRequests from "./expert/FarmerRequests";
import ProblemDetails from "./expert/ProblemDetails";

const MENU_BY_ROLE = {
  farmer: [
    { key: "overview", label: "Overview", path: "/dashboard" },
    { key: "crops", label: "Crops", path: "/dashboard/crops" },
    { key: "issues", label: "Problems", path: "/dashboard/problems" },
  ],
  expert: [
    { key: "overview", label: "Overview", path: "/dashboard" },
    { key: "requests", label: "Farmer Requests", path: "/dashboard/requests" },
  ],
};

export default function RoleBasedDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("overview");

  useEffect(() => {
    // Set active menu based on current path
    const currentPath = location.pathname;
    const menu = MENU_BY_ROLE[user?.role]?.find((m) =>
      currentPath.startsWith(m.path)
    );
    if (menu) {
      setActiveMenu(menu.key);
    }
  }, [location.pathname, user]);

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: Colors.MainHeading }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const menus = MENU_BY_ROLE[user.role] || [];

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.key);
    navigate(menu.path);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        zIndex: 9999,
      }}
    >
      <aside
        style={{
          width: "260px",
          backgroundColor: Colors.DarkGreen,
          color: "white",
          flexShrink: 0,
          overflowY: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "16px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "24px",
              color: "white",
            }}
          >
            FarmCare
          </h1>
          <p
            style={{ marginBottom: "16px", fontSize: "14px", color: "#d1d5db" }}
          >
            Logged in as{" "}
            <b style={{ textTransform: "capitalize" }}>{user.role}</b>
          </p>
          <p
            style={{ marginBottom: "16px", fontSize: "14px", color: "#d1d5db" }}
          >
            {user.name}
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              marginBottom: "24px",
            }}
          >
            {menus.map((menu) => (
              <li
                key={menu.key}
                onClick={() => handleMenuClick(menu)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "4px",
                  marginBottom: "4px",
                  backgroundColor:
                    activeMenu === menu.key
                      ? Colors.MainHeading
                      : "transparent",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (activeMenu !== menu.key) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeMenu !== menu.key) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {menu.label}
              </li>
            ))}
          </ul>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "4px",
              backgroundColor: Colors.WarningGreen,
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          backgroundColor: Colors.GreenBackground,
          overflowY: "auto",
          height: "100%",
        }}
      >
        <div style={{ padding: "24px" }}>
          <Routes>
            {user.role === "farmer" ? (
              <>
                <Route index element={<FarmerOverview />} />
                <Route path="crops" element={<CropsList />} />
                <Route path="crops/new" element={<AddEditCrop />} />
                <Route path="crops/:id" element={<CropDetails />} />
                <Route path="crops/:id/edit" element={<AddEditCrop />} />
                <Route path="problems" element={<ProblemsList />} />
                <Route path="problems/new" element={<ReportIssue />} />
                <Route path="problems/:id" element={<ProblemDetail />} />
              </>
            ) : (
              <>
                <Route index element={<ExpertOverview />} />
                <Route path="requests" element={<FarmerRequests />} />
                <Route path="requests/:id" element={<ProblemDetails />} />
              </>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
}
