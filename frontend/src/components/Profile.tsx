import { useEffect, useState } from 'react';
import { 
  User, 
  Settings, 
  Tag,
  Edit,
  Save,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { fetchSettings, updateSettings } from '../services/api';
import { Skeleton } from './ui/skeleton';

export function Profile() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('Alex Johnson');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchSettings();
        setSettings(data);
      } catch (err) {
        setError('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleUpdateSettings = async (data: any) => {
    try {
      const updatedSettings = await updateSettings(data);
      setSettings(updatedSettings);
    } catch (err) {
      setError('Failed to update settings.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <Skeleton className="h-8 w-1/2 mb-6" />
        <Skeleton className="h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const userStats = {
    joinDate: user && user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
    totalHours: 0,
    roadmapsCompleted: 0,
    currentStreak: user?.progress?.streaks || 0,
    longestStreak: 0
  };

  const skills = [
    'React', 'Node.js', 'Python', 'AWS', 'Docker', 'System Design'
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and learning goals</p>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-0">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 lg:gap-0">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 lg:w-10 lg:h-10" />
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder-white/70 mb-2 text-lg lg:text-xl"
                  />
                ) : (
                  <h2 className="text-xl lg:text-2xl font-semibold">{userName}</h2>
                )}
                <p className="text-indigo-100 text-sm lg:text-base">{user?.email}</p>
                <Badge className="bg-white/20 text-white border-white/30 mt-2" variant="outline">
                  Free Plan
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 self-start lg:self-center"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold">{userStats.totalHours}h</div>
              <div className="text-xs lg:text-sm text-indigo-100">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold">{userStats.roadmapsCompleted}</div>
              <div className="text-xs lg:text-sm text-indigo-100">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold">{userStats.currentStreak}</div>
              <div className="text-xs lg:text-sm text-indigo-100">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold">{userStats.longestStreak}</div>
              <div className="text-xs lg:text-sm text-indigo-100">Best Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings (Full width on mobile, 2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg lg:text-xl">
                <Settings className="w-5 h-5 mr-2" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Notifications</div>
                    <div className="text-sm text-muted-foreground">Enable or disable notifications</div>
                  </div>
                  <Switch
                    checked={settings?.notificationsEnabled}
                    onCheckedChange={(checked) => handleUpdateSettings({ notificationsEnabled: checked })}
                  />
                </div>
                <Separator className="mt-4 lg:mt-6" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Theme</div>
                    <div className="text-sm text-muted-foreground">Choose your theme</div>
                  </div>
                  <Input
                    value={settings?.theme}
                    onChange={(e) => handleUpdateSettings({ theme: e.target.value })}
                    className="w-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg lg:text-xl">
                <User className="w-5 h-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium text-foreground">{userStats.joinDate}</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground text-sm lg:text-base truncate">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-muted-foreground">Account Type</span>
                <Badge variant="secondary">
                  Free Plan
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Skills & Achievements */}
        <div className="space-y-6">
          {/* Skills & Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Tag className="w-5 h-5 mr-2" />
                Skills & Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Tag className="w-4 h-4 mr-2" />
                Manage Skills
              </Button>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Achievements
                </span>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="text-xl">🚀</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">API Master</div>
                    <div className="text-xs text-muted-foreground">Completed 5 REST API milestones</div>
                    <div className="text-xs text-muted-foreground mt-1">2 days ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="text-xl">🔥</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">15-Day Streak</div>
                    <div className="text-xs text-muted-foreground">Consistent learning for 15 days</div>
                    <div className="text-xs text-muted-foreground mt-1">Today</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="text-xl">📚</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">Bookworm</div>
                    <div className="text-xs text-muted-foreground">Completed 3 technical books</div>
                    <div className="text-xs text-muted-foreground mt-1">1 week ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Export Learning Data
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Help & Support
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                onClick={logout}
              >
                Sign Out
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}