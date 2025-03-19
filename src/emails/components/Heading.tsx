
import * as React from "react";

interface HeadingProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <h2
      style={{
        fontSize: "24px",
        fontWeight: 600,
        margin: "32px 0 24px",
        padding: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </h2>
  );
};
