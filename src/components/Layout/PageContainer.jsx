import React from "react";
import { Colors } from "../../constants/colors";
import Breadcrumb from "../Navigation/Breadcrumb";

const PageContainer = ({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  loading = false,
  error = null,
  maxWidth = "1200px",
  style,
}) => {
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #e5e7eb",
            borderTop: `4px solid ${Colors.MainHeading}`,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div style={{ color: Colors.MainHeading, fontSize: "16px" }}>
          Loading...
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
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          flexDirection: "column",
          gap: "16px",
          padding: "24px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            color: "#f44336",
          }}
        >
          ⚠️
        </div>
        <div
          style={{
            color: "#f44336",
            fontSize: "18px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
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
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth,
        margin: "0 auto",
        padding: window.innerWidth < 768 ? "0 16px" : "0 24px",
        ...style,
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} />
      )}

      {/* Header */}
      {(title || subtitle || actions) && (
        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            justifyContent: "space-between",
            alignItems: window.innerWidth < 768 ? "stretch" : "flex-start",
            marginBottom: "24px",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            {title && (
              <h1
                style={{
                  fontSize: window.innerWidth < 768 ? "24px" : "32px",
                  fontWeight: "700",
                  color: Colors.MainHeading,
                  margin: 0,
                  marginBottom: subtitle ? "8px" : 0,
                  lineHeight: "1.2",
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  margin: 0,
                  fontWeight: "400",
                  lineHeight: "1.5",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
