import React from "react";
import { Colors } from "../../constants/colors";

const TextHeading = ({
  text,
  level = 2,
  align = "center",
  color = Colors.MainHeading,
  weight = "600",
  margin = "0 0 16px 0",
  style,
  newStyle, // Keep for backward compatibility
}) => {
  const getFontSize = () => {
    switch (level) {
      case 1:
        return "32px";
      case 2:
        return "28px";
      case 3:
        return "24px";
      case 4:
        return "20px";
      case 5:
        return "18px";
      case 6:
        return "16px";
      default:
        return "28px";
    }
  };

  const getLineHeight = () => {
    switch (level) {
      case 1:
        return "1.2";
      case 2:
        return "1.3";
      case 3:
        return "1.4";
      default:
        return "1.5";
    }
  };

  const HeadingTag = `h${level}`;

  const baseStyles = {
    color,
    textAlign: align,
    fontSize: getFontSize(),
    fontWeight: weight,
    lineHeight: getLineHeight(),
    margin,
    letterSpacing: level <= 2 ? "-0.025em" : "0",
  };

  return (
    <HeadingTag style={{ ...baseStyles, ...newStyle, ...style }}>
      {text}
    </HeadingTag>
  );
};

export default TextHeading;
