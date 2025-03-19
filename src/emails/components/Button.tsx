
import * as React from "react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    display: "inline-block",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "100%",
    margin: "16px 0",
    textDecoration: "none",
    textAlign: "center",
    padding: "10px 16px",
    borderRadius: "4px",
    ...style,
  };

  return href ? (
    <a href={href} style={baseStyle} target="_blank">
      {children}
    </a>
  ) : (
    <button style={baseStyle}>{children}</button>
  );
};
