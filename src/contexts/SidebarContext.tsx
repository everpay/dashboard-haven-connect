
import React, { createContext, useState, useContext } from 'react';

type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMenus: string[];
  setOpenMenus: React.Dispatch<React.SetStateAction<string[]>>;
  toggleMenu: (menu: string) => void;
  isMenuOpen: (menu: string) => boolean;
  toggleSidebar: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(['Transactions', 'Reports']);

  const toggleSidebar = () => setExpanded(!expanded);
  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);
  
  const toggleMenu = (menu: string) => {
    setOpenMenus(prevState => 
      prevState.includes(menu) 
        ? prevState.filter(item => item !== menu)
        : [...prevState, menu]
    );
  };

  const isMenuOpen = (menu: string) => openMenus.includes(menu);

  return (
    <SidebarContext.Provider value={{
      expanded,
      setExpanded,
      mobileOpen,
      setMobileOpen,
      openMenus,
      setOpenMenus,
      toggleMenu,
      isMenuOpen,
      toggleSidebar,
      toggleMobile,
      closeMobile
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
