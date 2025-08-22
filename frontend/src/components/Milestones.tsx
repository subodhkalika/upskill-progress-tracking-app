import { 
  Target, 
  Clock, 
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';
import { useState, useEffect } from 'react';
import type { Roadmap } from '../types';
import type { Milestone, Task } from '../types/milestones';
import { MilestoneItem } from './MilestoneItem';
import { TaskDetails } from './TaskDetails';

interface MilestonesProps {
  roadmap: Roadmap;
  onBack: () => void;
}

export function Milestones({ roadmap, onBack }: MilestonesProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sample data - in a real app, this would come from props or API
  const milestones: Milestone[] = [
    {
      id: 1,
      title: 'Node.js Fundamentals',
      description: 'Learn the basics of Node.js runtime and core modules',
      progress: 100,
      totalTasks: 4,
      completedTasks: 4,
      estimatedTime: '1 week',
      timeSpent: '6.5h',
      status: 'completed',
      roadmapId: 1
    },
    {
      id: 2,
      title: 'Express.js Framework',
      description: 'Build web applications and APIs with Express.js',
      progress: 75,
      totalTasks: 5,
      completedTasks: 3,
      estimatedTime: '1.5 weeks',
      timeSpent: '8.2h',
      status: 'active',
      dueDate: '2024-09-15',
      roadmapId: 1
    },
    {
      id: 3,
      title: 'Database Integration',
      description: 'Connect to databases using MongoDB and PostgreSQL',
      progress: 30,
      totalTasks: 6,
      completedTasks: 2,
      estimatedTime: '2 weeks',
      timeSpent: '3.1h',
      status: 'active',
      dueDate: '2024-09-30',
      roadmapId: 1
    },
    {
      id: 4,
      title: 'Authentication & Security',
      description: 'Implement user authentication and security best practices',
      progress: 0,
      totalTasks: 4,
      completedTasks: 0,
      estimatedTime: '1.5 weeks',
      timeSpent: '0h',
      status: 'locked',
      roadmapId: 1
    }
  ];

  const tasks: Task[] = [
    {
      id: 1,
      title: 'Setup Express Server',
      description: 'Create a basic Express.js server with essential middleware configuration. Learn about routing, error handling, and server setup best practices.',
      completed: true,
      estimatedTime: '2h',
      timeSpent: '1.5h',
      priority: 'high',
      dueDate: '2024-08-25',
      milestoneId: 2,
      resources: [
        {
          id: 1,
          title: 'Express.js Official Documentation',
          type: 'documentation',
          url: 'https://expressjs.com/',
          completed: true,
          description: 'Official guide to Express.js framework'
        },
        {
          id: 2,
          title: 'Building Your First Express Server',
          type: 'video',
          duration: '25 min',
          completed: true,
          description: 'Step-by-step video tutorial'
        },
        {
          id: 3,
          title: 'Express Middleware Deep Dive',
          type: 'article',
          completed: true,
          description: 'Understanding middleware in Express'
        }
      ]
    },
    {
      id: 2,
      title: 'Create REST API Endpoints',
      description: 'Build comprehensive CRUD operations for your application. Learn about HTTP methods, status codes, and API design principles.',
      completed: true,
      estimatedTime: '3h',
      timeSpent: '2.8h',
      priority: 'high',
      dueDate: '2024-08-27',
      milestoneId: 2,
      resources: [
        {
          id: 4,
          title: 'REST API Design Best Practices',
          type: 'article',
          completed: true,
          description: 'Comprehensive guide to API design'
        },
        {
          id: 5,
          title: 'HTTP Status Codes Reference',
          type: 'documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
          completed: true,
          description: 'Complete reference for HTTP status codes'
        }
      ]
    },
    {
      id: 3,
      title: 'Error Handling Middleware',
      description: 'Implement comprehensive error handling to make your API robust and user-friendly. Learn about different error types and response formats.',
      completed: false,
      estimatedTime: '2h',
      timeSpent: '0.5h',
      priority: 'medium',
      dueDate: '2024-08-30',
      milestoneId: 2,
      resources: [
        {
          id: 6,
          title: 'Error Handling in Express',
          type: 'video',
          duration: '35 min',
          completed: false,
          description: 'Complete guide to error handling'
        },
        {
          id: 7,
          title: 'Custom Error Classes',
          type: 'article',
          completed: false,
          description: 'Creating custom error types'
        }
      ]
    },
    {
      id: 4,
      title: 'Input Validation',
      description: 'Add robust request validation using middleware to ensure data integrity and security.',
      completed: false,
      estimatedTime: '1.5h',
      timeSpent: '0h',
      priority: 'medium',
      dueDate: '2024-09-02',
      milestoneId: 2,
      resources: [
        {
          id: 8,
          title: 'Joi Validation Library',
          type: 'documentation',
          url: 'https://joi.dev/',
          completed: false,
          description: 'Powerful validation library'
        },
        {
          id: 9,
          title: 'Input Validation Tutorial',
          type: 'video',
          duration: '28 min',
          completed: false,
          description: 'Hands-on validation implementation'
        }
      ]
    },
    {
      id: 5,
      title: 'API Testing Setup',
      description: 'Set up comprehensive testing for your API endpoints using modern testing frameworks.',
      completed: false,
      estimatedTime: '2.5h',
      timeSpent: '0h',
      priority: 'low',
      dueDate: '2024-09-05',
      milestoneId: 2,
      resources: [
        {
          id: 10,
          title: 'Jest API Testing Guide',
          type: 'article',
          completed: false,
          description: 'Complete testing setup guide'
        }
      ]
    }
  ];

  const toggleMilestone = (milestoneId: number) => {
    const newExpanded = new Set(expandedMilestones);
    if (newExpanded.has(milestoneId)) {
      newExpanded.delete(milestoneId);
    } else {
      newExpanded.add(milestoneId);
    }
    setExpandedMilestones(newExpanded);
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  const getTasksForMilestone = (milestoneId: number) => {
    return tasks.filter(task => task.milestoneId === milestoneId);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Roadmaps / {roadmap.title}
            </div>
          </div>
          
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">{roadmap.title}</h1>
          <p className="text-muted-foreground">{roadmap.description}</p>
          
          <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              {roadmap.completedMilestones}/{roadmap.totalMilestones} milestones
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {roadmap.timeSpent} spent
            </span>
            <div className="flex items-center space-x-2">
              <Progress value={roadmap.progress} className="h-2 w-20" />
              <span>{roadmap.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Click on milestones to expand and view tasks. Click tasks to see detailed information and resources.
        </div>
        
        {milestones.map((milestone, index) => (
          <MilestoneItem 
            key={milestone.id} 
            milestone={milestone} 
            isLast={index === milestones.length - 1}
            isExpanded={expandedMilestones.has(milestone.id)}
            onToggle={toggleMilestone}
            onTaskClick={openTaskDetails}
            getTasksForMilestone={getTasksForMilestone}
          />
        ))}
      </div>

      {/* Task Details Sidebar (Desktop) / Drawer (Mobile) */}
      {selectedTask && (
        <>
          {isMobile ? (
            <Drawer open={!!selectedTask} onOpenChange={(open) => !open && closeTaskDetails()}>
              <DrawerContent className="max-h-[80vh]">
                <DrawerHeader className="text-left">
                  <DrawerTitle>Task Details</DrawerTitle>
                  <DrawerDescription>
                    View and manage task information, progress, and learning resources
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4 overflow-y-auto">
                  <TaskDetails task={selectedTask} />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Sheet open={!!selectedTask} onOpenChange={(open) => !open && closeTaskDetails()}>
              <SheetContent side="right" className="sm:max-w-lg overflow-y-auto p-6">
                <SheetHeader>
                  <SheetTitle>Task Details</SheetTitle>
                  <SheetDescription>
                    View and manage task information, progress, and learning resources
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <TaskDetails task={selectedTask} />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </>
      )}
    </div>
  );
}
