import { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Video, 
  Globe, 
  FileText,
  Star,
  ExternalLink,
  MoreVertical,
  Tag
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { fetchResources, createResource, updateResource, deleteResource } from '../services/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function ResourceLibrary() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', url: '', type: 'ARTICLE' });

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const data = await fetchResources();
        setResources(data);
      } catch (err) {
        setError('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const handleCreateResource = async () => {
    try {
      const createdResource = await createResource(newResource);
      setResources([...resources, createdResource]);
      setOpenCreateDialog(false);
      setNewResource({ title: '', url: '', type: 'ARTICLE' });
    } catch (err) {
      setError('Failed to create resource.');
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      await deleteResource(id);
      setResources(resources.filter((r) => r.id !== id));
    } catch (err) {
      setError('Failed to delete resource.');
    }
  };

  const handleToggleComplete = async (resource: any) => {
    try {
      const updatedResource = await updateResource(resource.id, { completed: !resource.completed });
      setResources(resources.map((r) => (r.id === resource.id ? updatedResource : r)));
    } catch (err) {
      setError('Failed to update resource.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <Skeleton className="h-8 w-1/2 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-5 h-5 text-red-500" />;
      case 'BOOK': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'ARTICLE': return <FileText className="w-5 h-5 text-green-500" />;
      default: return <Globe className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'bg-red-50 text-red-700 border-red-200';
      case 'BOOK': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ARTICLE': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filterResources = (type: string) => {
    if (type === 'all') return resources;
    return resources.filter(resource => resource.type === type);
  };

  const ResourceCard = ({ resource }: { resource: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            {getTypeIcon(resource.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-foreground line-clamp-2 mr-4">
                {resource.title}
              </h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" onClick={() => handleDeleteResource(resource.id)}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <Badge className={`text-xs border ${getTypeColor(resource.type)}`} variant="outline">
                {resource.type}
              </Badge>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2">
                {resource.completed && (
                  <Badge className="text-xs bg-green-100 text-green-800" variant="secondary">
                    Completed
                  </Badge>
                )}
                <Button size="sm" variant="outline" className="h-8" onClick={() => handleToggleComplete(resource)}>
                  Mark as {resource.completed ? 'Incomplete' : 'Complete'}
                </Button>
                <Button size="sm" variant="outline" className="h-8" asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </a>
                </Button>
              </div>
            </div>
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
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Resource Library</h1>
          <p className="text-muted-foreground">Centralized collection of your learning resources</p>
        </div>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 w-full lg:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new resource</DialogTitle>
              <DialogDescription>
                Add a new resource to your library.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select onValueChange={(value) => setNewResource({ ...newResource, type: value })} defaultValue={newResource.type}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="BOOK">Book</SelectItem>
                    <SelectItem value="ARTICLE">Article</SelectItem>
                    <SelectItem value="COURSE">Course</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateResource}>Create</Button>
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
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{resources.length}</div>
            <div className="text-sm text-muted-foreground">Total Resources</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{filterResources('VIDEO').length}</div>
            <div className="text-sm text-muted-foreground">Videos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filterResources('BOOK').length}</div>
            <div className="text-sm text-muted-foreground">Books</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{filterResources('ARTICLE').length}</div>
            <div className="text-sm text-muted-foreground">Articles</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Resource Lists - Takes 3 columns on desktop, full width on mobile */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 w-full lg:w-auto">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="VIDEO">Videos</TabsTrigger>
              <TabsTrigger value="BOOK">Books</TabsTrigger>
              <TabsTrigger value="ARTICLE">Articles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {resources
                  .filter(resource => 
                    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(resource => <ResourceCard key={resource.id} resource={resource} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="VIDEO" className="mt-0">
              <div className="space-y-4">
                {filterResources('VIDEO')
                  .filter(resource => 
                    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(resource => <ResourceCard key={resource.id} resource={resource} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="BOOK" className="mt-0">
              <div className="space-y-4">
                {filterResources('BOOK')
                  .filter(resource => 
                    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(resource => <ResourceCard key={resource.id} resource={resource} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="ARTICLE" className="mt-0">
              <div className="space-y-4">
                {filterResources('ARTICLE')
                  .filter(resource => 
                    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(resource => <ResourceCard key={resource.id} resource={resource} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Quick Filters and Actions (Hidden on mobile) */}
        <div className="hidden lg:block space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-4">Quick Filters</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Tag className="w-4 h-4 mr-2" />
                  Recently Added
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  Highly Rated
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Not Started
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Import from URL
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}