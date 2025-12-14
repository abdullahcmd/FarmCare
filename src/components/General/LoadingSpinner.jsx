import React from "react";
import { Colors } from "../../constants/colors";

const LoadingSpinner = ({
  size = "medium",
  color = Colors.MainHeading,
  text = "Loading...",
  showText = true,
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return "20px";
      case "large":
        return "48px";
      case "xlarge":
        return "64px";
      default: // medium
        return "32px";
    }
  };

  const getBorderWidth = () => {
    switch (size) {
      case "small":
        return "2px";
      case "large":
        return "4px";
      case "xlarge":
        return "6px";
      default: // medium
        return "3px";
    }
  };

  const spinnerSize = getSize();
  const borderWidth = getBorderWidth();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: showText ? "16px" : "0",
        ...style,
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `${borderWidth} solid #e5e7eb`,
          borderTop: `${borderWidth} solid ${color}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      {showText && (
        <div
          style={{
            color,
            fontSize:
              size === "small" ? "12px" : size === "large" ? "18px" : "14px",
            fontWeight: "500",
          }}
        >
          {text}
        </div>
      )}
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
    </div>
  );
};

export default LoadingSpinner;
