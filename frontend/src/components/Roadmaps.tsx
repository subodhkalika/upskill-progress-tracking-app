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
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import type { Roadmap } from '../types';
import { CreateRoadmapModal } from './CreateRoadmapModal';

export function Roadmaps() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const data = await apiClient.get('/api/roadmaps');
        // Assuming the API returns an array of roadmaps
        // We'll add some frontend-specific calculations here
        console.log(data)
        const processedRoadmaps = data.map((roadmap: any) => ({
          ...roadmap,
          progress: Math.floor((roadmap.milestones?.filter((m: any) => m.completed)?.length / roadmap.milestones?.length) * 100) || 0,
          totalMilestones: roadmap.milestones?.length ?? 0,
          completedMilestones: roadmap.milestones?.filter((m: any) => m.completed)?.length ?? 0,
          tags: roadmap.skills?.map((s: any) => s.name),
        }));
        setRoadmaps(processedRoadmaps);
      } catch (err) {
        console.log(err)
        setError('Failed to fetch roadmaps.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleRoadmapCreated = (newRoadmap: Roadmap) => {
    setRoadmaps(prevRoadmaps => [
      ...prevRoadmaps,
      {
        ...newRoadmap,
        progress: 0,
        totalMilestones: 0,
        completedMilestones: 0,
        tags: [],
      }
    ]);
  };
  
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
            <span>{roadmap.timeSpent}h spent</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Updated {new Date(roadmap.lastUpdated).toLocaleDateString()}</span>
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <CreateRoadmapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRoadmapCreated={handleRoadmapCreated}
      />
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Learning Roadmaps</h1>
          <p className="text-muted-foreground">Manage your learning paths and track progress</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 w-full lg:w-auto" onClick={() => setIsModalOpen(true)}>
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
            <div className="text-2xl font-bold text-foreground">{roadmaps.length}</div>
            <div className="text-sm text-muted-foreground">Total Roadmaps</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filterRoadmaps('active').length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{filterRoadmaps('completed').length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{roadmaps.reduce((acc, curr) => acc + curr.timeSpent, 0).toFixed(1)}h</div>
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
                (roadmap.tags && roadmap.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
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