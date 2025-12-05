'use client';

import React from 'react';
import { Menu, Search, Bell, Sun, Moon, Settings } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface HeaderProps {
  onMenuClick: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const { state, setUIState, setFilters } = useApp();

  const handleThemeToggle = () => {
    const currentTheme = state.ui.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'system' : 'light';
    setUIState({ theme: newTheme });
  };

  const ThemeIcon = state.ui.theme === 'light' ? Sun : state.ui.theme === 'dark' ? Moon : Sun;

  return (
    <header className={cn(
      'sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b',
      className
    )}>
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search bar */}
          <div className="relative max-w-md flex-1 hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search todos..."
              className="pl-10"
              value={state.filter.search}
              onChange={(e) => setFilters({
                search: e.target.value
              })}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <Button variant="ghost" size="sm" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {state.todos.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full" />
            )}
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="sm" onClick={handleThemeToggle}>
            <ThemeIcon className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}