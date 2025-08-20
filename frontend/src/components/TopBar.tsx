import { 
  Plus, 
  Clock, 
  Bell, 
  Search,
  Settings,
  User,
  ChevronDown,
  Zap,
  Target
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from './ui/utils';

interface TopBarProps {
  isCollapsed: boolean;
  onLogout?: () => void;
}

export function TopBar({ isCollapsed, onLogout }: TopBarProps) {
  const weeklyProgress = 67; // 67% of weekly goal
  const currentStreak = 15;

  return (
    <div className={cn(
      "fixed top-0 right-0 h-16 bg-background border-b border-border z-40 flex items-center justify-between px-6 transition-all duration-300",
      isCollapsed ? "left-16" : "left-64"
    )}>
      {/* Left side - Search and Quick Stats */}
      <div className="flex items-center space-x-6 flex-1 max-w-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search roadmaps, tasks, resources..."
            className="pl-10 bg-muted/30 border-border/50"
          />
        </div>
        
        {/* Quick Stats */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-lg">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">{weeklyProgress}%</span>
            <span className="text-xs text-blue-600">weekly goal</span>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-orange-50 rounded-lg">
            <Zap className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">{currentStreak}</span>
            <span className="text-xs text-orange-600">day streak</span>
          </div>
        </div>
      </div>

      {/* Right side - Actions and Profile */}
      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            New Roadmap
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Track Time
          </Button>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
            3
          </Badge>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 h-10">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-blue-600 text-white">AJ</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">Alex Johnson</div>
                <div className="text-xs text-muted-foreground">alex@example.com</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={onLogout}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}