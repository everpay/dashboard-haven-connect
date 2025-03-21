
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, isDarkMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`w-9 px-0 ${
            isDarkMode 
              ? "bg-[#1E2736] border-[#2E3746] text-white" 
              : "bg-white border-gray-200 text-gray-700"
          }`}
        >
          {isDarkMode ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`z-50 ${
          isDarkMode 
            ? "bg-[#1E2736] border-[#1E2736] text-white" 
            : "bg-white border-gray-200 text-gray-700"
        }`}
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={`cursor-pointer ${
            theme === 'light' 
              ? isDarkMode ? 'bg-[#2E3746]' : 'bg-gray-100' 
              : ''
          }`}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={`cursor-pointer ${
            theme === 'dark' 
              ? isDarkMode ? 'bg-[#2E3746]' : 'bg-gray-100'
              : ''
          }`}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={`cursor-pointer ${
            theme === 'system' 
              ? isDarkMode ? 'bg-[#2E3746]' : 'bg-gray-100'
              : ''
          }`}
        >
          <span className="mr-2">💻</span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
