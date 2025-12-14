import React from "react";
import { Colors } from "../../constants/colors";

const ErrorMessage = ({
  message,
  title = "Something went wrong",
  onRetry,
  retryText = "Try Again",
  showIcon = true,
  variant = "error", // error, warning, info
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return {
          backgroundColor: "#fff8e1",
          borderColor: Colors.WarningGreen,
          iconColor: Colors.WarningGreen,
          textColor: "#e65100",
          icon: "⚠️",
        };
      case "info":
        return {
          backgroundColor: "#e3f2fd",
          borderColor: Colors.MediumGreen,
          iconColor: Colors.MediumGreen,
          textColor: Colors.MainHeading,
          icon: "ℹ️",
        };
      default: // error
        return {
          backgroundColor: "#fef2f2",
          borderColor: "#f44336",
          iconColor: "#f44336",
          textColor: "#d32f2f",
          icon: "⚠️",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: variantStyles.backgroundColor,
        border: `2px solid ${variantStyles.borderColor}`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "16px",
        maxWidth: "500px",
        margin: "0 auto",
        ...style,
      }}
    >
      {showIcon && (
        <div
          style={{
            fontSize: "48px",
            color: variantStyles.iconColor,
          }}
        >
          {variantStyles.icon}
        </div>
      )}

      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: variantStyles.textColor,
            margin: "0 0 8px 0",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: variantStyles.textColor,
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "12px 24px",
            backgroundColor: Colors.MainHeading,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = Colors.DarkGreen;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = Colors.MainHeading;
          }}
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
