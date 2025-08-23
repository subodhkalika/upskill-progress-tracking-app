import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp,
  Play,
  Calendar,
  Award,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  const activeRoadmaps = [
    { id: 1, title: 'Backend Development', progress: 65, milestones: 8, completed: 5, timeSpent: '28.5h', lastActivity: '2h ago' },
    { id: 2, title: 'Cloud Architecture', progress: 30, milestones: 12, completed: 4, timeSpent: '18.3h', lastActivity: '1 day ago' },
    { id: 3, title: 'System Design', progress: 85, milestones: 6, completed: 5, timeSpent: '22.1h', lastActivity: '5h ago' },
  ];

  const weeklyStats = {
    learningTime: '12.5h',
    streak: 15,
    milestonesCompleted: 3,
    weeklyGoal: 15,
    completionRate: 78
  };

  const recentActivity = [
    { type: 'completed', title: 'REST API Fundamentals', roadmap: 'Backend Development', time: '2h ago', icon: '✅' },
    { type: 'started', title: 'Docker Containers', roadmap: 'DevOps Pipeline', time: 'Yesterday', icon: '🔄' },
    { type: 'milestone', title: 'Completed Milestone: Authentication', roadmap: 'Backend Development', time: '2 days ago', icon: '🎯' },
    { type: 'resource', title: 'Added: AWS Best Practices Guide', roadmap: 'Cloud Architecture', time: '3 days ago', icon: '📚' },
  ];

  const weeklyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.1 },
    { day: 'Fri', hours: 1.5 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 2.3 }
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Welcome back, {user?.name || 'Learner'}! 👋</h1>
        <p className="text-muted-foreground">Here's your learning progress and what's next on your journey.</p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{weeklyStats.learningTime}</p>
              </div>
              <div className="hidden md:block p-3 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={(parseFloat(weeklyStats.learningTime) / weeklyStats.weeklyGoal) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Goal: {weeklyStats.weeklyGoal}h/week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{weeklyStats.streak} days</p>
              </div>
              <div className="hidden md:block p-3 bg-orange-100 rounded-full">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-4 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2 days this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Milestones</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{weeklyStats.milestonesCompleted}</p>
              </div>
              <div className="hidden md:block p-3 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Completed this week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{weeklyStats.completionRate}%</p>
              </div>
              <div className="hidden md:block p-3 bg-purple-100 rounded-full">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-4 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Roadmaps - Takes 2 columns on desktop, full width on mobile */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Active Roadmaps
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeRoadmaps.map((roadmap) => (
                <div key={roadmap.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">{roadmap.title}</h3>
                    <Badge variant="secondary">
                      {roadmap.completed}/{roadmap.milestones}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{roadmap.progress}%</span>
                    </div>
                    <Progress value={roadmap.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {roadmap.timeSpent}
                      </span>
                      <span className="hidden md:block">Last: {roadmap.lastActivity}</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Play className="w-4 h-4 mr-1" />
                      Continue
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stacked on mobile, sidebar on desktop */}
        <div className="space-y-6">
          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground w-8">{day.day}</span>
                    <div className="flex-1 mx-3">
                      <div className="bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(day.hours / maxHours) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-12 text-right">{day.hours}h</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-lg">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.roadmap}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
