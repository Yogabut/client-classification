import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  UserCircle,
  Settings,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/reminders', icon: CheckSquare, label: 'Tasks & Reminders' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/admin', icon: Settings, label: 'Admin Panel' });
  }

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border sticky top-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >

      <div className="relative p-4 border-b border-sidebar-border flex items-center justify-center">
        <div className="flex items-center">
          <img
            src="/CRM-logo.png"
            alt="Logo"
            className="h-10 w-auto mx-auto"
          />
          {!collapsed && (
            <h1
              className="text-xl font-bold bg-gradient-to-r from-[#9699f6] to-[#5e38af] bg-clip-text text-transparent tracking-wide"
            >
              ClientsDesk
            </h1>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4 right-4 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              collapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* ===== NAVIGATION LINKS ===== */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                'hover:bg-sidebar-accent',
                isActive && 'bg-sidebar-accent text-sidebar-primary font-medium'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ===== LOGOUT BUTTON ===== */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};
