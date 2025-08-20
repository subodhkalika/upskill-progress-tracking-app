import { useEffect, useState } from 'react';
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
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';
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

export function TaskManager() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: '' });

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        // We need a way to get the milestoneId here.
        // For now, I'll pass a dummy one.
        const data = await fetchTasks('dummy-milestone-id');
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
      setOpenCreateDialog(false);
      setNewTask({ title: '' });
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleToggleComplete = async (task: any) => {
    try {
      const updatedTask = await updateTask(task.id, { completed: !task.completed });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <Skeleton className="h-8 w-1/2 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  

  const filterTasks = (status: string) => {
    if (status === 'all') return tasks;
    if (status === 'pending') return tasks.filter(task => !task.completed);
    if (status === 'completed') return tasks.filter(task => task.completed);
    return [];
  };

  const TaskCard = ({ task }: { task: any }) => (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <Checkbox 
              checked={task.completed}
              onCheckedChange={() => handleToggleComplete(task)}
              className="w-5 h-5"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 mr-4">
                <h3 className={`font-medium text-base lg:text-lg mb-2 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </h3>
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
                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTask(task.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 w-full lg:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new task</DialogTitle>
              <DialogDescription>
                Add a new task to your list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateTask}>Create</Button>
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
            <div className="text-2xl font-bold text-foreground">{tasks.length}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{filterTasks('pending').length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{filterTasks('completed').length}</div>
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
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {tasks
                  .filter(task => 
                    task.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <div className="space-y-4">
                {filterTasks('pending')
                  .filter(task => 
                    task.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="space-y-4">
                {filterTasks('completed')
                  .filter(task => 
                    task.title.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <div className="text-muted-foreground">0 tasks due</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">Tomorrow</div>
                  <div className="text-muted-foreground">0 tasks due</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">This Week</div>
                  <div className="text-muted-foreground">0 tasks due</div>
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