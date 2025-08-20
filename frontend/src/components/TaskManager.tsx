import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MoreHorizontal,
  SortAsc
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
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

export function TaskManager() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const tasks = [
    {
      id: 1,
      title: 'Complete REST API Authentication module',
      description: 'Implement JWT-based authentication with refresh tokens',
      roadmap: 'Backend Development',
      dueDate: 'Today',
      priority: 'high',
      status: 'pending',
      tags: ['API', 'Security'],
      estimatedTime: '2h',
      progress: 0
    },
    {
      id: 2,
      title: 'Watch Docker fundamentals video series',
      description: 'Complete chapters 1-3 on containerization basics',
      roadmap: 'DevOps Pipeline',
      dueDate: 'Tomorrow',
      priority: 'medium',
      status: 'in-progress',
      tags: ['Docker', 'Video'],
      estimatedTime: '1.5h',
      progress: 60
    },
    {
      id: 3,
      title: 'Read System Design Interview book - Ch 4',
      description: 'Rate limiting and load balancing concepts',
      roadmap: 'System Design',
      dueDate: 'Dec 28',
      priority: 'medium',
      status: 'pending',
      tags: ['Reading', 'System Design'],
      estimatedTime: '45min',
      progress: 0
    },
    {
      id: 4,
      title: 'Implement AWS S3 file upload feature',
      description: 'Add file upload with progress tracking and error handling',
      roadmap: 'Cloud Architecture',
      dueDate: 'Dec 30',
      priority: 'low',
      status: 'completed',
      tags: ['AWS', 'Hands-on'],
      estimatedTime: '3h',
      progress: 100
    },
    {
      id: 5,
      title: 'Practice LeetCode problems - Arrays',
      description: 'Solve 5 medium-level array problems and understand patterns',
      roadmap: 'Algorithm Practice',
      dueDate: 'Jan 2',
      priority: 'low',
      status: 'pending',
      tags: ['Coding', 'Practice'],
      estimatedTime: '2h',
      progress: 0
    },
    {
      id: 6,
      title: 'Build React component library',
      description: 'Create reusable components with TypeScript and Storybook',
      roadmap: 'Frontend Development',
      dueDate: 'Next week',
      priority: 'high',
      status: 'in-progress',
      tags: ['React', 'TypeScript'],
      estimatedTime: '4h',
      progress: 25
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };



  const filterTasks = (status: string) => {
    if (status === 'all') return tasks;
    return tasks.filter(task => task.status === status);
  };

  const TaskCard = ({ task }: { task: any }) => (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <Checkbox 
              checked={task.status === 'completed'}
              className="w-5 h-5"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 mr-4">
                <h3 className={`font-medium text-base lg:text-lg mb-2 ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-xs">
                {task.roadmap}
              </Badge>
              <Badge className={`text-xs border ${getPriorityColor(task.priority)}`} variant="outline">
                {task.priority} priority
              </Badge>
            </div>

            {task.status === 'in-progress' && task.progress > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{task.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between text-sm gap-2 lg:gap-0">
              <div className="flex items-center space-x-4 lg:space-x-6 text-muted-foreground">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {task.dueDate}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {task.estimatedTime}
                </span>
              </div>
              
              <div className="flex items-center justify-between lg:justify-end space-x-2">
                <div className="flex items-center space-x-1 lg:mr-2">
                  {task.tags.slice(0, 2).map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
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
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Task Manager</h1>
          <p className="text-muted-foreground">Organize and track your learning tasks</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 w-full lg:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 lg:space-x-4 flex-1 lg:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
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
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuItem>All Tasks</DropdownMenuItem>
              <DropdownMenuItem>High Priority</DropdownMenuItem>
              <DropdownMenuItem>Due Today</DropdownMenuItem>
              <DropdownMenuItem>Overdue</DropdownMenuItem>
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
                <DropdownMenuItem>Due Date</DropdownMenuItem>
                <DropdownMenuItem>Priority</DropdownMenuItem>
                <DropdownMenuItem>Progress</DropdownMenuItem>
                <DropdownMenuItem>Title (A-Z)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Stats - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">18</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Task Lists */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 w-full lg:w-auto">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {tasks
                  .filter(task => 
                    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.roadmap.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <div className="space-y-4">
                {filterTasks('pending')
                  .filter(task => 
                    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-0">
              <div className="space-y-4">
                {filterTasks('in-progress')
                  .filter(task => 
                    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="space-y-4">
                {filterTasks('completed')
                  .filter(task => 
                    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Quick Actions (Hidden on mobile to save space) */}
        <div className="hidden lg:block space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-foreground">Today</div>
                  <div className="text-muted-foreground">2 tasks due</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">Tomorrow</div>
                  <div className="text-muted-foreground">1 task due</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">This Week</div>
                  <div className="text-muted-foreground">5 tasks due</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Quick Task
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Review
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}