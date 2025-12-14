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

// Shared Screens
import Profile from "./Profile";

const MENU_BY_ROLE = {
  farmer: [
    { key: "overview", label: "Overview", path: "/dashboard" },
    { key: "crops", label: "Crops", path: "/dashboard/crops" },
    { key: "issues", label: "Problems", path: "/dashboard/problems" },
    { key: "profile", label: "Profile", path: "/dashboard/profile" },
  ],
  expert: [
    { key: "overview", label: "Overview", path: "/dashboard" },
    { key: "requests", label: "Farmer Requests", path: "/dashboard/requests" },
    { key: "profile", label: "Profile", path: "/dashboard/profile" },
  ],
};

export default function RoleBasedDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <aside
        style={{
          width: sidebarCollapsed ? (isMobile ? "0" : "60px") : "260px",
          backgroundColor: Colors.DarkGreen,
          color: "white",
          flexShrink: 0,
          overflowY: "auto",
          overflowX: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease-in-out",
          position: isMobile ? "fixed" : "relative",
          zIndex: 1000,
          left: isMobile && sidebarCollapsed ? "-260px" : "0",
        }}
      >
        <div style={{ padding: sidebarCollapsed ? "16px 8px" : "16px" }}>
          {/* Header with toggle button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            {!sidebarCollapsed && (
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "white",
                  margin: 0,
                }}
              >
                FarmCare
              </h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>

          {!sidebarCollapsed && (
            <>
              <p
                style={{
                  marginBottom: "16px",
                  fontSize: "14px",
                  color: "#d1d5db",
                }}
              >
                Logged in as{" "}
                <b style={{ textTransform: "capitalize" }}>{user.role}</b>
              </p>
              <p
                style={{
                  marginBottom: "16px",
                  fontSize: "14px",
                  color: "#d1d5db",
                }}
              >
                {user.name}
              </p>
            </>
          )}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              marginBottom: "24px",
            }}
          >
            {menus.map((menu) => {
              const getMenuIcon = (key) => {
                switch (key) {
                  case "overview":
                    return "📊";
                  case "crops":
                    return "🌱";
                  case "issues":
                    return "⚠️";
                  case "requests":
                    return "📋";
                  case "profile":
                    return "👤";
                  default:
                    return "•";
                }
              };

              return (
                <li
                  key={menu.key}
                  onClick={() => {
                    handleMenuClick(menu);
                    if (isMobile) {
                      setSidebarCollapsed(true);
                    }
                  }}
                  style={{
                    padding: sidebarCollapsed ? "12px 8px" : "10px 12px",
                    borderRadius: "4px",
                    marginBottom: "4px",
                    backgroundColor:
                      activeMenu === menu.key
                        ? Colors.MainHeading
                        : "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: sidebarCollapsed ? "0" : "8px",
                    justifyContent: sidebarCollapsed ? "center" : "flex-start",
                    position: "relative",
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
                  title={sidebarCollapsed ? menu.label : ""}
                >
                  <span style={{ fontSize: "16px" }}>
                    {getMenuIcon(menu.key)}
                  </span>
                  {!sidebarCollapsed && <span>{menu.label}</span>}
                </li>
              );
            })}
          </ul>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: sidebarCollapsed ? "12px 8px" : "10px 12px",
              borderRadius: "4px",
              backgroundColor: Colors.WarningGreen,
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarCollapsed ? "center" : "flex-start",
              gap: sidebarCollapsed ? "0" : "8px",
            }}
            title={sidebarCollapsed ? "Logout" : ""}
          >
            <span>🚪</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          backgroundColor: Colors.GreenBackground,
          overflowY: "auto",
          height: "100%",
          marginLeft: isMobile ? "0" : "0", // No margin needed as sidebar is positioned
          transition: "margin-left 0.3s ease-in-out",
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
                <Route path="profile" element={<Profile />} />
              </>
            ) : (
              <>
                <Route index element={<ExpertOverview />} />
                <Route path="requests" element={<FarmerRequests />} />
                <Route path="requests/:id" element={<ProblemDetails />} />
                <Route path="profile" element={<Profile />} />
              </>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
}
