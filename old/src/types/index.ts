export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TodoStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type Category =
  | 'work'
  | 'personal'
  | 'health'
  | 'education'
  | 'finance'
  | 'shopping'
  | 'home'
  | 'other';

export type TimeView = 'day' | 'week' | 'month';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  dueTime?: string;
  priority: Priority;
  status: TodoStatus;
  category: Category;
  tags: string[];
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  reminder?: Date;
  subtasks: Subtask[];
  attachments?: Attachment[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: Date;
}

export interface TodoFormData {
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: Priority;
  category: Category;
  tags: string[];
  progress?: number;
  reminder?: string;
}

export interface DashboardStats {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
  overdueTodos: number;
  completionRate: number;
  categoryStats: Record<Category, number>;
  priorityStats: Record<Priority, number>;
  weeklyProgress: {
    date: string;
    completed: number;
    total: number;
  }[];
}

export interface FilterState {
  search: string;
  category: Category | 'all';
  priority: Priority | 'all';
  status: TodoStatus | 'all';
  dateRange: {
    start?: Date;
    end?: Date;
  };
  tags: string[];
}

export interface UIState {
  sidebarOpen: boolean;
  currentView: TimeView;
  selectedDate: Date;
  modalOpen: boolean;
  editingTodo?: Todo;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

export interface AppState {
  todos: Todo[];
  filter: FilterState;
  ui: UIState;
  stats: DashboardStats;
}

export interface TimelineItem {
  todo: Todo;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  overlapping: boolean;
}

export interface CalendarDay {
  date: Date;
  todos: Todo[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface WeekDay {
  date: Date;
  todos: Todo[];
  hours: {
    hour: number;
    todos: Todo[];
  }[];
}

export interface ExportOptions {
  format: 'json' | 'pdf' | 'csv';
  dateRange: {
    start: Date;
    end: Date;
  };
  includeCompleted: boolean;
  categories: Category[];
}

export interface NotificationData {
  id: string;
  todoId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface DragItem {
  id: string;
  type: 'todo';
  todo: Todo;
}

export interface DropResult {
  draggedItem: DragItem;
  targetDate: Date;
  targetTime?: string;
}