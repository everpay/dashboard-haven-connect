
import * as React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={className}
      style={{
        margin: "0 auto",
        width: "100%",
        maxWidth: "600px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
