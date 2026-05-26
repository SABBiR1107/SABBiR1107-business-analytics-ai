"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Sparkles, 
  TrendingUp, 
  Megaphone, 
  DollarSign, 
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';

interface AutoTemplatesProps {
  data: any[];
  columns: string[];
  activeXAxis: string;
  activeYAxis: string;
  onApplyTemplate: (xAxis: string, yAxis: string, chartType?: string) => void;
}

interface TemplateSuggestion {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
  xAxis: string;
  yAxis: string;
  chartType: string;
  badge: string;
}

export function AutoTemplates({ data, columns, activeXAxis, activeYAxis, onApplyTemplate }: AutoTemplatesProps) {
  // Identify applicable templates based on columns
  const suggestions = useMemo(() => {
    const list: TemplateSuggestion[] = [];
    const lowerCols = columns.map(c => c.toLowerCase());

    const findBestCol = (keywords: string[], fallbackList: string[]): string => {
      for (const kw of keywords) {
        const found = columns.find(c => c.toLowerCase().includes(kw));
        if (found) return found;
      }
      // Return first matching fallback from column list
      for (const fb of fallbackList) {
        const found = columns.find(c => c.toLowerCase() === fb.toLowerCase());
        if (found) return found;
      }
      return '';
    };

    // Find a date or text label for the X-axis
    const dateCol = findBestCol(['date', 'created', 'time', 'month', 'year', 'day', 'timestamp'], []);
    const categoryCol = findBestCol(['category', 'name', 'campaign', 'product', 'item', 'group', 'country', 'region'], columns);
    const primaryXAxis = dateCol || categoryCol || columns[0] || '';

    // 1. Sales & Transaction Template
    const salesCol = findBestCol(['sales', 'revenue', 'amount', 'price', 'total', 'order'], []);
    if (salesCol && primaryXAxis) {
      list.push({
        id: 'sales',
        title: 'Sales & Revenue Velocity',
        description: `Analyze transactions and sales flow across ${primaryXAxis}.`,
        icon: DollarSign,
        gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20',
        xAxis: primaryXAxis,
        yAxis: salesCol,
        chartType: 'area',
        badge: 'Sales Funnel'
      });
    }

    // 2. Marketing Performance & ROI Template
    const marketingY = findBestCol(['cost', 'spend', 'ad', 'roi', 'clicks', 'conversion', 'impressions'], []);
    const marketingX = findBestCol(['campaign', 'channel', 'source', 'medium', 'ad'], [primaryXAxis]);
    if (marketingY && marketingX) {
      list.push({
        id: 'marketing',
        title: 'Marketing ROI Funnel',
        description: `Compare ad spend and campaign outcomes over ${marketingX}.`,
        icon: Megaphone,
        gradient: 'from-blue-500/10 to-indigo-500/10 text-blue-500 border-blue-500/20',
        xAxis: marketingX,
        yAxis: marketingY,
        chartType: 'bar',
        badge: 'Marketing ROI'
      });
    }

    // 3. SaaS User Growth & Signup Template
    const saasY = findBestCol(['mrr', 'signups', 'users', 'churn', 'customers', 'active'], []);
    if (saasY && primaryXAxis) {
      list.push({
        id: 'saas',
        title: 'SaaS User Acquisition',
        description: `Track account growth, signups, and customer acquisition metrics.`,
        icon: Users,
        gradient: 'from-violet-500/10 to-purple-500/10 text-violet-500 border-violet-500/20',
        xAxis: primaryXAxis,
        yAxis: saasY,
        chartType: 'line',
        badge: 'User Acquisition'
      });
    }

    // 4. Financial Profits Template
    const profitY = findBestCol(['profit', 'margin', 'expense', 'income', 'cost'], []);
    if (profitY && primaryXAxis) {
      list.push({
        id: 'finance',
        title: 'Financial Profit Margins',
        description: `Map out profits, margins, and cost streams over ${primaryXAxis}.`,
        icon: TrendingUp,
        gradient: 'from-amber-500/10 to-orange-500/10 text-amber-500 border-amber-500/20',
        xAxis: primaryXAxis,
        yAxis: profitY,
        chartType: 'area',
        badge: 'Corporate Finance'
      });
    }

    return list;
  }, [columns]);

  const handleSelectTemplate = (template: TemplateSuggestion) => {
    onApplyTemplate(template.xAxis, template.yAxis, template.chartType);
    toast.success(`Activated "${template.title}" dashboard configuration!`);
  };

  if (suggestions.length === 0) {
    return (
      <Card className="border border-primary/10 rounded-2xl shadow-sm bg-card/45 backdrop-blur-md p-6 text-center">
        <Compass className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-40 animate-spin" style={{ animationDuration: '10s' }} />
        <h4 className="font-bold text-xs">No Custom Templates Found</h4>
        <p className="text-[10px] text-muted-foreground mt-1">We couldn't auto-detect specific data signatures. Explore custom charts below.</p>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/10 rounded-2xl shadow-sm bg-card/45 backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            AI Dynamic Views Generator
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold">
            {suggestions.length} Templates Ready
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Auto-detected metric signatures. Click any card to apply best-fitting chart coordinates instantly.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((template) => {
          const isActive = activeXAxis === template.xAxis && activeYAxis === template.yAxis;

          return (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden ${
                isActive 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border/40 hover:border-primary/45 bg-muted/20 hover:bg-muted/40'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 p-1 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest rounded-bl-lg">
                  Active
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${template.gradient} border flex items-center justify-center shrink-0`}>
                    <template.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold">
                    {template.badge}
                  </Badge>
                </div>

                <h4 className="font-extrabold text-xs text-foreground/90 group-hover:text-primary transition-colors">
                  {template.title}
                </h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/10 text-[9px] font-semibold text-muted-foreground">
                <span>X: {template.xAxis} | Y: {template.yAxis}</span>
                <span className="flex items-center gap-0.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  Activate
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
