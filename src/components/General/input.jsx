import React, { useState } from "react";
import { Colors } from "../../constants/colors";

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  success,
  required = false,
  disabled = false,
  style,
  newStyle,
  helperText,
}) => {
  const [focused, setFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return "#f44336";
    if (success) return Colors.SuccessGreen;
    if (focused) return Colors.MainHeading;
    return "#d1d5db";
  };

  const getBackgroundColor = () => {
    if (disabled) return "#f5f5f5";
    return Colors.textInputBackground;
  };

  return (
    <div style={{ width: "100%", ...newStyle }}>
      {/* Label */}
      {label && (
        <label
          style={{
            display: "block",
            textAlign: "left",
            marginBottom: "6px",
            fontWeight: "600",
            color: Colors.MainHeading,
            fontSize: "14px",
          }}
        >
          {label}
          {required && (
            <span style={{ color: "#f44336", marginLeft: "4px" }}>*</span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "12px 16px",
            color: disabled ? "#9ca3af" : Colors.MainHeading,
            borderRadius: "8px",
            backgroundColor: getBackgroundColor(),
            border: `2px solid ${getBorderColor()}`,
            outline: "none",
            boxSizing: "border-box",
            fontSize: "16px",
            fontWeight: "400",
            transition: "all 0.2s ease-in-out",
            cursor: disabled ? "not-allowed" : "text",
            ...style,
          }}
        />

        {/* Success/Error Icons */}
        {(success || error) && (
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              color: success ? Colors.SuccessGreen : "#f44336",
            }}
          >
            {success ? "✓" : "⚠"}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !error && !success && (
        <div
          style={{
            color: "#6b7280",
            fontSize: "12px",
            marginTop: "4px",
            display: "block",
          }}
        >
          {helperText}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          style={{
            color: Colors.SuccessGreen,
            fontSize: "12px",
            marginTop: "4px",
            display: "block",
            fontWeight: "500",
          }}
        >
          {typeof success === "string" ? success : "Valid input"}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            color: "#f44336",
            fontSize: "12px",
            marginTop: "4px",
            display: "block",
            fontWeight: "500",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default InputField;
