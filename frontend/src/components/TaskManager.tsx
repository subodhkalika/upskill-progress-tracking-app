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
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import type { Task } from '../types';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { ConfirmationModal } from './ConfirmationModal';
import { slugToTitle } from './ui/utils';

export function TaskManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiClient.get('/api/tasks');
        setTasks(data);
      } catch (err) {
        setError('Failed to fetch tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const openDeleteConfirmation = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await apiClient.delete(`/api/tasks/${taskToDelete}`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
    } catch (err) {
      console.error('Failed to delete task');
    } finally {
      setIsConfirmModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filterTasks = (status: string) => {
    if (status === 'all') return tasks;
    return tasks.filter(task => task.status === status);
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <Checkbox 
              checked={task.status === 'COMPLETED'}
              className="w-5 h-5"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 mr-4">
                <h3 className={`font-medium text-base lg:text-lg mb-2 ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.name}
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
                  <DropdownMenuItem onClick={() => openEditModal(task)}>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => openDeleteConfirmation(task.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-xs">
                {task.roadmap || 'General'}
              </Badge>
              <Badge className={`text-xs border ${getPriorityColor(task.priority)}`} variant="outline">
                {task.priority.toLowerCase()} priority
              </Badge>
            </div>

            {task.status === 'IN_PROGRESS' && Number(task?.progress) > 0 && (
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
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {task.estimatedTime}h
                </span>
                <Badge className={`text-xs border ${getStatusColor(task.status)}`} variant="outline">
                {slugToTitle(task.status)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between lg:justify-end space-x-2">
                <div className="flex items-center space-x-1 lg:mr-2">
                  {task?.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
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

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={handleTaskUpdated}
        task={selectedTask}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Are you sure you want to delete this task?"
        description="This action cannot be undone. This will permanently delete the task and all of its data."
      />
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Task Manager</h1>
          <p className="text-muted-foreground">Organize and track your learning tasks</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 w-full lg:w-auto" onClick={() => setIsCreateModalOpen(true)}>
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
            <div className="text-2xl font-bold text-foreground">{tasks.length}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{filterTasks('PENDING').length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filterTasks('IN_PROGRESS').length}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{filterTasks('COMPLETED').length}</div>
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
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
              <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {tasks
                  .filter(task => 
                    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="PENDING" className="mt-0">
              <div className="space-y-4">
                {filterTasks('PENDING')
                  .filter(task => 
                    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="IN_PROGRESS" className="mt-0">
              <div className="space-y-4">
                {filterTasks('IN_PROGRESS')
                  .filter(task => 
                    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
            
            <TabsContent value="COMPLETED" className="mt-0">
              <div className="space-y-4">
                {filterTasks('COMPLETED')
                  .filter(task => 
                    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
