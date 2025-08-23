import { 
  Target, 
  Clock, 
  CheckCircle,
  Play,
  CheckSquare,
  Calendar,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { MilestoneStatus, type Milestone } from '../types/milestones';
import { type Task } from '../types';
import { TaskStatus } from '../types';
import { formatTime } from '../utils/time';
import { getPriorityColor, getStatusColor, getStatusIconColor, getTimelinePointStyle } from '../utils/badgeStyle';

interface MilestoneItemProps {
  milestone: Milestone;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: (milestoneId: string) => void;
  onTaskClick: (task: Task) => void;
  getTasksForMilestone: (milestoneId: string) => Task[];
}

export function MilestoneItem({ 
  milestone, 
  isLast, 
  isExpanded, 
  onToggle, 
  onTaskClick, 
  getTasksForMilestone 
}: MilestoneItemProps) {
  const milestoneTasks = getTasksForMilestone(milestone.id);
  const canExpand = milestone.status !== MilestoneStatus.LOCKED && milestoneTasks.length > 0;


  const getStatusIcon = (status: typeof MilestoneStatus[keyof typeof MilestoneStatus]) => {
    if (status === MilestoneStatus.COMPLETED) {
      return <CheckCircle className={`w-4 h-4 ${getStatusIconColor(status)}`} />;
    } else if (status === MilestoneStatus.ACTIVE) {
      return <Play className={`w-4 h-4 ${getStatusIconColor(status)}`} />;
    } else if (status === MilestoneStatus.LOCKED) {
      return <Target className={`w-4 h-4 ${getStatusIconColor(status)}`} />;
    }
    return <Target className={`w-4 h-4 ${getStatusIconColor(status)}`} />;
};
  

  const getDateDisplay = () => {
    if (!milestone.dueDate) {
      return formatTime(milestone.tasks.reduce((acc, task) => acc + (task.estimatedTime || 0), 0))
    };
    
    const now = new Date();
    const dueDate = new Date(milestone.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0 && diffDays <= 7) return `${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    
    return formatDate(milestone.dueDate);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-border"></div>
      )}
      
      {/* Timeline point */}
      <div className="relative flex items-start">
        <div className={`relative z-10 w-12 h-12 rounded-full border-4 shadow-lg ${getTimelinePointStyle(milestone.status)} flex items-center justify-center flex-shrink-0`}>
          {getStatusIcon(milestone.status)}
        </div>
        
        {/* Timeline content */}
        <div className="ml-6 flex-1 pb-8">
          <div className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Collapsible open={isExpanded} onOpenChange={() => canExpand && onToggle(milestone.id)}>
              <CollapsibleTrigger 
                className="w-full p-4 lg:p-6 text-left hover:bg-muted/30 transition-colors rounded-lg" 
                disabled={!canExpand}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-base lg:text-lg text-foreground">{milestone.title}</h3>
                        <Badge className={`text-xs border ${getStatusColor(milestone.status)}`} variant="outline">
                          {milestone.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className={isOverdue(milestone.dueDate) ? "text-red-500" : ""}>
                          {getDateDisplay()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <CheckSquare className="w-4 h-4 mr-1" />
                          {milestone.tasks.filter(task => task.status === TaskStatus.COMPLETED).length}/{milestone.tasks.length} tasks
                        </span>
                        <span>{milestone.tasks.filter(task => task.status === TaskStatus.COMPLETED).length / milestone.tasks.length * 100}% complete</span>
                      </div>
                      
                      {canExpand && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="mr-2">{isExpanded ? 'Collapse' : 'View Tasks'}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3">
                      <Progress value={milestone.tasks.filter(task => task.status === TaskStatus.COMPLETED).length / milestone.tasks.length * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="border-t border-border px-4 lg:px-6 pb-4 lg:pb-6">
                  <div className="pt-4 space-y-3">
                    {milestoneTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => onTaskClick(task)}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          {task.status === TaskStatus.COMPLETED ? (
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <Target className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm text-foreground truncate">{task.name}</h4>
                              <Badge className={`text-xs border ${getPriorityColor(task.priority)}`} variant="outline">
                                {task.priority}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(task.estimatedTime || 0)}
                              </span>
                              {task.dueDate && (
                                <span className={`flex items-center ${isOverdue(task.dueDate) ? 'text-red-500' : ''}`}>
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {formatDate(task.dueDate)}
                                </span>
                              )}
                              <span>{task.resources?.length || 0} resources</span>
                            </div>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
