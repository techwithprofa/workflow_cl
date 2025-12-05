'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/contexts/AppContext';
import { exportToJSON, downloadFile } from '@/utils/helpers';
import { Category } from '@/types';
import { CATEGORIES } from '@/utils/constants';
import {
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Bell,
  BellOff,
  FileText,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import jsPDF from 'jspdf';

export default function SettingsPage() {
  const { state, setUIState } = useApp();
  const [exportFormat, setExportFormat] = useState<'json' | 'pdf' | 'csv'>('json');
  const [exportDateRange, setExportDateRange] = useState('all');
  const [exportCategories, setExportCategories] = useState<Category[]>([]);
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Theme management
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setUIState({ theme });
  };

  // Export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      let filteredTodos = state.todos;

      // Filter by date range
      if (exportDateRange !== 'all') {
        const now = new Date();
        let startDate: Date;

        switch (exportDateRange) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }

        filteredTodos = filteredTodos.filter(todo => new Date(todo.dueDate) >= startDate);
      }

      // Filter by categories
      if (exportCategories.length > 0) {
        filteredTodos = filteredTodos.filter(todo => exportCategories.includes(todo.category));
      }

      // Filter by completion status
      if (!includeCompleted) {
        filteredTodos = filteredTodos.filter(todo => todo.status !== 'completed');
      }

      const filename = `todo-timeline-export-${new Date().toISOString().split('T')[0]}`;

      switch (exportFormat) {
        case 'json':
          const jsonData = exportToJSON(filteredTodos);
          downloadFile(jsonData, `${filename}.json`, 'application/json');
          break;

        case 'csv':
          const csvData = convertToCSV(filteredTodos);
          downloadFile(csvData, `${filename}.csv`, 'text/csv');
          break;

        case 'pdf':
          await exportToPDF(filteredTodos, filename);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (todos: any[]) => {
    if (todos.length === 0) return '';

    const headers = ['Title', 'Description', 'Due Date', 'Priority', 'Category', 'Status', 'Tags', 'Progress'];
    const csvContent = [
      headers.join(','),
      ...todos.map(todo => [
        `"${todo.title.replace(/"/g, '""')}"`,
        `"${(todo.description || '').replace(/"/g, '""')}"`,
        todo.dueDate,
        todo.priority,
        todo.category,
        todo.status,
        `"${todo.tags.join('; ')}"`,
        todo.progress
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  const exportToPDF = async (todos: any[], filename: string) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Title
    pdf.setFontSize(20);
    pdf.text('Todo Timeline Export', margin, y);
    y += 15;

    // Export date
    pdf.setFontSize(12);
    pdf.text(`Exported: ${new Date().toLocaleDateString()}`, margin, y);
    y += 10;

    // Summary
    pdf.text(`Total Tasks: ${todos.length}`, margin, y);
    y += 10;

    // Tasks
    pdf.setFontSize(14);
    pdf.text('Tasks:', margin, y);
    y += 10;

    pdf.setFontSize(10);
    todos.forEach((todo, index) => {
      // Check if we need a new page
      if (y > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        y = margin;
      }

      pdf.setFontSize(12);
      pdf.text(`${index + 1}. ${todo.title}`, margin, y);
      y += 7;

      pdf.setFontSize(10);
      pdf.text(`Due: ${new Date(todo.dueDate).toLocaleDateString()} | Priority: ${todo.priority} | Status: ${todo.status}`, margin + 5, y);
      y += 5;

      if (todo.description) {
        const lines = pdf.splitTextToSize(todo.description, pageWidth - 2 * margin - 10);
        pdf.text(lines, margin + 5, y);
        y += lines.length * 5 + 3;
      }

      y += 5;
    });

    pdf.save(`${filename}.pdf`);
  };

  // Data management
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            // Import data to state
            console.log('Import data:', data);
          } catch (error) {
            console.error('Import failed:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear all data from local storage and state
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleCategory = (category: Category) => {
    setExportCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your app preferences and data.
          </p>
        </div>

        {/* Appearance Settings */}
        <div className="bg-background border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={state.ui.theme === 'light' ? 'default' : 'outline'}
                  onClick={() => handleThemeChange('light')}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={state.ui.theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => handleThemeChange('dark')}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={state.ui.theme === 'system' ? 'default' : 'outline'}
                  onClick={() => handleThemeChange('system')}
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Notifications</label>
                <p className="text-xs text-muted-foreground">Get notified about upcoming tasks</p>
              </div>
              <Button
                variant={state.ui.notifications ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUIState({ notifications: !state.ui.notifications })}
              >
                {state.ui.notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Export Settings */}
        <div className="bg-background border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Export Data</h2>

          <div className="space-y-4">
            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium mb-2">Export Format</label>
              <Select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as any)}>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <Select value={exportDateRange} onChange={(e) => setExportDateRange(e.target.value)}>
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </Select>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={exportCategories.length === 0 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExportCategories([])}
                >
                  All Categories
                </Button>
                {CATEGORIES.map(category => (
                  <Button
                    key={category}
                    variant={exportCategories.includes(category) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Include Completed */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="include-completed"
                checked={includeCompleted}
                onChange={(e) => setIncludeCompleted(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="include-completed" className="text-sm">
                Include completed tasks
              </label>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
            </Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-background border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleImport}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>

              <Button
                variant="destructive"
                onClick={handleClearData}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>• Import: Upload a previously exported JSON file to restore your tasks</p>
              <p>• Export: Download your tasks in various formats for backup or analysis</p>
              <p>• Clear Data: Permanently delete all tasks and settings</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-background border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Todo Timeline App</strong></p>
            <p>Version: 1.0.0</p>
            <p>A comprehensive task management application with timeline visualization and advanced features.</p>
            <div className="pt-4 space-y-1">
              <p>• Built with Next.js, TypeScript, and Tailwind CSS</p>
              <p>• Local storage for data persistence</p>
              <p>• Responsive design for all devices</p>
              <p>• Dark mode support</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}