
import * as React from "react";

interface TextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <p
      style={{
        fontSize: "16px",
        lineHeight: "1.5",
        margin: "16px 0",
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  );
};
