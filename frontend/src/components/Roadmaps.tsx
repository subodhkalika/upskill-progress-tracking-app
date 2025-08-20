import { 
  Plus, 
  Search, 
  Filter, 
  Target, 
  Clock, 
  CheckCircle,
  Play,
  MoreVertical,
  Grid3X3,
  List,
  SortAsc
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useState } from 'react';

export function Roadmaps() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const roadmaps = [
    {
      id: 1,
      title: 'Backend Development Mastery',
      description: 'From basics to advanced backend development with Node.js, Express, and databases',
      progress: 65,
      totalMilestones: 12,
      completedMilestones: 8,
      estimatedTime: '6 weeks',
      timeSpent: '28.5h',
      category: 'Backend',
      lastUpdated: '2 days ago',
      status: 'active',
      tags: ['Node.js', 'Express', 'Database']
    },
    {
      id: 2,
      title: 'Cloud Architecture with AWS',
      description: 'Design and implement scalable cloud solutions using Amazon Web Services',
      progress: 30,
      totalMilestones: 15,
      completedMilestones: 4,
      estimatedTime: '8 weeks',
      timeSpent: '18.3h',
      category: 'Cloud',
      lastUpdated: '1 day ago',
      status: 'active',
      tags: ['AWS', 'Cloud', 'Architecture']
    },
    {
      id: 3,
      title: 'System Design Fundamentals',
      description: 'Learn to design distributed systems, microservices, and handle scale',
      progress: 85,
      totalMilestones: 8,
      completedMilestones: 7,
      estimatedTime: '4 weeks',
      timeSpent: '22.1h',
      category: 'System Design',
      lastUpdated: '5 hours ago',
      status: 'active',
      tags: ['System Design', 'Scalability']
    },
    {
      id: 4,
      title: 'React Advanced Patterns',
      description: 'Master advanced React concepts, hooks, performance optimization, and testing',
      progress: 100,
      totalMilestones: 10,
      completedMilestones: 10,
      estimatedTime: '5 weeks',
      timeSpent: '35.2h',
      category: 'Frontend',
      lastUpdated: '1 week ago',
      status: 'completed',
      tags: ['React', 'Frontend', 'JavaScript']
    },
    {
      id: 5,
      title: 'DevOps Pipeline Setup',
      description: 'CI/CD, containerization, infrastructure as code, and monitoring',
      progress: 0,
      totalMilestones: 14,
      completedMilestones: 0,
      estimatedTime: '7 weeks',
      timeSpent: '0h',
      category: 'DevOps',
      lastUpdated: 'Never',
      status: 'planned',
      tags: ['DevOps', 'CI/CD', 'Docker']
    },
    {
      id: 6,
      title: 'Machine Learning Basics',
      description: 'Introduction to ML algorithms, data processing, and Python libraries',
      progress: 45,
      totalMilestones: 11,
      completedMilestones: 5,
      estimatedTime: '6 weeks',
      timeSpent: '15.7h',
      category: 'AI/ML',
      lastUpdated: '3 days ago',
      status: 'active',
      tags: ['Python', 'ML', 'Data Science']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string, progress: number) => {
    if (status === 'completed' || progress === 100) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (status === 'active') {
      return <Play className="w-4 h-4 text-blue-600" />;
    }
    return <Target className="w-4 h-4 text-gray-600" />;
  };

  const filterRoadmaps = (status: string) => {
    if (status === 'all') return roadmaps;
    return roadmaps.filter(roadmap => roadmap.status === status);
  };

  const RoadmapCard = ({ roadmap }: { roadmap: any }) => (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon(roadmap.status, roadmap.progress)}
            <Badge className={`text-xs border ${getStatusColor(roadmap.status)}`} variant="outline">
              {roadmap.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Roadmap</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-base lg:text-lg text-foreground mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {roadmap.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{roadmap.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {roadmap.tags.slice(0, 2).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {roadmap.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{roadmap.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{roadmap.progress}%</span>
          </div>
          <Progress value={roadmap.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            <span>{roadmap.completedMilestones}/{roadmap.totalMilestones} milestones</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{roadmap.timeSpent} spent</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Updated {roadmap.lastUpdated}</span>
          <div className="space-x-2">
            {roadmap.status === 'active' && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            )}
            {roadmap.status === 'planned' && (
              <Button size="sm" variant="outline">
                Start Learning
              </Button>
            )}
            {roadmap.status === 'completed' && (
              <Button size="sm" variant="outline">
                Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Learning Roadmaps</h1>
          <p className="text-muted-foreground">Manage your learning paths and track progress</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 w-full lg:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Roadmap
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 lg:space-x-4 flex-1 lg:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuItem>All Roadmaps</DropdownMenuItem>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Completed</DropdownMenuItem>
              <DropdownMenuItem>Planned</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden lg:flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortAsc className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Recently Updated</DropdownMenuItem>
                <DropdownMenuItem>Progress (High to Low)</DropdownMenuItem>
                <DropdownMenuItem>Title (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Time Spent</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview - Hidden on mobile to save space */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">6</div>
            <div className="text-sm text-muted-foreground">Total Roadmaps</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">1</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">119.8h</div>
            <div className="text-sm text-muted-foreground">Total Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmaps */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 w-full lg:w-auto">
          <TabsTrigger value="all">All Roadmaps</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className={`grid gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {roadmaps
              .filter(roadmap => 
                roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                roadmap.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map(roadmap => <RoadmapCard key={roadmap.id} roadmap={roadmap} />)}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className={`grid gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filterRoadmaps('active')
              .filter(roadmap => 
                roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                roadmap.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(roadmap => <RoadmapCard key={roadmap.id} roadmap={roadmap} />)}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <div className={`grid gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filterRoadmaps('completed')
              .filter(roadmap => 
                roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                roadmap.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(roadmap => <RoadmapCard key={roadmap.id} roadmap={roadmap} />)}
          </div>
        </TabsContent>
        
        <TabsContent value="planned" className="mt-0">
          <div className={`grid gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filterRoadmaps('planned')
              .filter(roadmap => 
                roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                roadmap.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(roadmap => <RoadmapCard key={roadmap.id} roadmap={roadmap} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}