import React from "react";
import { Colors } from "../../constants/colors";

const FormLayout = ({
  children,
  title,
  subtitle,
  onSubmit,
  loading = false,
  error = null,
  success = null,
  maxWidth = "600px",
  style,
}) => {
  return (
    <div
      style={{
        maxWidth,
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "32px",
        ...style,
      }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          {title && (
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: Colors.MainHeading,
                margin: 0,
                marginBottom: subtitle ? "8px" : 0,
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              style={{
                fontSize: "16px",
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

      {/* Success Message */}
      {success && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f0f9ff",
            border: `2px solid ${Colors.SuccessGreen}`,
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: Colors.SuccessGreen,
            }}
          >
            ✓
          </div>
          <div
            style={{
              color: Colors.SuccessGreen,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {typeof success === "string"
              ? success
              : "Operation completed successfully"}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fef2f2",
            border: "2px solid #f44336",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "#f44336",
            }}
          >
            ⚠
          </div>
          <div
            style={{
              color: "#f44336",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        </div>
      )}

      {/* Form Content */}
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {children}
      </form>

      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid #e5e7eb",
                borderTop: `3px solid ${Colors.MainHeading}`,
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div style={{ color: Colors.MainHeading, fontSize: "14px" }}>
              Processing...
            </div>
          </div>
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
      )}
    </div>
  );
};

export default FormLayout;
