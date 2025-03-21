
import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, FileText, Users, MessageSquare } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

export const SidebarFooter = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn(
      "p-4 border-t mt-auto", 
      isDarkMode ? "border-[#1E2736]" : "border-gray-200"
    )}>
      <div className="space-y-4">
        <div>
          <h3 className={cn(
            "text-xs font-semibold mb-2",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            RESOURCES
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            <Link 
              to="/support" 
              className={cn(
                "flex items-center text-xs rounded-md px-2 py-1.5",
                isDarkMode 
                  ? "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
              Help & Support
            </Link>
            
            <Link 
              to="/documentation" 
              className={cn(
                "flex items-center text-xs rounded-md px-2 py-1.5",
                isDarkMode 
                  ? "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Documentation
            </Link>
            
            <Link 
              to="/community" 
              className={cn(
                "flex items-center text-xs rounded-md px-2 py-1.5",
                isDarkMode 
                  ? "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Community
            </Link>
            
            <Link 
              to="/contact" 
              className={cn(
                "flex items-center text-xs rounded-md px-2 py-1.5",
                isDarkMode 
                  ? "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              Contact Us
            </Link>
          </div>
        </div>
        
        <div className={cn(
          "text-center text-xs py-2",
          isDarkMode ? "text-gray-500" : "text-gray-400"
        )}>
          <p>© 2024 EverPay, Inc. All rights reserved.</p>
          <div className="flex justify-center space-x-2 mt-1">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <span>·</span>
            <Link to="/cookies" className="hover:underline">Cookies</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
