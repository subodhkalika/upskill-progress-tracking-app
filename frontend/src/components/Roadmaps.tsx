import { useEffect, useState } from 'react';
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
import { fetchRoadmaps, createRoadmap, deleteRoadmap } from '../services/api';
import { Skeleton } from './ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newRoadmap, setNewRoadmap] = useState({ title: '', description: '' });

  useEffect(() => {
    const loadRoadmaps = async () => {
      try {
        setLoading(true);
        const data = await fetchRoadmaps();
        setRoadmaps(data);
      } catch (err) {
        setError('Failed to load roadmaps.');
      } finally {
        setLoading(false);
      }
    };

    loadRoadmaps();
  }, []);

  const handleCreateRoadmap = async () => {
    try {
      const createdRoadmap = await createRoadmap(newRoadmap);
      setRoadmaps([...roadmaps, createdRoadmap]);
      setOpenCreateDialog(false);
      setNewRoadmap({ title: '', description: '' });
    } catch (err) {
      setError('Failed to create roadmap.');
    }
  };

  const handleDeleteRoadmap = async (id: string) => {
    try {
      await deleteRoadmap(id);
      setRoadmaps(roadmaps.filter((r) => r.id !== id));
    } catch (err) {
      setError('Failed to delete roadmap.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <Skeleton className="h-8 w-1/2 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  
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
              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteRoadmap(roadmap.id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-base lg:text-lg text-foreground mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {roadmap.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{roadmap.description}</p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">0%</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            <span>0/0 milestones</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>0h spent</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Updated {new Date(roadmap.updatedAt).toLocaleDateString()}</span>
          <div className="space-x-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Continue
            </Button>
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
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 w-full lg:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Roadmap
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new roadmap</DialogTitle>
              <DialogDescription>
                Start a new learning journey by creating a roadmap.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newRoadmap.title}
                  onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newRoadmap.description}
                  onChange={(e) => setNewRoadmap({ ...newRoadmap, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateRoadmap}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">0h</div>
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
                roadmap.description.toLowerCase().includes(searchQuery.toLowerCase())
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