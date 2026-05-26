"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Grid,
  FileSpreadsheet,
  Calendar,
  FileCheck
} from 'lucide-react';

interface DataSanitizerProps {
  data: any[];
  columns: string[];
  onDataSanitized: (cleanedData: any[]) => void;
}

export function DataSanitizer({ data, columns, onDataSanitized }: DataSanitizerProps) {
  const [stats, setStats] = useState({
    duplicates: 0,
    nullCells: 0,
    unstructuredDates: 0,
    isFullyClean: false
  });
  const [isCleaning, setIsCleaning] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  // Scan dataset metrics
  const scanDataset = () => {
    let duplicatesCount = 0;
    let nullCount = 0;
    let unstructuredDatesCount = 0;

    // 1. Detect duplicates
    const seenRows = new Set<string>();
    data.forEach(row => {
      const rowString = JSON.stringify(row);
      if (seenRows.has(rowString)) {
        duplicatesCount++;
      } else {
        seenRows.add(rowString);
      }
    });

    // 2. Count null/empty cells
    data.forEach(row => {
      columns.forEach(col => {
        const val = row[col];
        if (val === null || val === undefined || String(val).trim() === '') {
          nullCount++;
        }
      });
    });

    // 3. Detect messy/unstructured dates
    const dateRegex = /^(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})$/;
    const dateCols = columns.filter(col => col.toLowerCase().includes('date') || col.toLowerCase().includes('time') || col.toLowerCase().includes('created'));
    
    dateCols.forEach(col => {
      data.forEach(row => {
        const val = row[col];
        if (val && typeof val === 'string' && val.trim() !== '') {
          // If it matches string date but is not in preferred ISO YYYY-MM-DD
          if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            unstructuredDatesCount++;
          }
        }
      });
    });

    const isClean = duplicatesCount === 0 && nullCount === 0 && unstructuredDatesCount === 0;

    setStats({
      duplicates: duplicatesCount,
      nullCells: nullCount,
      unstructuredDates: unstructuredDatesCount,
      isFullyClean: isClean
    });
  };

  useEffect(() => {
    scanDataset();
  }, [data, columns]);

  const addLog = (message: string) => {
    setAuditLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 4)]);
  };

  // Deduplication
  const handleDeduplicate = async () => {
    setIsCleaning('dedup');
    await new Promise(r => setTimeout(r, 600));

    const seen = new Set<string>();
    const cleaned: any[] = [];
    let removed = 0;

    data.forEach(row => {
      const rowString = JSON.stringify(row);
      if (!seen.has(rowString)) {
        seen.add(rowString);
        cleaned.push(row);
      } else {
        removed++;
      }
    });

    onDataSanitized(cleaned);
    addLog(`Deduplication: Removed ${removed} duplicate rows.`);
    toast.success(`Deduplicated: Removed ${removed} duplicate rows!`);
    setIsCleaning(null);
  };

  // Normalize dates
  const handleNormalizeDates = async () => {
    setIsCleaning('dates');
    await new Promise(r => setTimeout(r, 600));

    const dateCols = columns.filter(col => col.toLowerCase().includes('date') || col.toLowerCase().includes('time') || col.toLowerCase().includes('created'));
    
    if (dateCols.length === 0) {
      toast.info('No date-like columns detected for normalization.');
      setIsCleaning(null);
      return;
    }

    const cleaned = data.map(row => {
      const newRow = { ...row };
      dateCols.forEach(col => {
        const val = newRow[col];
        if (val) {
          const parsed = new Date(val);
          if (!isNaN(parsed.getTime())) {
            // Format to YYYY-MM-DD
            const yyyy = parsed.getFullYear();
            const mm = String(parsed.getMonth() + 1).padStart(2, '0');
            const dd = String(parsed.getDate()).padStart(2, '0');
            newRow[col] = `${yyyy}-${mm}-${dd}`;
          }
        }
      });
      return newRow;
    });

    onDataSanitized(cleaned);
    addLog(`Date Normalization: Standardized dates in columns [${dateCols.join(', ')}].`);
    toast.success('Successfully normalized date formats to ISO YYYY-MM-DD!');
    setIsCleaning(null);
  };

  // Backfill empty cells
  const handleBackfill = async () => {
    setIsCleaning('backfill');
    await new Promise(r => setTimeout(r, 600));

    // Calculate column medians for numeric columns
    const medians: { [key: string]: number } = {};
    columns.forEach(col => {
      const nums = data
        .map(row => Number(row[col]))
        .filter(val => !isNaN(val) && val !== null && val !== undefined);
      
      if (nums.length > 0) {
        const sorted = [...nums].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        medians[col] = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      }
    });

    let filledCount = 0;
    const cleaned = data.map(row => {
      const newRow = { ...row };
      columns.forEach(col => {
        const val = newRow[col];
        if (val === null || val === undefined || String(val).trim() === '') {
          if (medians[col] !== undefined) {
            newRow[col] = medians[col]; // Backfill numeric with median
          } else {
            newRow[col] = '-'; // Backfill text with dash
          }
          filledCount++;
        }
      });
      return newRow;
    });

    onDataSanitized(cleaned);
    addLog(`Imputation: Filled ${filledCount} empty/null cells.`);
    toast.success(`Backfilled ${filledCount} empty fields successfully!`);
    setIsCleaning(null);
  };

  return (
    <Card className="border border-primary/10 rounded-2xl shadow-sm bg-card/45 backdrop-blur-md overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Grid className="h-24 w-24" />
      </div>

      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
            AI Client-Side Data Sanitizer
          </CardTitle>
          <Badge 
            variant={stats.isFullyClean ? "default" : "secondary"}
            className={stats.isFullyClean ? "bg-emerald-500/10 text-emerald-500 border-0" : "bg-amber-500/10 text-amber-500 border-0"}
          >
            {stats.isFullyClean ? "Dataset Clean" : "Sanitization Alert"}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Auto-scan and repair anomalies, missing values, or formatting conflicts inside your browser.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Scanned Warnings Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Duplicates block */}
          <div className={`p-3 rounded-xl border flex items-center gap-3 ${stats.duplicates > 0 ? 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
            {stats.duplicates > 0 ? <AlertTriangle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
            <div>
              <h4 className="font-bold text-xs">Duplicate Rows</h4>
              <p className="text-[10px] opacity-90">{stats.duplicates > 0 ? `${stats.duplicates} rows found` : 'No duplicates detected'}</p>
            </div>
          </div>

          {/* Missing cells block */}
          <div className={`p-3 rounded-xl border flex items-center gap-3 ${stats.nullCells > 0 ? 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
            {stats.nullCells > 0 ? <AlertTriangle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
            <div>
              <h4 className="font-bold text-xs">Missing Values</h4>
              <p className="text-[10px] opacity-90">{stats.nullCells > 0 ? `${stats.nullCells} null cells found` : 'Fully populated'}</p>
            </div>
          </div>

          {/* Dirty dates block */}
          <div className={`p-3 rounded-xl border flex items-center gap-3 ${stats.unstructuredDates > 0 ? 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
            {stats.unstructuredDates > 0 ? <AlertTriangle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
            <div>
              <h4 className="font-bold text-xs">Unstructured Dates</h4>
              <p className="text-[10px] opacity-90">{stats.unstructuredDates > 0 ? `${stats.unstructuredDates} format warnings` : 'Dates normalized'}</p>
            </div>
          </div>
        </div>

        {/* Cleaning Action Controls */}
        <div className="flex flex-wrap gap-2 pt-1.5">
          <Button 
            onClick={handleDeduplicate}
            disabled={stats.duplicates === 0 || isCleaning !== null}
            variant="outline"
            className="rounded-xl text-xs font-bold flex items-center gap-1.5"
            size="sm"
          >
            {isCleaning === 'dedup' ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5 text-primary" />
            )}
            Deduplicate Rows
          </Button>

          <Button 
            onClick={handleNormalizeDates}
            disabled={stats.unstructuredDates === 0 || isCleaning !== null}
            variant="outline"
            className="rounded-xl text-xs font-bold flex items-center gap-1.5"
            size="sm"
          >
            {isCleaning === 'dates' ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Calendar className="h-3.5 w-3.5 text-primary" />
            )}
            Normalize Dates
          </Button>

          <Button 
            onClick={handleBackfill}
            disabled={stats.nullCells === 0 || isCleaning !== null}
            variant="outline"
            className="rounded-xl text-xs font-bold flex items-center gap-1.5"
            size="sm"
          >
            {isCleaning === 'backfill' ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileCheck className="h-3.5 w-3.5 text-primary" />
            )}
            Backfill Empty Cells
          </Button>
        </div>

        {/* Interactive Audit Logs Console */}
        {auditLogs.length > 0 && (
          <div className="border-t border-border/30 pt-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
              <FileSpreadsheet className="h-3.5 w-3.5 text-primary/75" />
              Sanitizer Steps Log
            </h4>
            <div className="bg-muted/30 border rounded-xl p-3 font-mono text-[9px] text-muted-foreground space-y-1">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
