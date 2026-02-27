import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, LayoutDashboard, Bell, Users, Settings, LogOut, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const navItems: Record<string, { label: string; icon: ReactNode; path: string }[]> = {
  admin: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
    { label: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
    { label: 'Thresholds', icon: <Settings className="w-5 h-5" />, path: '/admin/thresholds' },
    { label: 'Alerts', icon: <Bell className="w-5 h-5" />, path: '/admin/alerts' },
  ],
  doctor: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/doctor/dashboard' },
    { label: 'Patients', icon: <Users className="w-5 h-5" />, path: '/doctor/patients' },
    { label: 'Alerts', icon: <Bell className="w-5 h-5" />, path: '/doctor/alerts' },
  ],
  patient: [
    { label: 'Dashboard', icon: <Activity className="w-5 h-5" />, path: '/patient/dashboard' },
    { label: 'Alerts', icon: <Bell className="w-5 h-5" />, path: '/patient/alerts' },
  ],
};

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = navItems[user.role] || [];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: 'var(--gradient-hero)' }}>
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-primary-foreground font-bold text-lg">VitalWatch</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-primary text-sm font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</div>
              <div className="text-xs text-sidebar-foreground/50 capitalize">{user.role}</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </header>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
