import { 
  CheckCircle,
  Target,
  BookOpen,
  FileText,
  Video,
  CheckSquare,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Task } from '../types/milestones';

interface TaskDetailsProps {
  task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'documentation': return <BookOpen className="w-4 h-4" />;
      case 'exercise': return <CheckSquare className="w-4 h-4" />;
      case 'quiz': return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800 border-red-200';
      case 'article': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'documentation': return 'bg-green-100 text-green-800 border-green-200';
      case 'exercise': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'quiz': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          {task.completed ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Target className="w-5 h-5 text-blue-600" />
          )}
          <Badge className={`text-sm border ${getPriorityColor(task.priority)}`} variant="outline">
            {task.priority} priority
          </Badge>
          <Badge variant={task.completed ? "default" : "secondary"} className="text-sm">
            {task.completed ? 'Completed' : 'In Progress'}
          </Badge>
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-3">{task.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{task.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated Time</span>
            <span className="text-sm font-medium">{task.estimatedTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Time Spent</span>
            <span className="text-sm font-medium">{task.timeSpent}</span>
          </div>
        </div>
        
        {task.dueDate && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Due Date</span>
              <span className={`text-sm font-medium ${isOverdue(task.dueDate) ? 'text-red-500' : ''}`}>
                {formatDate(task.dueDate)}
                {isOverdue(task.dueDate) && (
                  <span className="ml-2 text-xs">(Overdue)</span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          Learning Resources ({task.resources.length})
        </h3>
        
        <div className="space-y-3">
          {task.resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-muted rounded-lg">
                      {getResourceIcon(resource.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm text-foreground truncate">{resource.title}</h4>
                        <Badge className={`text-xs border ${getResourceTypeColor(resource.type)}`} variant="outline">
                          {resource.type}
                        </Badge>
                        {resource.duration && (
                          <Badge variant="secondary" className="text-xs">
                            {resource.duration}
                          </Badge>
                        )}
                      </div>
                      
                      {resource.description && (
                        <p className="text-xs text-muted-foreground mb-2">{resource.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={resource.completed ? "default" : "secondary"} className="text-xs">
                          {resource.completed ? 'Completed' : 'Not Started'}
                        </Badge>
                        
                        <div className="flex items-center space-x-2">
                          {resource.url && (
                            <Button variant="outline" size="sm" onClick={() => window.open(resource.url, '_blank')}>
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Open
                            </Button>
                          )}
                          <Button variant={resource.completed ? "outline" : "default"} size="sm">
                            {resource.completed ? 'Review' : 'Start'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
