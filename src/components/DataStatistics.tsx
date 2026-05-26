"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, DollarSign, Package, Users } from 'lucide-react';

interface DataStatisticsProps {
  data: any[];
  columns: string[];
}

export function DataStatistics({ data, columns }: DataStatisticsProps) {
  // Calculate statistics
  const rowCount = data.length;
  const columnCount = columns.length;

  // Find numeric columns for calculations
  const numericColumns = columns.filter(col => {
    const firstValue = data[0]?.[col];
    return typeof firstValue === 'number' || !isNaN(Number(firstValue));
  });

  // Calculate totals and averages for numeric columns
  const stats = numericColumns.slice(0, 3).map(col => {
    const values = data.map(row => Number(row[col]) || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    const changeVal = values[0] === 0 ? 0 : ((values[values.length - 1] - values[0]) / values[0] * 100);
    
    return {
      column: col,
      total,
      average,
      max,
      min,
      change: isNaN(changeVal) || !isFinite(changeVal) ? 0 : changeVal
    };
  });

  const icons = [DollarSign, Package, Users, Activity];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rowCount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {columnCount} columns tracked
          </p>
        </CardContent>
      </Card>

      {stats.map((stat, idx) => {
        const Icon = icons[idx + 1] || Activity;
        const isPositive = stat.change >= 0;
        
        return (
          <Card key={stat.column}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.column}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
                <span>vs first record</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
