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
import { useState } from 'react';

export function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const resources = [
    {
      id: 1,
      title: 'Node.js Complete Course - Build REST APIs',
      description: 'Comprehensive tutorial covering Node.js fundamentals and REST API development',
      type: 'video',
      url: 'https://youtube.com/course1',
      tags: ['Node.js', 'REST API', 'Backend'],
      roadmap: 'Backend Development',
      duration: '8h 30min',
      rating: 4.8,
      addedDate: '2 days ago',
      completed: false
    },
    {
      id: 2,
      title: 'System Design Interview Guide',
      description: 'Complete guide to acing system design interviews at top tech companies',
      type: 'book',
      url: 'https://amazon.com/system-design-book',
      tags: ['System Design', 'Interview', 'Architecture'],
      roadmap: 'System Design',
      duration: '320 pages',
      rating: 4.9,
      addedDate: '1 week ago',
      completed: true
    },
    {
      id: 3,
      title: 'AWS Documentation - EC2 User Guide',
      description: 'Official AWS documentation for Amazon Elastic Compute Cloud',
      type: 'article',
      url: 'https://docs.aws.amazon.com/ec2',
      tags: ['AWS', 'EC2', 'Cloud'],
      roadmap: 'Cloud Architecture',
      duration: 'Reference',
      rating: 4.5,
      addedDate: '3 days ago',
      completed: false
    },
    {
      id: 4,
      title: 'Docker Deep Dive Course',
      description: 'Master containerization with Docker from basics to advanced concepts',
      type: 'video',
      url: 'https://udemy.com/docker-course',
      tags: ['Docker', 'DevOps', 'Containers'],
      roadmap: 'DevOps Pipeline',
      duration: '12h 15min',
      rating: 4.7,
      addedDate: '5 days ago',
      completed: false
    },
    {
      id: 5,
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      description: 'Essential principles for writing maintainable and clean code',
      type: 'book',
      url: 'https://amazon.com/clean-code-book',
      tags: ['Clean Code', 'Best Practices', 'Programming'],
      roadmap: 'General Development',
      duration: '464 pages',
      rating: 4.9,
      addedDate: '2 weeks ago',
      completed: true
    },
    {
      id: 6,
      title: 'React Performance Optimization Techniques',
      description: 'Blog series covering advanced React performance optimization strategies',
      type: 'article',
      url: 'https://blog.example.com/react-performance',
      tags: ['React', 'Performance', 'Frontend'],
      roadmap: 'Frontend Development',
      duration: '15 min read',
      rating: 4.6,
      addedDate: '1 day ago',
      completed: false
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-red-500" />;
      case 'book': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'article': return <FileText className="w-5 h-5 text-green-500" />;
      default: return <Globe className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-50 text-red-700 border-red-200';
      case 'book': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'article': return 'bg-green-50 text-green-700 border-green-200';
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{resource.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <Badge className={`text-xs border ${getTypeColor(resource.type)}`} variant="outline">
                {resource.type}
              </Badge>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{resource.rating}</span>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between text-sm text-muted-foreground mb-4 gap-2 lg:gap-0">
              <span>{resource.duration}</span>
              <span>Added {resource.addedDate}</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap gap-1">
                {resource.tags.slice(0, 2).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{resource.tags.length - 2}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {resource.completed && (
                  <Badge className="text-xs bg-green-100 text-green-800" variant="secondary">
                    Completed
                  </Badge>
                )}
                <Button size="sm" variant="outline" className="h-8">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open
                </Button>
              </div>
            </div>
            
            <div>
              <Badge variant="outline" className="text-xs">
                {resource.roadmap}
              </Badge>
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
        <Button className="bg-green-600 hover:bg-green-700 w-full lg:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
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
            <div className="text-2xl font-bold text-foreground">24</div>
            <div className="text-sm text-muted-foreground">Total Resources</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">8</div>
            <div className="text-sm text-muted-foreground">Videos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-sm text-muted-foreground">Books</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">11</div>
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
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="book">Books</TabsTrigger>
              <TabsTrigger value="article">Articles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {resources
                  .filter(resource => 
                    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(resource => <ResourceCard key={resource.id} resource={resource} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="video" className="mt-0">
              <div className="space-y-4">
                {filterResources('video')
                  .filter(resource => 
                    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(resource => <ResourceCard key={resource.id} resource={resource} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="book" className="mt-0">
              <div className="space-y-4">
                {filterResources('book')
                  .filter(resource => 
                    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(resource => <ResourceCard key={resource.id} resource={resource} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="article" className="mt-0">
              <div className="space-y-4">
                {filterResources('article')
                  .filter(resource => 
                    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
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