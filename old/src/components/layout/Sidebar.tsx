'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Clock,
  CheckSquare,
  Settings,
  BarChart3,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Timeline', href: '/timeline', icon: Clock },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'All Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ open = true, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const { state } = useApp();

  const pendingCount = state.todos.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
  const overdueCount = state.todos.filter(t =>
    t.status !== 'completed' && new Date(t.dueDate) < new Date()
  ).length;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed left-0 top-0 h-full w-64 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        open ? 'translate-x-0' : '-translate-x-full',
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-foreground">
              Todo Timeline
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Add Button */}
          <div className="p-4 border-b">
            <Button className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{state.stats.totalTodos}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{state.stats.completedTodos}</div>
                <div className="text-muted-foreground">Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
                <div className="text-muted-foreground">Overdue</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}

                  {/* Show badges for certain items */}
                  {item.name === 'All Tasks' && pendingCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {pendingCount}
                    </Badge>
                  )}

                  {item.name === 'Dashboard' && overdueCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {overdueCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              © 2024 Todo Timeline App
            </div>
          </div>
        </div>
      </div>
    </>
  );
}