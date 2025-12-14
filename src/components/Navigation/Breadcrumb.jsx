import React from "react";
import { useNavigate } from "react-router-dom";
import { Colors } from "../../constants/colors";

const Breadcrumb = ({ items, style }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        marginBottom: "16px",
        ...style,
      }}
    >
      {items.map((item, index) => (
        <span key={index} style={{ display: "flex", alignItems: "center" }}>
          {item.href || item.onClick ? (
            <button
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.href) {
                  navigate(item.href);
                }
              }}
              style={{
                background: "none",
                border: "none",
                color: Colors.MediumGreen,
                textDecoration: "none",
                fontWeight: "500",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(74, 124, 42, 0.1)";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.textDecoration = "none";
              }}
            >
              {item.label}
            </button>
          ) : (
            <span
              style={{
                color: Colors.MainHeading,
                fontWeight: "600",
                padding: "4px 8px",
              }}
            >
              {item.label}
            </span>
          )}

          {index < items.length - 1 && (
            <span
              style={{
                margin: "0 4px",
                color: "#d1d5db",
                fontSize: "12px",
              }}
            >
              →
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
