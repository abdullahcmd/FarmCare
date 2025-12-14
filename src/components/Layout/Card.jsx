import React, { useState } from "react";
import { Colors } from "../../constants/colors";

const Card = ({
  children,
  title,
  subtitle,
  interactive = false,
  onClick,
  status,
  style,
  className,
  padding = "24px",
}) => {
  const [hovered, setHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return Colors.SuccessGreen;
      case "warning":
        return Colors.WarningGreen;
      case "error":
        return "#f44336";
      case "info":
        return Colors.MediumGreen;
      default:
        return Colors.MainHeading;
    }
  };

  const isMobile = window.innerWidth < 768;

  const baseStyles = {
    backgroundColor: "white",
    borderRadius: isMobile ? "8px" : "12px",
    boxShadow:
      hovered && interactive
        ? "0 8px 25px rgba(0,0,0,0.15)"
        : "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease-in-out",
    transform:
      hovered && interactive && !isMobile
        ? "translateY(-2px)"
        : "translateY(0)",
    cursor: interactive ? "pointer" : "default",
    border: status ? `3px solid ${getStatusColor()}` : "1px solid #e5e7eb",
    padding: isMobile ? "16px" : padding,
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div
      style={{ ...baseStyles, ...style }}
      className={className}
      onClick={interactive ? onClick : undefined}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
    >
      {/* Status Indicator */}
      {status && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: getStatusColor(),
          }}
        />
      )}

      {/* Header */}
      {(title || subtitle) && (
        <div style={{ marginBottom: title && subtitle ? "16px" : "12px" }}>
          {title && (
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: Colors.MainHeading,
                margin: 0,
                marginBottom: subtitle ? "4px" : 0,
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: 0,
                fontWeight: "400",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div>{children}</div>

      {/* Interactive Indicator */}
      {interactive && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            fontSize: "18px",
            color: Colors.MediumGreen,
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          →
        </div>
      )}
    </div>
  );
};

export default Card;
