import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PawPrint, Stethoscope, DollarSign, FileText, Settings, Search, Moon, Bell } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Animals", icon: PawPrint, path: "/animals" },
  { label: "Medical", icon: Stethoscope, path: "/medical" },
  { label: "Financial", icon: DollarSign, path: "/financial" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-40 border-r border-border flex flex-col">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
          <Settings className="h-5 w-5 text-foreground" />
          <span className="font-semibold text-foreground text-sm">Shelter Manager</span>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 mx-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-center">
            <span className="text-muted-foreground text-xs">⚡</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center justify-end gap-3 px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search animals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary text-foreground text-sm pl-9 pr-12 py-1.5 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-ring w-52"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-mono">⌘K</kbd>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <Moon className="h-4 w-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
          </button>
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">👤</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
