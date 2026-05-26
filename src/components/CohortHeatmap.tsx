"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  HelpCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

interface CohortHeatmapProps {
  data: any[];
  columns: string[];
}

export function CohortHeatmap({ data, columns }: CohortHeatmapProps) {
  // Try to calculate actual cohorts, or fallback to gorgeous synthetic SaaS cohorts
  const cohortData = useMemo(() => {
    // Check if columns contain date/signup patterns
    const dateCol = columns.find(c => c.toLowerCase().includes('date') || c.toLowerCase().includes('time') || c.toLowerCase().includes('created'));
    const idCol = columns.find(c => c.toLowerCase().includes('id') || c.toLowerCase().includes('user') || c.toLowerCase().includes('customer') || c.toLowerCase().includes('email'));

    // If we have date and unique ID columns, let's try to parse actual cohorts
    if (dateCol && idCol && data.length > 50) {
      try {
        // Group signups by month
        const signups: { [userId: string]: string } = {}; // userId -> signupMonth
        const activeMonths: { [userId: string]: Set<string> } = {}; // userId -> Set of months active

        data.forEach(row => {
          const userId = String(row[idCol]);
          const dateStr = String(row[dateCol]);
          const dateObj = new Date(dateStr);
          if (!isNaN(dateObj.getTime()) && userId) {
            const month = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            if (!signups[userId] || month < signups[userId]) {
              signups[userId] = month;
            }
            if (!activeMonths[userId]) {
              activeMonths[userId] = new Set();
            }
            activeMonths[userId].add(month);
          }
        });

        // Group cohorts
        const cohorts: { [cohortMonth: string]: { [period: number]: Set<string> } } = {};
        const cohortSizes: { [cohortMonth: string]: number } = {};

        Object.keys(signups).forEach(userId => {
          const signupMonth = signups[userId];
          if (!cohorts[signupMonth]) {
            cohorts[signupMonth] = {};
            cohortSizes[signupMonth] = 0;
          }
          cohortSizes[signupMonth]++;

          // Track months active
          const activeSet = activeMonths[userId];
          const [sYear, sMonth] = signupMonth.split('-').map(Number);

          activeSet.forEach(actMonth => {
            const [aYear, aMonth] = actMonth.split('-').map(Number);
            const periodDiff = (aYear - sYear) * 12 + (aMonth - sMonth);
            if (periodDiff >= 0 && periodDiff < 6) {
              if (!cohorts[signupMonth][periodDiff]) {
                cohorts[signupMonth][periodDiff] = new Set();
              }
              cohorts[signupMonth][periodDiff].add(userId);
            }
          });
        });

        // Format to final sorted structure
        const sortedCohorts = Object.keys(cohorts)
          .sort()
          .slice(0, 5) // Display first 5 cohorts
          .map(cohortMonth => {
            const size = cohortSizes[cohortMonth];
            const rates: number[] = [];
            for (let i = 0; i < 6; i++) {
              const activeCount = cohorts[cohortMonth][i]?.size || 0;
              rates.push(size > 0 ? Math.round((activeCount / size) * 100) : 0);
            }
            return {
              cohort: cohortMonth,
              size,
              rates
            };
          });

        if (sortedCohorts.length > 1) {
          return {
            type: 'actual',
            rows: sortedCohorts
          };
        }
      } catch (err) {
        console.warn('Failed to parse actual cohorts, falling back to synthetic templates:', err);
      }
    }

    // Gorgeous fallback synthetic cohort dataset
    const synthetic = [
      { cohort: 'Jan Cohort', size: 1420, rates: [100, 84, 72, 61, 54, 49] },
      { cohort: 'Feb Cohort', size: 1650, rates: [100, 86, 75, 65, 58, 52] },
      { cohort: 'Mar Cohort', size: 1840, rates: [100, 89, 78, 68, 60, 55] },
      { cohort: 'Apr Cohort', size: 1920, rates: [100, 91, 81, 71, 63, 58] },
      { cohort: 'May Cohort', size: 2150, rates: [100, 93, 84, 74, 66, 60] }
    ];

    return {
      type: 'synthetic',
      rows: synthetic
    };
  }, [data, columns]);

  // Color mapper based on retention rate percentage
  const getHeatColor = (rate: number) => {
    if (rate === 100) return 'bg-primary text-primary-foreground';
    if (rate >= 80) return 'bg-primary/80 text-primary-foreground';
    if (rate >= 60) return 'bg-primary/65 text-primary-foreground/90';
    if (rate >= 50) return 'bg-primary/50 text-foreground';
    if (rate >= 30) return 'bg-primary/30 text-foreground';
    if (rate >= 10) return 'bg-primary/15 text-muted-foreground';
    return 'bg-primary/5 text-muted-foreground/60';
  };

  return (
    <Card className="border border-primary/10 rounded-2xl shadow-sm bg-card/45 backdrop-blur-md overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Activity className="h-24 w-24" />
      </div>

      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-primary" />
            AI SaaS Cohort Retention Heatmap
          </CardTitle>
          <Badge variant={cohortData.type === 'actual' ? "default" : "secondary"} className="font-bold border-0">
            {cohortData.type === 'actual' ? "Real-time Cohorts" : "Preview Cohorts"}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Analyze customer acquisition cohorts, retention churn, and lifetime activity over a 6-month cycle.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {cohortData.type === 'synthetic' && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2.5 items-start text-[10px] text-amber-600 dark:text-amber-400">
            <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">No date or ID markers found.</span> Showing synthetic SaaS billing cohorts. Clean or map your spreadsheet columns to activate real-time analytics.
            </div>
          </div>
        )}

        {/* Heatmap table grid */}
        <div className="overflow-x-auto border border-border/40 rounded-xl shadow-sm">
          <table className="w-full text-center border-collapse text-[10px] sm:text-xs">
            <thead>
              <tr className="bg-muted/40 border-b border-border/30">
                <th className="px-3 py-2.5 text-left font-bold text-muted-foreground whitespace-nowrap">Cohort</th>
                <th className="px-3 py-2.5 font-bold text-muted-foreground whitespace-nowrap">Size</th>
                <th className="px-2 py-2.5 font-bold text-muted-foreground">M0</th>
                <th className="px-2 py-2.5 font-bold text-muted-foreground">M1</th>
                <th className="px-2 py-2.5 font-bold text-muted-foreground">M2</th>
                <th className="px-2 py-2.5 font-bold text-muted-foreground">M3</th>
                <th className="px-2 py-2.5 font-bold text-muted-foreground">M4</th>
                <th className="px-2 py-2.5 font-bold text-muted-foreground">M5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/25">
              {cohortData.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-3 text-left font-bold text-foreground/90 whitespace-nowrap">{row.cohort}</td>
                  <td className="px-3 py-3 font-mono font-bold text-muted-foreground whitespace-nowrap">{row.size.toLocaleString()}</td>
                  {row.rates.map((rate, rateIdx) => (
                    <td 
                      key={rateIdx} 
                      className={`px-2 py-3 font-mono font-bold transition-all shadow-[inset_0_0_1px_rgba(255,255,255,0.05)] ${getHeatColor(rate)}`}
                    >
                      {rate}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key takeaways */}
        <div className="flex items-center gap-4 text-[9px] font-semibold text-muted-foreground pt-1 justify-between">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded bg-primary shrink-0" />
            Highest Retention
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded bg-primary/50 shrink-0" />
            Medium Retention
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded bg-primary/15 shrink-0" />
            Churn Alert Zone
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
