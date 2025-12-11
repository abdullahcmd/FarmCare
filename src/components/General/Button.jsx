import React, { useState } from "react";

const CustomButton = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  style,
  isHovered,
  setIsHovered,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "5px",
        fontSize: "16px",
        fontWeight: "bold",
        transition: "0.3s",
        ...style,
      }}
    >
      {text}
    </button>
  );
};

export default CustomButton;
