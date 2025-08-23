import { useState, useEffect } from 'react';
import { 
  CheckCircle,
  Target,
  BookOpen,
  FileText,
  Video,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { apiClient } from '../utils/api';
import type { Task } from '../types';
import { ResourceType } from '../types';
import { getPriorityColor, getResourceStatusColor } from '../utils/badgeStyle';

interface TaskDetailsProps {
  taskId: string;
}

export function TaskDetails({ taskId }: TaskDetailsProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await apiClient.get(`/api/tasks/${taskId}`);
        setTask(data);
      } catch (err) {
        setError('Failed to fetch task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  /**
  * Get the icon for a resource type
  * @param type - The type of the resource
  * @returns The icon for the resource type
  */
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case ResourceType.VIDEO: return <Video className="w-4 h-4" />;
      case ResourceType.ARTICLE: return <FileText className="w-4 h-4" />;
      case ResourceType.BOOK: return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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

  if (loading) return <div>Loading task details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!task) return <div>Task not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          {task.status === 'COMPLETED' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Target className="w-5 h-5 text-blue-600" />
          )}
          <Badge className={`text-sm border ${getPriorityColor(task.priority)}`} variant="outline">
            {task.priority.toLowerCase()} priority
          </Badge>
          <Badge variant={task.status === 'COMPLETED' ? "default" : "secondary"} className="text-sm">
            {task.status.replace('_', ' ').toLowerCase()}
          </Badge>
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-3">{task.name}</h2>
        <p className="text-muted-foreground leading-relaxed">{task.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated Time</span>
            <span className="text-sm font-medium">{task.estimatedTime}h</span>
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
          Learning Resources ({task?.resources?.length})
        </h3>
        
        <div className="space-y-3">
          {task?.resources?.map((resource) => (
            <Card key={resource.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-muted rounded-lg">
                      {getResourceIcon(resource.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate mb-2">{resource.title}</h4>
                      {resource.description && (
                        <p className="text-xs text-muted-foreground mb-2">{resource.description}</p>
                      )}
                      
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {resource.type.toLowerCase()}
                          </Badge>
                          {resource.duration && (
                            <Badge variant="secondary" className="text-xs">
                              {resource.duration} min
                            </Badge>
                          )}
                          <Badge className={`text-xs border ${getResourceStatusColor(resource.status)}`} variant="outline">
                            {resource.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {resource.url && (
                            <Button variant="outline" size="sm" onClick={() => window.open(resource.url, '_blank')}>
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Open
                            </Button>
                          )}
                          <Button variant={resource.status === 'COMPLETED' ? "outline" : "default"} size="sm">
                            {resource.status === 'COMPLETED' ? 'Review' : 'Start'}
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