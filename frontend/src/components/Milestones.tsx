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
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/api';
import type { Roadmap } from '../types';
import type { Milestone } from '../types/milestones';
import type { Task } from '../types';
import { MilestoneItem } from './MilestoneItem';
import { TaskDetails } from './TaskDetails';

export function Milestones() {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roadmapData, milestonesData] = await Promise.all([
          apiClient.get(`/api/roadmaps/${roadmapId}`),
          apiClient.get(`/api/milestones?roadmapId=${roadmapId}`),
        ]);
        setRoadmap(roadmapData);
        setMilestones(milestonesData);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roadmapId]);

  const toggleMilestone = (milestoneId: string) => {
    const newExpanded = new Set(expandedMilestones);
    if (newExpanded.has(milestoneId)) {
      newExpanded.delete(milestoneId);
    } else {
      newExpanded.add(milestoneId);
    }
    setExpandedMilestones(newExpanded);
  };

  const openTaskDetails = (task: Task) => setSelectedTask(task);
  const closeTaskDetails = () => setSelectedTask(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!roadmap) return <div>Roadmap not found.</div>;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/roadmaps')} className="p-1">
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
              {milestones.filter(m => m.completed).length}/{milestones.length} milestones
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {roadmap.timeSpent}h spent
            </span>
            <div className="flex items-center space-x-2">
              <Progress value={roadmap.progress || 0} className="h-2 w-20" />
              <span>{roadmap.progress || 0}%</span>
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
            onToggle={() => toggleMilestone(milestone.id)}
            onTaskClick={openTaskDetails}
            getTasksForMilestone={(milestoneId: string) => milestoneId && milestone.tasks || []}
          />
        ))}
      </div>

      {/* Task Details Sidebar/Drawer */}
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
                  <TaskDetails taskId={selectedTask.id} />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Sheet open={!!selectedTask} onOpenChange={(open) => !open && closeTaskDetails()}>
              <SheetContent side="right" className="sm:max-w-lg overflow-y-auto p-6">
                <SheetHeader className="border-b border-border px-6 py-4">
                  <SheetTitle>Task Details</SheetTitle>
                  <SheetDescription>
                    View and manage task information, progress, and learning resources
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <TaskDetails taskId={selectedTask.id} />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </>
      )}
    </div>
  );
}