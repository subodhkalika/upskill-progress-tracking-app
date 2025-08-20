import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Play,
  Calendar,
  Award,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { fetchProgress, fetchRoadmaps } from '../services/api';
import { Skeleton } from './ui/skeleton';

export function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any>(null);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [progressData, roadmapsData] = await Promise.all([
          fetchProgress(),
          fetchRoadmaps(),
        ]);
        setProgress(progressData);
        setRoadmaps(roadmapsData);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <Skeleton className="h-8 w-1/2 mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  
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
        <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Welcome back, {user?.email}! 👋</h1>
        <p className="text-muted-foreground">Here's your learning progress and what's next on your journey.</p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Points</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{progress?.points}</p>
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
                <p className="text-xl lg:text-2xl font-bold text-foreground">{progress?.streaks} days</p>
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
                <p className="text-sm font-medium text-muted-foreground">Roadmaps</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{roadmaps.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">0%</p>
              </div>
              <div className="hidden md:block p-3 bg-purple-100 rounded-full">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
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
              {roadmaps.map((roadmap) => (
                <div key={roadmap.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">{roadmap.title}</h3>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
        </div>
      </div>
    </div>
  );
}