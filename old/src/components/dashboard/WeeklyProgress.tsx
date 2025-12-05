import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface WeeklyProgressProps {
  data: {
    date: string;
    completed: number;
    total: number;
  }[];
  className?: string;
}

export function WeeklyProgress({ data, className }: WeeklyProgressProps) {
  const maxTotal = Math.max(...data.map(d => d.total), 1);

  return (
    <div className={cn('bg-background border rounded-lg p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Weekly Progress</h3>
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {data.map((day, index) => {
          const completionRate = day.total > 0 ? (day.completed / day.total) * 100 : 0;
          const barHeight = (day.total / maxTotal) * 100;

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-12 text-sm text-muted-foreground text-right">
                {day.date}
              </div>

              <div className="flex-1 relative">
                <div className="flex items-center gap-1 h-8">
                  {/* Total tasks bar */}
                  <div
                    className="bg-secondary h-full rounded-sm min-w-[4px] transition-all duration-300"
                    style={{ width: `${barHeight}%` }}
                  />

                  {/* Completed tasks overlay */}
                  {day.completed > 0 && (
                    <div
                      className="bg-primary h-full rounded-sm min-w-[4px] transition-all duration-300"
                      style={{ width: `${(day.completed / maxTotal) * 100}%` }}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[60px]">
                {day.completed}/{day.total}
                {completionRate === 100 && day.total > 0 && (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-secondary rounded-sm" />
          <span className="text-muted-foreground">Total Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-sm" />
          <span className="text-muted-foreground">Completed</span>
        </div>
      </div>
    </div>
  );
}