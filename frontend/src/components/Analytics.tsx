import { 
  TrendingUp, 
  Clock, 
  Target, 
  Calendar,
  Award,
  Zap,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function Analytics() {
  const weeklyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.1 },
    { day: 'Fri', hours: 1.5 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 2.3 }
  ];

  const monthlyStats = {
    totalHours: 48.5,
    milestonesCompleted: 12,
    streak: 15,
    averagePerDay: 1.6,
    completionRate: 78
  };

  const topSkills = [
    { skill: 'Backend Development', progress: 75, hours: 28.5 },
    { skill: 'System Design', progress: 65, hours: 22.1 },
    { skill: 'Cloud Architecture', progress: 45, hours: 18.3 },
    { skill: 'DevOps', progress: 30, hours: 12.7 },
    { skill: 'Algorithms', progress: 55, hours: 15.2 }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: 'API Master',
      description: 'Completed 5 REST API milestones',
      icon: '🚀',
      date: '2 days ago'
    },
    {
      id: 2,
      title: '7-Day Streak',
      description: 'Learned consistently for a week',
      icon: '🔥',
      date: '1 week ago'
    },
    {
      id: 3,
      title: 'System Designer',
      description: 'Finished System Design fundamentals',
      icon: '🏗️',
      date: '2 weeks ago'
    },
    {
      id: 4,
      title: 'Time Tracker',
      description: 'Logged 50 hours of learning',
      icon: '⏰',
      date: '3 weeks ago'
    }
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Learning Analytics</h1>
        <p className="text-muted-foreground">Track your progress and stay motivated with detailed insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{monthlyStats.totalHours}h</p>
              </div>
              <div className="hidden md:block p-3 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{monthlyStats.streak} days</p>
              </div>
              <div className="hidden md:block p-3 bg-orange-100 rounded-full">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Milestones</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{monthlyStats.milestonesCompleted}</p>
              </div>
              <div className="hidden md:block p-3 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{monthlyStats.averagePerDay}h</p>
              </div>
              <div className="hidden md:block p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section - Takes 2 columns on desktop, full width on mobile */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="mb-6 w-full lg:w-auto">
              <TabsTrigger value="weekly">Weekly Activity</TabsTrigger>
              <TabsTrigger value="skills">Skill Progress</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="mt-0 space-y-6">
              {/* Weekly Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <Calendar className="w-5 h-5 mr-2" />
                    This Week's Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 lg:space-y-4">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground w-8 lg:w-12">{day.day}</span>
                        <div className="flex-1 mx-3 lg:mx-4">
                          <div className="bg-muted rounded-full h-2 lg:h-3">
                            <div 
                              className="bg-blue-600 h-2 lg:h-3 rounded-full transition-all duration-500"
                              style={{ width: `${(day.hours / maxHours) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-foreground w-12 lg:w-16 text-right">{day.hours}h</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Total this week: </span>
                      {weeklyData.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goal Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col lg:flex-row lg:items-center justify-between text-lg lg:text-xl gap-2 lg:gap-0">
                    <span className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Weekly Goal
                    </span>
                    <Badge className="bg-green-100 text-green-800 w-fit" variant="secondary">
                      On Track
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress this week</span>
                      <span className="font-medium">17.4h / 20h</span>
                    </div>
                    <Progress value={87} className="h-2 lg:h-3" />
                    <div className="text-xs text-muted-foreground">
                      2.6h remaining to reach your weekly goal
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Skill Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 lg:space-y-6">
                    {topSkills.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground text-sm lg:text-base">{skill.skill}</span>
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <span className="text-xs lg:text-sm text-muted-foreground">{skill.hours}h</span>
                            <span className="text-xs lg:text-sm font-medium">{skill.progress}%</span>
                          </div>
                        </div>
                        <Progress value={skill.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monthly" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8 lg:py-12">
                  <p className="text-muted-foreground">Monthly trend charts will be available soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Stacked on mobile */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Award className="w-5 h-5 mr-2" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 lg:space-y-4">
                {recentAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg lg:text-xl">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <span className="text-xs text-muted-foreground">{achievement.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 mb-4">
                  <div className="w-full h-full bg-muted rounded-full"></div>
                  <div 
                    className="absolute top-0 left-0 w-full h-full rounded-full"
                    style={{ 
                      background: `conic-gradient(from 0deg, #10b981 0deg, #10b981 ${monthlyStats.completionRate * 3.6}deg, #e5e7eb ${monthlyStats.completionRate * 3.6}deg)` 
                    }}
                  ></div>
                  <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                    <span className="text-base lg:text-lg font-bold text-foreground">{monthlyStats.completionRate}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  You complete {monthlyStats.completionRate}% of your planned learning tasks
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}