import React from "react";
import { Colors } from "../../constants/colors";

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  style,
  newStyle,
}) => {
  return (
    <div style={newStyle}>
      {/* 1. Label (Optional) */}
      {label && (
        <label
          style={{
            display: "block",
            textAlign: "left",
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {label}
        </label>
      )}

      {/* 2. The Input Box */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px",
          color: "black",
          borderRadius: "5px",
          backgroundColor: Colors.textInputBackground,
          border: error ? "1px solid red" : "1px solid #ccc", // Red border if error exists
          outline: "none",
          boxSizing: "border-box", // Crucial: prevents padding from breaking width
          fontSize: "13px",
          ...style, // Allows you to override styles from the parent
        }}
      />

      {/* 3. Error Message (Only shows if error prop is passed) */}
      {error && (
        <span
          style={{
            color: "red",
            fontSize: "12px",
            marginTop: "5px",
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
