import React from 'react';
import { PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { Category } from '@/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import * as Icons from 'lucide-react';

interface CategoryChartProps {
  data: Record<Category, number>;
  total: number;
  className?: string;
}

export function CategoryChart({ data, total, className }: CategoryChartProps) {
  const sortedCategories = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0);

  return (
    <div className={cn('bg-background border rounded-lg p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Tasks by Category</h3>
        <PieChartIcon className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {sortedCategories.map(([category, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={category} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <div className="h-4 w-4 rounded-full bg-primary/20" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                    {percentage > 30 && (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                </div>

                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      CATEGORY_COLORS[category as Category]
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {sortedCategories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}