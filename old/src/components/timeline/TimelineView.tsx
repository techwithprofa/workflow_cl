'use client';

import React from 'react';
import { format, startOfDay, endOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isSameDay, isSameWeek, isSameMonth, addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Todo, TimeView } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { TodoCard } from '@/components/todos/TodoCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ChevronLeft, ChevronRight, Calendar, Clock, List } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface TimelineViewProps {
  className?: string;
}

export function TimelineView({ className }: TimelineViewProps) {
  const { state, setUIState } = useApp();
  const { selectedDate, currentView } = state.ui;
  const { filteredTodos } = useApp();

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);

    switch (currentView) {
      case 'day':
        setUIState({
          selectedDate: direction === 'next' ? addDays(newDate, 1) : addDays(newDate, -1)
        });
        break;
      case 'week':
        setUIState({
          selectedDate: direction === 'next' ? addWeeks(newDate, 1) : addWeeks(newDate, -1)
        });
        break;
      case 'month':
        setUIState({
          selectedDate: direction === 'next' ? addMonths(newDate, 1) : addMonths(newDate, -1)
        });
        break;
    }
  };

  const getTodayButton = () => {
    setUIState({ selectedDate: new Date() });
  };

  const getViewDates = () => {
    switch (currentView) {
      case 'day': {
        const start = startOfDay(selectedDate);
        const end = endOfDay(selectedDate);
        return { start, end, dates: [selectedDate] };
      }
      case 'week': {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        const dates = eachDayOfInterval({ start, end });
        return { start, end, dates };
      }
      case 'month': {
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);
        const dates = eachDayOfInterval({ start, end });
        return { start, end, dates };
      }
    }
  };

  const getTodosForDate = (date: Date) => {
    return filteredTodos.filter(todo => isSameDay(new Date(todo.dueDate), date));
  };

  const { dates } = getViewDates();

  return (
    <div className={className}>
      {/* Timeline Header */}
      <div className="bg-background border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {format(selectedDate, currentView === 'month' ? 'MMMM yyyy' : currentView === 'week' ? "'Week of' MMM d, yyyy" : 'MMMM d, yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={getTodayButton}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={currentView}
              onChange={(e) => setUIState({ currentView: e.target.value as TimeView })}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
          </div>
        </div>

        {/* View Statistics */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <List className="h-4 w-4" />
            <span>{filteredTodos.length} total tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{filteredTodos.filter(t => t.status === 'pending').length} pending</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{dates.length} {currentView === 'day' ? 'day' : currentView === 'week' ? 'days' : 'days'} shown</span>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="space-y-6">
        {currentView === 'day' && (
          <DayView date={selectedDate} todos={getTodosForDate(selectedDate)} />
        )}

        {currentView === 'week' && (
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {dates.map(date => (
              <WeekView
                key={date.toISOString()}
                date={date}
                todos={getTodosForDate(date)}
                isToday={isSameDay(date, new Date())}
              />
            ))}
          </div>
        )}

        {currentView === 'month' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dates.map(date => {
              const todos = getTodosForDate(date);
              if (todos.length === 0) return null;

              return (
                <MonthView
                  key={date.toISOString()}
                  date={date}
                  todos={todos}
                  isToday={isSameDay(date, new Date())}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or add some new tasks to get started.
          </p>
        </div>
      )}
    </div>
  );
}

// Day View Component
function DayView({ date, todos }: { date: Date; todos: Todo[] }) {
  return (
    <div className="bg-background border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h3>
        <span className="text-sm text-muted-foreground">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {todos.length > 0 ? (
        <div className="space-y-4">
          {todos.sort((a, b) => {
            const timeA = a.dueTime || '00:00';
            const timeB = b.dueTime || '00:00';
            return timeA.localeCompare(timeB);
          }).map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={(todo) => {
                // Handle edit
              }}
              onDelete={() => {
                // Handle delete
              }}
              onStatusChange={() => {
                // Handle status change
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tasks scheduled for this day</p>
        </div>
      )}
    </div>
  );
}

// Week View Component
function WeekView({ date, todos, isToday }: { date: Date; todos: Todo[]; isToday: boolean }) {
  return (
    <div className={cn(
      'bg-background border rounded-lg p-4 min-h-[400px]',
      isToday && 'border-primary border-2'
    )}>
      <div className="text-center mb-3">
        <div className={cn(
          'text-sm font-medium',
          isToday && 'text-primary'
        )}>
          {format(date, 'EEE')}
        </div>
        <div className={cn(
          'text-2xl font-bold',
          isToday && 'text-primary'
        )}>
          {format(date, 'd')}
        </div>
        <div className="text-xs text-muted-foreground">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      <div className="space-y-2">
        {todos.slice(0, 3).map(todo => (
          <div
            key={todo.id}
            className="p-2 bg-muted/50 rounded text-xs cursor-pointer hover:bg-muted transition-colors"
            onClick={() => {
              // Handle todo click
            }}
          >
            <div className="font-medium truncate">{todo.title}</div>
            {todo.dueTime && (
              <div className="text-muted-foreground">{todo.dueTime}</div>
            )}
          </div>
        ))}

        {todos.length > 3 && (
          <div className="text-xs text-muted-foreground text-center">
            +{todos.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}

// Month View Component
function MonthView({ date, todos, isToday }: { date: Date; todos: Todo[]; isToday: boolean }) {
  return (
    <div className={cn(
      'bg-background border rounded-lg p-4',
      isToday && 'border-primary border-2'
    )}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className={cn(
            'text-sm font-medium',
            isToday && 'text-primary'
          )}>
            {format(date, 'EEEE')}
          </div>
          <div className={cn(
            'text-lg font-bold',
            isToday && 'text-primary'
          )}>
            {format(date, 'MMM d')}
          </div>
        </div>
        {isToday && (
          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
            Today
          </span>
        )}
      </div>

      <div className="space-y-2">
        {todos.slice(0, 4).map(todo => (
          <div
            key={todo.id}
            className="p-2 bg-muted/50 rounded text-xs cursor-pointer hover:bg-muted transition-colors"
            onClick={() => {
              // Handle todo click
            }}
          >
            <div className="font-medium truncate">{todo.title}</div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className={cn(
                'w-2 h-2 rounded-full',
                todo.priority === 'urgent' ? 'bg-red-500' :
                todo.priority === 'high' ? 'bg-orange-500' :
                todo.priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'
              )} />
              <span>{todo.category}</span>
            </div>
          </div>
        ))}

        {todos.length > 4 && (
          <div className="text-xs text-muted-foreground text-center">
            +{todos.length - 4} more tasks
          </div>
        )}
      </div>
    </div>
  );
}