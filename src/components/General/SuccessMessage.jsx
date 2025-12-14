import React, { useEffect, useState } from "react";
import { Colors } from "../../constants/colors";

const SuccessMessage = ({
  message,
  title = "Success!",
  autoHide = true,
  duration = 3000,
  onHide,
  showIcon = true,
  style,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onHide) {
          onHide();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onHide]);

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        padding: "16px 20px",
        backgroundColor: "#f0f9ff",
        border: `2px solid ${Colors.SuccessGreen}`,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
        animation: "slideIn 0.3s ease-out",
        ...style,
      }}
    >
      {showIcon && (
        <div
          style={{
            fontSize: "20px",
            color: Colors.SuccessGreen,
            flexShrink: 0,
          }}
        >
          ✓
        </div>
      )}

      <div style={{ flex: 1 }}>
        {title && (
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: Colors.SuccessGreen,
              marginBottom: title && message ? "4px" : 0,
            }}
          >
            {title}
          </div>
        )}
        {message && (
          <div
            style={{
              fontSize: "14px",
              color: Colors.SuccessGreen,
              lineHeight: "1.4",
            }}
          >
            {message}
          </div>
        )}
      </div>

      {!autoHide && (
        <button
          onClick={() => {
            setVisible(false);
            if (onHide) {
              onHide();
            }
          }}
          style={{
            background: "none",
            border: "none",
            color: Colors.SuccessGreen,
            cursor: "pointer",
            fontSize: "16px",
            padding: "4px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(46, 125, 50, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
        >
          ×
        </button>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessMessage;
