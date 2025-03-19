
import * as React from "react";

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 40 }) => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <img 
        src="https://kunmckljzbnqjaswihou.supabase.co/storage/v1/object/public/public/Everpay-icon.png" 
        alt="Everpay Logo" 
        width={size} 
        height={size} 
        style={{ marginRight: "8px" }} 
      />
      <span style={{ 
        fontSize: "24px", 
        fontWeight: "bold", 
        color: "#19363B", 
        verticalAlign: "middle"
      }}>
        everpay
      </span>
    </div>
  );
};
