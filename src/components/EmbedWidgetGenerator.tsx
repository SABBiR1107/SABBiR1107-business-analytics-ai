"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Code2, 
  Copy, 
  Check, 
  Monitor, 
  SlidersHorizontal,
  ExternalLink,
  Layers
} from 'lucide-react';

interface EmbedWidgetGeneratorProps {
  filename: string;
  columns: string[];
}

export function EmbedWidgetGenerator({ filename, columns }: EmbedWidgetGeneratorProps) {
  const [chartType, setChartType] = useState('line');
  const [theme, setTheme] = useState('dark');
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('400');
  const [showGrid, setShowGrid] = useState('true');
  const [isCopied, setIsCopied] = useState(false);

  // Clean filename for URL safety
  const safeFilename = filename.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const generatedIframe = `<iframe 
  src="https://business-analytics-ai.vercel.app/embed/${safeFilename}?type=${chartType}&theme=${theme}&grid=${showGrid}" 
  width="${width}" 
  height="${height}" 
  style="border: 1px solid rgba(128,128,128,0.15); border-radius: 16px; box-shadow: 0 4px 30px rgba(0,0,0,0.05);"
  frameborder="0"
  allowtransparency="true"
></iframe>`;

  const generatedReact = `import { EmbeddedChart } from '@business-analytics/sdk';

export default function MyDashboard() {
  return (
    <EmbeddedChart
      datasetId="${safeFilename}"
      type="${chartType}"
      theme="${theme}"
      height={${height}}
      showGrid={${showGrid}}
    />
  );
}`;

  const [activeTab, setActiveTab] = useState<'iframe' | 'react'>('iframe');

  const handleCopy = () => {
    const textToCopy = activeTab === 'iframe' ? generatedIframe : generatedReact;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    toast.success('Embedded widget code copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="border border-primary/10 rounded-2xl shadow-sm bg-card/45 backdrop-blur-md overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Layers className="h-24 w-24" />
      </div>

      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Code2 className="h-4.5 w-4.5 text-primary" />
            Embedded Widget Generator
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold">
            SaaS SDK
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Generate high-fidelity White-Label embedded charts to place directly into your own customer portals or sites.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Widget controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/20 p-3 rounded-xl border border-border/40">
          {/* Chart selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              Chart Type
            </label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="h-8 text-xs rounded-lg pl-2 pr-2 bg-background border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Monitor className="h-3 w-3" />
              UI Theme
            </label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="h-8 text-xs rounded-lg pl-2 pr-2 bg-background border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">SaaS Dark (Neon)</SelectItem>
                <SelectItem value="light">Studio Light</SelectItem>
                <SelectItem value="glass">Glassmorphism</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Height selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              Height (px)
            </label>
            <Select value={height} onValueChange={setHeight}>
              <SelectTrigger className="h-8 text-xs rounded-lg pl-2 pr-2 bg-background border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">300 px</SelectItem>
                <SelectItem value="400">400 px</SelectItem>
                <SelectItem value="500">500 px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid lines selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              Grid Lines
            </label>
            <Select value={showGrid} onValueChange={setShowGrid}>
              <SelectTrigger className="h-8 text-xs rounded-lg pl-2 pr-2 bg-background border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Show Grid</SelectItem>
                <SelectItem value="false">Hide Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dynamic preview block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Widget Live Preview Mockup</h4>
            <span className="text-[9px] text-muted-foreground flex items-center gap-1 font-semibold">
              Mock Sandboxed Environment
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>

          <div className={`p-4 border rounded-2xl h-36 flex flex-col justify-between transition-colors shadow-sm relative overflow-hidden ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 
            theme === 'light' ? 'bg-white border-zinc-200 text-zinc-900' :
            'bg-card/30 border-primary/20 backdrop-blur-md text-foreground'
          }`}>
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest opacity-60">
              <span>{chartType} Widget preview</span>
              <Badge variant="outline" className={`text-[8px] font-black ${theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-zinc-200 text-zinc-500'}`}>
                {theme} theme
              </Badge>
            </div>
            
            {/* Simulated Grid SVG */}
            <div className="flex-1 flex flex-col justify-end gap-3.5 pb-2 pt-4">
              {showGrid === 'true' && (
                <div className={`space-y-2 opacity-10 ${theme === 'light' ? 'text-zinc-950' : 'text-white'}`}>
                  <hr className="border-t border-current" />
                  <hr className="border-t border-current" />
                  <hr className="border-t border-current" />
                </div>
              )}
              {/* Simulated chart bars or lines */}
              <div className="flex items-end gap-3 justify-center">
                <div className="h-10 w-6 bg-primary rounded-t-sm opacity-60" />
                <div className="h-16 w-6 bg-primary rounded-t-sm opacity-80 animate-pulse" />
                <div className="h-12 w-6 bg-primary rounded-t-sm opacity-40" />
                <div className="h-20 w-6 bg-primary rounded-t-sm opacity-100" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[8px] font-semibold opacity-40">
              <span>X Axis: Category</span>
              <span>Dataset: {filename}</span>
            </div>
          </div>
        </div>

        {/* Copyable script blocks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-border/40 pb-1 text-xs">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('iframe')}
                className={`font-bold pb-1 text-[10px] uppercase tracking-wider border-b-2 transition-all ${activeTab === 'iframe' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}
              >
                HTML Iframe script
              </button>
              <button 
                onClick={() => setActiveTab('react')}
                className={`font-bold pb-1 text-[10px] uppercase tracking-wider border-b-2 transition-all ${activeTab === 'react' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}
              >
                React SDK Component
              </button>
            </div>
            <Button 
              onClick={handleCopy} 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 font-mono text-[9px] text-emerald-400 overflow-x-auto max-h-[100px]">
            <pre><code>{activeTab === 'iframe' ? generatedIframe : generatedReact}</code></pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
