
import { SidebarNew } from './sidebar/SidebarNew';
import { SidebarProvider } from '@/contexts/SidebarContext';

export const Sidebar = () => {
  return (
    <SidebarProvider>
      <SidebarNew />
    </SidebarProvider>
  );
};
