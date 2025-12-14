import React, { useState } from "react";
import { Colors } from "../../constants/colors";

const CustomButton = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  style,
  isHovered,
  setIsHovered,
}) => {
  const [internalHovered, setInternalHovered] = useState(false);
  const hovered = isHovered !== undefined ? isHovered : internalHovered;
  const setHovered = setIsHovered || setInternalHovered;

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: hovered ? Colors.MediumGreen : "transparent",
          color: hovered ? "white" : Colors.MainHeading,
          border: `2px solid ${Colors.MainHeading}`,
        };
      case "danger":
        return {
          backgroundColor: hovered ? "#d32f2f" : "#f44336",
          color: "white",
          border: "none",
        };
      case "success":
        return {
          backgroundColor: hovered ? Colors.DarkGreen : Colors.SuccessGreen,
          color: "white",
          border: "none",
        };
      default: // primary
        return {
          backgroundColor: hovered ? Colors.DarkGreen : Colors.MainHeading,
          color: "white",
          border: "none",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          padding: "8px 16px",
          fontSize: "14px",
        };
      case "large":
        return {
          padding: "16px 24px",
          fontSize: "18px",
        };
      default: // medium
        return {
          padding: "12px 20px",
          fontSize: "16px",
        };
    }
  };

  const baseStyles = {
    width: "100%",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    opacity: disabled ? 0.6 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    outline: "none",
    boxShadow:
      hovered && !disabled && !loading
        ? "0 4px 12px rgba(0,0,0,0.15)"
        : "0 2px 4px rgba(0,0,0,0.1)",
    transform:
      hovered && !disabled && !loading ? "translateY(-1px)" : "translateY(0)",
  };

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      onMouseEnter={() => !disabled && !loading && setHovered(true)}
      onMouseLeave={() => !disabled && !loading && setHovered(false)}
      style={{
        ...baseStyles,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
    >
      {loading && (
        <div
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid transparent",
            borderTop: "2px solid currentColor",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      )}
      {text}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
};

export default CustomButton;
