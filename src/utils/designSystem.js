import { Colors } from "../constants/colors";

// Typography scale
export const typography = {
  sizes: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "28px",
    "4xl": "32px",
    "5xl": "36px",
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeights: {
    tight: "1.2",
    normal: "1.5",
    relaxed: "1.75",
  },
};

// Spacing scale (in pixels)
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "32px",
  "4xl": "40px",
  "5xl": "48px",
  "6xl": "64px",
};

// Border radius scale
export const borderRadius = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
};

// Shadow scale
export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 2px 8px rgba(0, 0, 0, 0.1)",
  lg: "0 4px 12px rgba(0, 0, 0, 0.15)",
  xl: "0 8px 25px rgba(0, 0, 0, 0.15)",
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Animation durations
export const durations = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
};

// Common style mixins
export const mixins = {
  // Flexbox utilities
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  flexBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },

  // Text utilities
  textEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  // Interactive states
  interactive: {
    cursor: "pointer",
    transition: `all ${durations.normal} ease-in-out`,
  },

  // Focus styles
  focusRing: {
    outline: "none",
    boxShadow: `0 0 0 3px ${Colors.MediumGreen}40`,
  },

  // Card styles
  card: {
    backgroundColor: "white",
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    padding: spacing["3xl"],
  },

  // Button base styles
  buttonBase: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    fontWeight: typography.weights.semibold,
    transition: `all ${durations.normal} ease-in-out`,
    cursor: "pointer",
    border: "none",
    outline: "none",
  },

  // Input base styles
  inputBase: {
    width: "100%",
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    border: "2px solid #d1d5db",
    fontSize: typography.sizes.base,
    transition: `all ${durations.normal} ease-in-out`,
    outline: "none",
  },
};

// Utility functions
export const utils = {
  // Get responsive value based on screen size
  getResponsiveValue: (mobile, tablet, desktop) => {
    const width = window.innerWidth;
    if (width < 768) return mobile;
    if (width < 1024) return tablet || mobile;
    return desktop || tablet || mobile;
  },

  // Generate consistent spacing
  getSpacing: (size) => spacing[size] || size,

  // Generate consistent colors with opacity
  getColorWithOpacity: (color, opacity) => {
    return `${color}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`;
  },

  // Check if device is mobile
  isMobile: () => window.innerWidth < 768,

  // Check if device is tablet
  isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,

  // Check if device is desktop
  isDesktop: () => window.innerWidth >= 1024,

  // Generate consistent component styles
  getComponentStyles: (variant, size, disabled = false) => {
    const baseStyles = { ...mixins.buttonBase };

    // Size styles
    switch (size) {
      case "sm":
        baseStyles.padding = `${spacing.sm} ${spacing.lg}`;
        baseStyles.fontSize = typography.sizes.sm;
        break;
      case "lg":
        baseStyles.padding = `${spacing.lg} ${spacing["2xl"]}`;
        baseStyles.fontSize = typography.sizes.lg;
        break;
      default: // md
        baseStyles.padding = `${spacing.md} ${spacing.xl}`;
        baseStyles.fontSize = typography.sizes.base;
    }

    // Variant styles
    switch (variant) {
      case "secondary":
        baseStyles.backgroundColor = "transparent";
        baseStyles.color = Colors.MainHeading;
        baseStyles.border = `2px solid ${Colors.MainHeading}`;
        break;
      case "danger":
        baseStyles.backgroundColor = "#f44336";
        baseStyles.color = "white";
        break;
      default: // primary
        baseStyles.backgroundColor = Colors.MainHeading;
        baseStyles.color = "white";
    }

    // Disabled styles
    if (disabled) {
      baseStyles.opacity = 0.6;
      baseStyles.cursor = "not-allowed";
    }

    return baseStyles;
  },
};

// Theme configuration
export const theme = {
  colors: Colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  durations,
  mixins,
  utils,
};

export default theme;
