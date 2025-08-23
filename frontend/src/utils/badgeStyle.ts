import { ResourceStatus, ResourceType, TaskPriority } from "../types";
import { MilestoneStatus } from "../types/milestones";

/**
 * Get the color of the priority badge for a task
 * @param priority - The priority of the task
 * @returns The color of the priority badge for the task
 */
export function getPriorityColor(priority: typeof TaskPriority[keyof typeof TaskPriority]) {
    switch (priority) {
      case TaskPriority.HIGH: return 'bg-red-100 text-red-800 border-red-200';
      case TaskPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TaskPriority.LOW: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}
  
/**
 * Get the color of the timeline point for a milestone
 * @param milestoneStatus - The status of the milestone
 * @returns The color of the timeline point for the milestone
 */
export const getTimelinePointStyle = (milestoneStatus: typeof MilestoneStatus[keyof typeof MilestoneStatus]) => {
    switch (milestoneStatus) {
      case MilestoneStatus.COMPLETED:
        return 'bg-green-100 border-green-200 shadow-green-200/50';
      case MilestoneStatus.ACTIVE:
        return 'bg-blue-100 border-blue-200 shadow-blue-200/50';
      case MilestoneStatus.LOCKED:
        return 'bg-gray-100 border-gray-200 shadow-gray-200/50';
      default:
        return 'bg-gray-100 border-gray-200 shadow-gray-200/50';
    }
};

/**
 * Get the color of the status badge for a milestone
 * @param status - The status of the milestone
 * @returns The color of the status badge for the milestone
 */
export const getStatusColor = (status: typeof MilestoneStatus[keyof typeof MilestoneStatus]) => {
    switch (status) {
      case MilestoneStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case MilestoneStatus.ACTIVE: return 'bg-blue-100 text-blue-800 border-blue-200';
      case MilestoneStatus.LOCKED: return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

/**
 * Get the color of the status icon for a milestone timeline point
 * @param status - The status of the milestone timeline point
 * @returns The color of the status icon for the milestone timeline point
 */
export const getStatusIconColor = (status: typeof MilestoneStatus[keyof typeof MilestoneStatus]) => {
    switch (status) {
        case MilestoneStatus.COMPLETED: return 'text-green-600';
        case MilestoneStatus.ACTIVE: return 'text-blue-600';
        case MilestoneStatus.LOCKED: return 'text-gray-400';
        default: return 'text-gray-600';
    }
}


/**
 * Get the color of the status badge for a resource
 * @param type - The type of the resource
 * @returns The color of the status badge for the resource
 */
export const getResourceStatusColor = (status: ResourceStatus) => {
    switch (status) {
      case ResourceStatus.NOT_STARTED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case ResourceStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};