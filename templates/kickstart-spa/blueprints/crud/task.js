/**
 * Task Blueprint
 *
 * Task/todo management with priorities, status tracking, and assignments.
 * Perfect for project management and todo applications.
 *
 * Usage:
 *   import { taskBlueprint } from './blueprints/crud/task.js';
 *
 *   // Complete CRUD setup
 *   F.crud('#tasks', taskBlueprint, {
 *       title: 'Task Management',
 *       apiEndpoint: '/api/tasks',
 *       columns: ['title', 'status', 'priority', 'assignee', 'dueDate']
 *   });
 *
 *   // Or use as form
 *   F.modal(taskBlueprint, {
 *       title: 'New Task',
 *       onSave: createTask
 *   });
 */

export const taskBlueprint = {
    // Basic Information
    title: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 200,
        label: 'Task Title',
        formConfig: {
            placeholder: 'Enter task title',
            tooltip: 'Brief description of the task',
            class: 'form-input-lg'
        }
    },
    description: {
        type: 'textarea',
        maxLength: 2000,
        rows: 4,
        label: 'Description',
        formConfig: {
            placeholder: 'Detailed task description...',
            tooltip: 'Full task details, requirements, and notes'
        }
    },

    // Status & Progress
    status: {
        type: 'select',
        required: true,
        options: [
            { value: 'backlog', label: '📋 Backlog' },
            { value: 'todo', label: '📝 To Do' },
            { value: 'in-progress', label: '🔄 In Progress' },
            { value: 'review', label: '👀 In Review' },
            { value: 'done', label: '✅ Done' },
            { value: 'blocked', label: '🚫 Blocked' }
        ],
        label: 'Status',
        formConfig: {
            tooltip: 'Current task status'
        }
    },
    progress: {
        type: 'number',
        min: 0,
        max: 100,
        label: 'Progress (%)',
        formConfig: {
            placeholder: '0',
            tooltip: 'Task completion percentage (0-100)'
        }
    },

    // Priority & Importance
    priority: {
        type: 'select',
        required: true,
        options: [
            { value: 'low', label: '🟢 Low' },
            { value: 'medium', label: '🟡 Medium' },
            { value: 'high', label: '🟠 High' },
            { value: 'critical', label: '🔴 Critical' }
        ],
        label: 'Priority',
        formConfig: {
            tooltip: 'Task priority level'
        }
    },
    urgent: {
        type: 'boolean',
        label: 'Urgent',
        formConfig: {
            tooltip: 'Mark as urgent (needs immediate attention)'
        }
    },

    // Assignment & Ownership
    assignee: {
        type: 'string',
        label: 'Assigned To',
        formConfig: {
            placeholder: 'username or email',
            tooltip: 'Person responsible for this task'
        }
    },
    reporter: {
        type: 'string',
        label: 'Reporter',
        formConfig: {
            placeholder: 'username or email',
            tooltip: 'Person who created this task'
        }
    },
    team: {
        type: 'select',
        options: [
            { value: '', label: 'No Team' },
            { value: 'engineering', label: 'Engineering' },
            { value: 'design', label: 'Design' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'sales', label: 'Sales' },
            { value: 'support', label: 'Support' }
        ],
        label: 'Team',
        formConfig: {
            tooltip: 'Team responsible for this task'
        }
    },

    // Scheduling
    dueDate: {
        type: 'date',
        label: 'Due Date',
        formConfig: {
            tooltip: 'When this task should be completed'
        }
    },
    startDate: {
        type: 'date',
        label: 'Start Date',
        formConfig: {
            tooltip: 'When work on this task begins'
        }
    },
    estimatedHours: {
        type: 'number',
        min: 0,
        label: 'Estimated Hours',
        formConfig: {
            placeholder: '0',
            tooltip: 'Estimated time to complete (in hours)'
        }
    },
    actualHours: {
        type: 'number',
        min: 0,
        label: 'Actual Hours',
        formConfig: {
            placeholder: '0',
            tooltip: 'Actual time spent on this task (in hours)'
        }
    },

    // Organization
    category: {
        type: 'select',
        options: [
            { value: '', label: 'No Category' },
            { value: 'feature', label: 'Feature' },
            { value: 'bug', label: 'Bug' },
            { value: 'improvement', label: 'Improvement' },
            { value: 'documentation', label: 'Documentation' },
            { value: 'testing', label: 'Testing' },
            { value: 'other', label: 'Other' }
        ],
        label: 'Category',
        formConfig: {
            tooltip: 'Task type or category'
        }
    },
    tags: {
        type: 'string',
        label: 'Tags',
        formConfig: {
            placeholder: 'frontend, urgent, v2.0',
            tooltip: 'Comma-separated tags for organization'
        }
    },
    project: {
        type: 'string',
        label: 'Project',
        formConfig: {
            placeholder: 'Project name or ID',
            tooltip: 'Associated project'
        }
    },
    milestone: {
        type: 'string',
        label: 'Milestone',
        formConfig: {
            placeholder: 'Sprint 5, Q1 2025, etc.',
            tooltip: 'Sprint, release, or milestone'
        }
    },

    // Dependencies & Blockers
    blockedBy: {
        type: 'string',
        label: 'Blocked By',
        formConfig: {
            placeholder: 'Task IDs (comma-separated)',
            tooltip: 'Tasks that must be completed first'
        }
    },
    blockerReason: {
        type: 'textarea',
        rows: 2,
        label: 'Blocker Reason',
        formConfig: {
            placeholder: 'Why is this task blocked?',
            tooltip: 'Explanation if task is blocked'
        }
    },

    // Additional Fields
    completed: {
        type: 'boolean',
        label: 'Completed',
        formConfig: {
            tooltip: 'Mark task as completed'
        }
    },
    archived: {
        type: 'boolean',
        label: 'Archived',
        formConfig: {
            tooltip: 'Archive this task (hide from active lists)'
        }
    }
};

/**
 * Simple task blueprint (minimal fields for quick entry)
 */
export const simpleTaskBlueprint = {
    title: taskBlueprint.title,
    description: taskBlueprint.description,
    status: taskBlueprint.status,
    priority: taskBlueprint.priority,
    assignee: taskBlueprint.assignee,
    dueDate: taskBlueprint.dueDate
};

/**
 * Todo list blueprint (lightweight for personal tasks)
 */
export const todoBlueprint = {
    title: {
        ...taskBlueprint.title,
        label: 'Todo Item'
    },
    completed: taskBlueprint.completed,
    dueDate: taskBlueprint.dueDate,
    priority: taskBlueprint.priority
};

/**
 * Kanban board blueprint (optimized for kanban views)
 */
export const kanbanTaskBlueprint = {
    title: taskBlueprint.title,
    description: taskBlueprint.description,
    status: taskBlueprint.status,
    priority: taskBlueprint.priority,
    assignee: taskBlueprint.assignee,
    dueDate: taskBlueprint.dueDate,
    tags: taskBlueprint.tags,
    estimatedHours: taskBlueprint.estimatedHours
};

/**
 * Bug report blueprint (specialized for bug tracking)
 */
export const bugReportBlueprint = {
    title: {
        ...taskBlueprint.title,
        label: 'Bug Title'
    },
    description: {
        ...taskBlueprint.description,
        label: 'Bug Description',
        required: true
    },
    status: taskBlueprint.status,
    priority: taskBlueprint.priority,
    assignee: taskBlueprint.assignee,
    severity: {
        type: 'select',
        required: true,
        options: [
            { value: 'minor', label: 'Minor' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'major', label: 'Major' },
            { value: 'critical', label: 'Critical' }
        ],
        label: 'Severity',
        formConfig: {
            tooltip: 'Impact severity of the bug'
        }
    },
    stepsToReproduce: {
        type: 'textarea',
        required: true,
        rows: 4,
        label: 'Steps to Reproduce',
        formConfig: {
            placeholder: '1. Go to...\n2. Click on...\n3. See error',
            tooltip: 'Detailed steps to reproduce the bug'
        }
    },
    expectedBehavior: {
        type: 'textarea',
        rows: 2,
        label: 'Expected Behavior',
        formConfig: {
            placeholder: 'What should happen?',
            tooltip: 'Expected vs actual behavior'
        }
    },
    actualBehavior: {
        type: 'textarea',
        rows: 2,
        label: 'Actual Behavior',
        formConfig: {
            placeholder: 'What actually happens?',
            tooltip: 'What is happening instead'
        }
    },
    environment: {
        type: 'string',
        label: 'Environment',
        formConfig: {
            placeholder: 'Browser, OS, version',
            tooltip: 'Browser, operating system, version'
        }
    }
};

/**
 * Example CRUD setup function
 */
export function createTaskCRUD(selector, options = {}) {
    const defaultOptions = {
        title: 'Task Management',
        apiEndpoint: '/api/tasks',
        columns: ['title', 'status', 'priority', 'assignee', 'dueDate', 'progress'],
        pageSize: 25,
        sortable: true,
        exportable: true,
        onBeforeSave: (data) => {
            // Parse tags
            if (data.tags && typeof data.tags === 'string') {
                data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
            }

            // Parse blocked by IDs
            if (data.blockedBy && typeof data.blockedBy === 'string') {
                data.blockedBy = data.blockedBy.split(',').map(id => id.trim()).filter(Boolean);
            }

            // Auto-set completed based on status
            if (data.status === 'done' && !data.completed) {
                data.completed = true;
            }

            return data;
        },
        onAfterSave: (data) => {
            E.toast(`Task "${data.title}" saved successfully!`, { type: 'success' });
        },
        onAfterDelete: (id) => {
            E.toast('Task deleted', { type: 'success' });
        }
    };

    return F.crud(selector, taskBlueprint, {
        ...defaultOptions,
        ...options
    });
}

/**
 * Example Kanban board setup
 */
export function createKanbanBoard(selector, tasks, options = {}) {
    // Group tasks by status
    const columns = {
        'backlog': { title: '📋 Backlog', tasks: [] },
        'todo': { title: '📝 To Do', tasks: [] },
        'in-progress': { title: '🔄 In Progress', tasks: [] },
        'review': { title: '👀 Review', tasks: [] },
        'done': { title: '✅ Done', tasks: [] }
    };

    tasks.forEach(task => {
        if (columns[task.status]) {
            columns[task.status].tasks.push(task);
        }
    });

    // Render kanban board (implement based on your UI needs)
    // This is a placeholder - implement based on your design
    console.log('Kanban board:', columns);

    return columns;
}
