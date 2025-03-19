
import * as React from "react";

interface FooterProps {
  companyName?: string;
  companyLink?: string;
}

export const Footer: React.FC<FooterProps> = ({
  companyName = "Everpay",
  companyLink = "https://everpay.com",
}) => {
  return (
    <footer style={{ textAlign: "center", color: "#706f7b", fontSize: "12px", marginTop: "32px" }}>
      <p>
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </p>
      <p style={{ margin: "8px 0" }}>
        {companyLink && (
          <a
            href={companyLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#706f7b", textDecoration: "underline" }}
          >
            {companyName}
          </a>
        )}
      </p>
    </footer>
  );
};
