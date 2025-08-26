import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Building, 
  Users, 
  FileText, 
  DollarSign, 
  Wrench, 
  BarChart3,
  LogOut,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Properties", href: "/properties", icon: Building },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Leases", href: "/leases", icon: FileText },
  { name: "Payments", href: "/payments", icon: DollarSign },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-sidebar fixed h-full z-10 border-r-2 border-dashed border-gray-300">
      {/* Logo */}
      <div className="p-6 pb-8 relative">
      </div>
      
      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-sm font-medium transition-all duration-300 hover:bg-gray-50 group relative border-l-4",
                isActive 
                  ? "bg-gray-50 border-l-primary" 
                  : "text-sidebar-foreground hover:text-sidebar-primary border-l-transparent hover:border-l-gray-300"
              )}
              data-testid={`nav-link-${item.name.toLowerCase()}`}
            >
              <div className={cn(
                "w-6 h-6 sketch-icon flex items-center justify-center transition-all duration-300",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 group-hover:bg-gray-200 group-hover:text-primary"
              )}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className={cn(
                "transition-colors",
                isActive && "font-semibold text-gray-700"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
        
      {/* Logout */}
      <div className="absolute bottom-6 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent rounded-sm p-3 font-medium transition-all duration-300 border border-dashed border-transparent hover:border-gray-300"
          onClick={() => window.location.href = '/api/logout'}
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
