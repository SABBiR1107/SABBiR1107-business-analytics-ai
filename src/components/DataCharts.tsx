"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Waves,
  Hexagon,
  LineChart as ScatterIcon,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface DataChartsProps {
  data: any[];
  columns: string[];
}

// Tailored Premium Color Palette (Vibrant SaaS Colors)
const COLORS = [
  'hsl(var(--primary))',
  '#a855f7', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#f43f5e'  // Rose
];

export function DataCharts({ data, columns }: DataChartsProps) {
  // Find numeric and text columns
  const numericColumns = columns.filter(col => {
    const firstValue = data[0]?.[col];
    return typeof firstValue === 'number' || !isNaN(Number(firstValue));
  });

  const textColumns = columns.filter(col => {
    const firstValue = data[0]?.[col];
    return typeof firstValue === 'string' && isNaN(Number(firstValue));
  });

  // State for chart-specific axes
  const [lineXAxis, setLineXAxis] = useState(columns[0] || '');
  const [lineYAxis, setLineYAxis] = useState(numericColumns[0] || columns[1] || '');
  const [lineYAxis2, setLineYAxis2] = useState('__none__');
  
  const [barXAxis, setBarXAxis] = useState(columns[0] || '');
  const [barYAxis, setBarYAxis] = useState(numericColumns[0] || columns[1] || '');
  
  const [pieCategory, setPieCategory] = useState(textColumns[0] || columns[0] || '');
  const [pieValue, setPieValue] = useState('__count__');

  const [areaXAxis, setAreaXAxis] = useState(columns[0] || '');
  const [areaYAxis, setAreaYAxis] = useState(numericColumns[0] || columns[1] || '');

  const [radarCategory, setRadarCategory] = useState(textColumns[0] || columns[0] || '');
  const [radarValue, setRadarValue] = useState(numericColumns[0] || columns[1] || '');

  const [scatterXAxis, setScatterXAxis] = useState(numericColumns[0] || columns[0] || '');
  const [scatterYAxis, setScatterYAxis] = useState(numericColumns[1] || numericColumns[0] || columns[1] || '');

  // 1. Prepare Line Chart Data
  const lineChartData = data.slice(0, 50).map((row, index) => {
    const result: any = {
      name: row[lineXAxis]?.toString().substring(0, 20) || `Row ${index + 1}`,
      value: Number(row[lineYAxis]) || 0,
    };
    if (lineYAxis2 && lineYAxis2 !== '__none__') {
      result.value2 = Number(row[lineYAxis2]) || 0;
    }
    return result;
  });

  // 2. Prepare Pie Chart Data
  let pieChartData: { name: string; value: number }[] = [];
  if (pieValue && pieValue !== '__count__') {
    const categorySum: { [key: string]: number } = {};
    data.forEach(row => {
      const category = row[pieCategory]?.toString() || 'Unknown';
      const value = Number(row[pieValue]) || 0;
      categorySum[category] = (categorySum[category] || 0) + value;
    });
    pieChartData = Object.entries(categorySum)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  } else {
    const categoryCount: { [key: string]: number } = {};
    data.forEach(row => {
      const category = row[pieCategory]?.toString() || 'Unknown';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    pieChartData = Object.entries(categoryCount)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }

  // 3. Prepare Bar Chart Data
  const barChartData = data
    .slice(0, 20)
    .map(row => ({
      name: row[barXAxis]?.toString().substring(0, 20) || 'Item',
      value: Number(row[barYAxis]) || 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // 4. Prepare Area Chart Data
  const areaChartData = data.slice(0, 40).map((row, index) => ({
    name: row[areaXAxis]?.toString().substring(0, 20) || `Point ${index + 1}`,
    value: Number(row[areaYAxis]) || 0
  }));

  // 5. Prepare Radar Chart Data
  const radarSum: { [key: string]: number } = {};
  data.forEach(row => {
    const category = row[radarCategory]?.toString() || 'Unknown';
    const value = Number(row[radarValue]) || 0;
    radarSum[category] = (radarSum[category] || 0) + value;
  });
  const radarChartData = Object.entries(radarSum)
    .slice(0, 6)
    .map(([category, value]) => ({
      subject: category.substring(0, 15),
      value
    }));

  // 6. Prepare Scatter Chart Data
  const scatterChartData = data.slice(0, 100).map((row, index) => ({
    x: Number(row[scatterXAxis]) || 0,
    y: Number(row[scatterYAxis]) || 0,
    name: row[columns[0]]?.toString() || `Item ${index + 1}`
  }));

  // Calculate simple statistics for dynamic cards
  const activeYValues = lineChartData.map(d => d.value);
  const avgValue = activeYValues.length > 0 ? (activeYValues.reduce((a, b) => a + b, 0) / activeYValues.length).toFixed(1) : 0;
  const maxValue = activeYValues.length > 0 ? Math.max(...activeYValues).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border border-primary/10 bg-card/40 backdrop-blur-md shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Line Chart Average</span>
              <h4 className="text-xl font-black mt-1 text-foreground/90">{avgValue}</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-primary/10 bg-card/40 backdrop-blur-md shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Line Chart Peak</span>
              <h4 className="text-xl font-black mt-1 text-foreground/90">{maxValue}</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-primary/10 bg-card/40 backdrop-blur-md shadow-sm sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Visual Coverage</span>
              <h4 className="text-xl font-black mt-1 text-foreground/90">{columns.length} dimensions</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Info className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Tabs Layout */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 h-auto p-1 bg-secondary/50 border rounded-2xl mb-6 gap-1">
          <TabsTrigger value="trends" className="rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-1.5 font-bold text-xs select-none cursor-pointer"><TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" /> Trends</TabsTrigger>
          <TabsTrigger value="volume" className="rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-1.5 font-bold text-xs select-none cursor-pointer"><Waves className="h-3.5 w-3.5 text-primary shrink-0" /> Volume</TabsTrigger>
          <TabsTrigger value="distribution" className="rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-1.5 font-bold text-xs select-none cursor-pointer"><PieIcon className="h-3.5 w-3.5 text-primary shrink-0" /> Share</TabsTrigger>
          <TabsTrigger value="bars" className="rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-1.5 font-bold text-xs select-none cursor-pointer"><BarChart3 className="h-3.5 w-3.5 text-primary shrink-0" /> Comparison</TabsTrigger>
          <TabsTrigger value="radar" className="rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-1.5 font-bold text-xs select-none cursor-pointer"><Hexagon className="h-3.5 w-3.5 text-primary shrink-0" /> Radar</TabsTrigger>
          <TabsTrigger value="scatter" className="rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-1.5 font-bold text-xs select-none cursor-pointer"><ScatterIcon className="h-3.5 w-3.5 text-primary shrink-0" /> Scatter</TabsTrigger>
        </TabsList>

        {/* 1. Line Chart - Trends */}
        <TabsContent value="trends">
          <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-primary" />
                Line Chart - Multi-Variable Trends
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">X-Axis (Dimension)</Label>
                  <Select value={lineXAxis} onValueChange={setLineXAxis}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Select X axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Y-Axis (Primary Metric)</Label>
                  <Select value={lineYAxis} onValueChange={setLineYAxis}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Select Y axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Y-Axis (Secondary Metric)</Label>
                  <Select value={lineYAxis2} onValueChange={setLineYAxis2}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Optional secondary axis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {numericColumns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={lineChartData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(var(--primary-rgb), 0.15)', background: 'rgba(255, 255, 255, 0.95)', color: '#000' }} />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 7 }}
                    name={lineYAxis}
                  />
                  {lineYAxis2 && lineYAxis2 !== '__none__' && (
                    <Line
                      type="monotone"
                      dataKey="value2"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 1 }}
                      activeDot={{ r: 7 }}
                      name={lineYAxis2}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Area Chart - Volume */}
        <TabsContent value="volume">
          <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Waves className="h-4.5 w-4.5 text-violet-500" />
                Area Chart - Density & Volume Analytics
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">X-Axis (Category)</Label>
                  <Select value={areaXAxis} onValueChange={setAreaXAxis}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Select X axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Y-Axis (Density Value)</Label>
                  <Select value={areaYAxis} onValueChange={setAreaYAxis}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Select Y axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericColumns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={areaChartData} margin={{ bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorArea)" name={areaYAxis} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Pie Chart - Distribution Share */}
        <TabsContent value="distribution">
          <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <PieIcon className="h-4.5 w-4.5 text-cyan-500" />
                Pie Chart - Percent Distribution Share
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Category Dimension</Label>
                  <Select value={pieCategory} onValueChange={setPieCategory}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Metric Operator</Label>
                  <Select value={pieValue} onValueChange={setPieValue}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Count occurrences" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__count__">Count Occurrences</SelectItem>
                      {numericColumns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-around gap-6">
              <div className="w-full md:w-1/2">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      labelLine={false}
                      label={({ name, percent }) => `${(name || '').substring(0, 8)}: ${((percent || 0) * 100).toFixed(0)}%`}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom styled Legend grid */}
              <div className="w-full md:w-1/3 grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto p-4 bg-muted/20 border rounded-2xl">
                {pieChartData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-xs truncate font-medium text-foreground/80" title={item.name}>
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Bar Chart - Comparison */}
        <TabsContent value="bars">
          <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-emerald-500" />
                Bar Chart - Metric Comparisons (Top 10)
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">X-Axis (Dimensions)</Label>
                  <Select value={barXAxis} onValueChange={setBarXAxis}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Select X axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Y-Axis (Value)</Label>
                  <Select value={barYAxis} onValueChange={setBarYAxis}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Select Y axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barChartData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} name={barYAxis}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Radar Chart - Multi-Variable Spider profiling */}
        <TabsContent value="radar">
          <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Hexagon className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                Radar Spider Chart - Multi-Variable Profiling
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Category Axis</Label>
                  <Select value={radarCategory} onValueChange={setRadarCategory}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Volume Metric</Label>
                  <Select value={radarValue} onValueChange={setRadarValue}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericColumns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex justify-center">
              {radarChartData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  Insufficient data columns to populate Radar.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                    <PolarGrid stroke="#888888" opacity={0.2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 500 }} />
                    <PolarRadiusAxis tick={{ fontSize: 9 }} />
                    <Radar name={radarValue} dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} strokeWidth={2.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. Scatter Chart - Correlation Clusters */}
        <TabsContent value="scatter">
          <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ScatterIcon className="h-4.5 w-4.5 text-rose-500" />
                Scatter Plot - Correlation Clusters & Outliers
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">X-Axis (Metric 1)</Label>
                  <Select value={scatterXAxis} onValueChange={setScatterXAxis}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Metric 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericColumns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Y-Axis (Metric 2)</Label>
                  <Select value={scatterYAxis} onValueChange={setScatterYAxis}>
                    <SelectTrigger className="rounded-xl h-10 border-input hover:border-primary/50">
                      <SelectValue placeholder="Metric 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericColumns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {numericColumns.length < 2 ? (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  Scatter correlation plot requires at least 2 numeric columns in your spreadsheet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <ScatterChart margin={{ bottom: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis type="number" dataKey="x" name={scatterXAxis} tick={{ fontSize: 11 }} />
                    <YAxis type="number" dataKey="y" name={scatterYAxis} tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Data Distribution" data={scatterChartData} fill="#f43f5e" fillOpacity={0.7} shape="circle" line={false} />
                    <Legend verticalAlign="top" height={36} />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}