import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Stethoscope
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: UserPlus, label: 'Add Patient', path: '/add-patient' },
  { icon: Users, label: 'View Patients', path: '/patients' },
  { icon: FileText, label: 'Active Cases', path: '/cases' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const doctorName = localStorage.getItem('doctorName') || 'Doctor';

  const handleLogout = () => {
    localStorage.removeItem('doctorName');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`bg-card border-r border-border transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } flex flex-col shadow-medium`}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="animate-fade-in">
                <h2 className="font-bold text-foreground">DentalCare Pro</h2>
                <p className="text-xs text-muted-foreground">Practice Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.path}
              variant={isActivePath(item.path) ? "default" : "ghost"}
              className={`w-full justify-start gap-3 transition-all duration-200 ${
                !sidebarOpen ? 'px-2' : ''
              } ${isActivePath(item.path) ? 'shadow-soft' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="animate-fade-in">{item.label}</span>}
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="animate-fade-in">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-accent"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Welcome, Dr. {doctorName.charAt(0).toUpperCase() + doctorName.slice(1)}
              </h1>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;