
import * as React from "react";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  footer?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  footer = true,
}) => {
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
        color: "#333",
        lineHeight: 1.5,
      }}
    >
      {children}
      {footer && <Footer />}
    </div>
  );
};
