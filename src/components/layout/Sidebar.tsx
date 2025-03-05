
import { Sidebar as SidebarComponent } from './sidebar/Sidebar';
import { SidebarProvider } from '@/contexts/SidebarContext';

export const Sidebar = () => {
  return (
    <SidebarProvider>
      <SidebarComponent />
    </SidebarProvider>
  );
};
