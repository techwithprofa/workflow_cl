import { Category, Priority, TodoStatus } from '@/types';

export const CATEGORIES: Category[] = [
  'work',
  'personal',
  'health',
  'education',
  'finance',
  'shopping',
  'home',
  'other',
];

export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];

export const STATUSES: TodoStatus[] = ['pending', 'in-progress', 'completed', 'cancelled'];

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
  medium: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
  high: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700',
  urgent: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
};

export const PRIORITY_ICONS: Record<Priority, string> = {
  low: 'ArrowDown',
  medium: 'Minus',
  high: 'ArrowUp',
  urgent: 'AlertCircle',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  work: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700',
  personal: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-700',
  health: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700',
  education: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700',
  finance: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
  shopping: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-200 dark:border-cyan-700',
  home: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700',
  other: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  work: 'Briefcase',
  personal: 'User',
  health: 'Heart',
  education: 'BookOpen',
  finance: 'DollarSign',
  shopping: 'ShoppingCart',
  home: 'Home',
  other: 'MoreHorizontal',
};

export const STATUS_COLORS: Record<TodoStatus, string> = {
  pending: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
  completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
  cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
};

export const TIME_VIEWS = ['day', 'week', 'month'] as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const DEFAULT_REMINDER_MINUTES = 15;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const LOCAL_STORAGE_KEYS = {
  TODOS: 'todo-timeline-todos',
  UI_STATE: 'todo-timeline-ui',
  FILTERS: 'todo-timeline-filters',
  SETTINGS: 'todo-timeline-settings',
} as const;

export const DATE_FORMATS = {
  FULL: 'EEEE, MMMM d, yyyy',
  SHORT: 'MMM d, yyyy',
  TIME: 'h:mm a',
  DATETIME: 'MMM d, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
  INPUT_DATE: 'yyyy-MM-dd',
  INPUT_TIME: 'HH:mm',
} as const;