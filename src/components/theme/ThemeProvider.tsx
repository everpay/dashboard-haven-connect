
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  forcedTheme?: Theme | null;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isDarkMode: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "everpay-ui-theme",
  forcedTheme = null,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  console.log("ThemeProvider rendering with theme:", theme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Clear existing theme classes first
    root.classList.remove("light", "dark");
    
    if (forcedTheme) {
      console.log("Applying forced theme:", forcedTheme);
      root.classList.add(forcedTheme);
      setIsDarkMode(forcedTheme === "dark");
      return;
    }
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      console.log("Applying system theme:", systemTheme);
      root.classList.add(systemTheme);
      setIsDarkMode(systemTheme === "dark");
      
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = () => {
        if (theme === "system") {
          root.classList.remove("light", "dark");
          root.classList.add(mediaQuery.matches ? "dark" : "light");
          setIsDarkMode(mediaQuery.matches);
          console.log("System theme changed to:", mediaQuery.matches ? "dark" : "light");
        }
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    
    console.log("Applying theme directly:", theme);
    root.classList.add(theme);
    setIsDarkMode(theme === "dark");
  }, [theme, forcedTheme]);

  const value = {
    theme,
    isDarkMode,
    setTheme: (newTheme: Theme) => {
      console.log("Setting theme to:", newTheme);
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
