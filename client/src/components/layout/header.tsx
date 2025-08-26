import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Search, Bell } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications] = useState([
    { id: 1, message: "New maintenance request submitted", type: "info" },
    { id: 2, message: "Payment overdue for Property #101", type: "warning" },
    { id: 3, message: "Lease renewal due next month", type: "info" }
  ]);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getDisplayName = (firstName?: string, lastName?: string) => {
    if (firstName || lastName) {
      return `${firstName || ''} ${lastName || ''}`.trim();
    }
    return user?.email || 'User';
  };

  return (
    <header className="bg-white border-b-2 border-dashed border-gray-300 sticky top-0 z-50 relative">
      <div className="px-8 py-6 flex items-center justify-between">
        <div>
          <Logo size="lg" showText={false} />
          {subtitle && (
            <p className="text-muted-foreground mt-2 text-base" data-testid="text-page-subtitle">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search properties, tenants..."
              className="pl-12 pr-4 py-3 w-80 rounded-sm border-2 border-dashed border-gray-300 focus:border-primary focus:ring-2 focus:ring-gray-200 bg-white transition-all duration-300"
              data-testid="input-search"
            />
          </div>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative p-3 text-muted-foreground hover:text-primary rounded-sm hover:bg-gray-50 transition-all duration-300 border border-dashed border-transparent hover:border-gray-300"
            onClick={() => {
              toast({
                title: "Notifications",
                description: `You have ${notifications.length} new notifications`,
                duration: 3000,
              });
            }}
            data-testid="button-notifications"
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm"></span>
            )}
          </Button>
          
          {/* User Menu */}
          <div className="flex items-center space-x-3 bg-gray-50 rounded-sm p-3 hover:bg-gray-100 transition-all duration-300 cursor-pointer border-2 border-dashed border-gray-300">
            <Avatar data-testid="avatar-user" className="w-10 h-10">
              <AvatarImage src={user?.profileImageUrl || ''} />
              <AvatarFallback className="bg-primary text-white font-semibold">
                {getInitials(user?.firstName, user?.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block pr-2">
              <p className="text-sm font-semibold text-foreground" data-testid="text-user-name">
                {getDisplayName(user?.firstName, user?.lastName)}
              </p>
              <p className="text-xs text-primary font-medium" data-testid="text-user-role">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
