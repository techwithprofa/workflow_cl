import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isThisWeek, isThisMonth, isAfter, isBefore, startOfDay, endOfDay, addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Todo, Category, Priority, DashboardStats, FilterState } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, formatString: string = 'MMM d, yyyy'): string {
  return format(date, formatString);
}

export function isOverdue(todo: Todo): boolean {
  return todo.status !== 'completed' && isBefore(new Date(todo.dueDate), startOfDay(new Date()));
}

export function isDueToday(todo: Todo): boolean {
  return isToday(new Date(todo.dueDate));
}

export function isDueThisWeek(todo: Todo): boolean {
  return isThisWeek(new Date(todo.dueDate), { weekStartsOn: 1 });
}

export function isDueThisMonth(todo: Todo): boolean {
  return isThisMonth(new Date(todo.dueDate));
}

export function getDueDateLabel(todo: Todo): string {
  if (todo.status === 'completed') {
    return 'Completed';
  }

  if (isOverdue(todo)) {
    return 'Overdue';
  }

  if (isDueToday(todo)) {
    return 'Due Today';
  }

  if (isDueThisWeek(todo)) {
    return 'Due This Week';
  }

  if (isDueThisMonth(todo)) {
    return 'Due This Month';
  }

  return formatDate(todo.dueDate);
}

export function getTodoProgress(todo: Todo): number {
  if (todo.status === 'completed') return 100;
  if (todo.status === 'cancelled') return 0;

  const completedSubtasks = todo.subtasks.filter(st => st.completed).length;
  const totalSubtasks = todo.subtasks.length;

  if (totalSubtasks === 0) return todo.progress || 0;

  return Math.round((completedSubtasks / totalSubtasks) * 100);
}

export function calculateStats(todos: Todo[]): DashboardStats {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.status === 'completed').length;
  const pendingTodos = todos.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
  const overdueTodos = todos.filter(t => isOverdue(t)).length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const categoryStats = todos.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  const priorityStats = todos.reduce((acc, todo) => {
    acc[todo.priority] = (acc[todo.priority] || 0) + 1;
    return acc;
  }, {} as Record<Priority, number>);

  // Calculate weekly progress
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dayTodos = todos.filter(todo =>
      format(new Date(todo.dueDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    return {
      date: format(date, 'EEE'),
      completed: dayTodos.filter(t => t.status === 'completed').length,
      total: dayTodos.length,
    };
  });

  return {
    totalTodos,
    completedTodos,
    pendingTodos,
    overdueTodos,
    completionRate,
    categoryStats,
    priorityStats,
    weeklyProgress,
  };
}

export function filterTodos(todos: Todo[], filters: Partial<FilterState>): Todo[] {
  return todos.filter(todo => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!todo.title.toLowerCase().includes(searchLower) &&
          !todo.description?.toLowerCase().includes(searchLower) &&
          !todo.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
        return false;
      }
    }

    // Category filter
    if (filters.category !== 'all' && todo.category !== filters.category) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && todo.priority !== filters.priority) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && todo.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange?.start && isBefore(new Date(todo.dueDate), filters.dateRange.start)) {
      return false;
    }

    if (filters.dateRange?.end && isAfter(new Date(todo.dueDate), filters.dateRange.end)) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0 && !filters.tags.some(tag => todo.tags.includes(tag))) {
      return false;
    }

    return true;
  });
}

export function sortTodos(todos: Todo[], sortBy: string = 'dueDate'): Todo[] {
  return [...todos].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function exportToJSON(data: any): string {
  return JSON.stringify(data, null, 2);
}

export function downloadFile(content: string, filename: string, type: string = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return days;
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }

  return days;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}