"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { saveDataset, getUserDatasets, deleteDataset, SavedDataset } from '@/lib/supabaseStorage';
import { FileUpload } from '@/components/FileUpload';
import { DataCharts } from '@/components/DataCharts';
import { ChatInterface } from '@/components/ChatInterface';
import { DataStatistics } from '@/components/DataStatistics';
import { EnhancedDataTable } from '@/components/EnhancedDataTable';
import { ExportData } from '@/components/ExportData';
import { DataLoadingSkeleton } from '@/components/DataLoadingSkeleton';
import { Navbar } from '@/components/Navbar';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthModal } from '@/components/AuthModal';
import {
  BarChart3,
  FileSpreadsheet,
  Sparkles,
  Database,
  History,
  Trash2,
  Calendar,
  CloudLightning,
  AlertCircle,
  Lock,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, loading, isConfigured } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyDatasets, setHistoryDatasets] = useState<SavedDataset[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  // Load user datasets
  const fetchDatasets = useCallback(async () => {
    if (!user) return;
    setIsHistoryLoading(true);
    try {
      const data = await getUserDatasets(user?.id);
      setHistoryDatasets(data);
    } catch (err) {
      console.error('Failed to load datasets:', err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDatasets();
    }
  }, [user, fetchDatasets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
          <span className="text-xs font-semibold text-muted-foreground animate-pulse">Verifying workspace session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-16 flex flex-col justify-between relative overflow-hidden">
        {/* Header Navbar */}
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
          {/* Glow Spheres */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

          <Card className="max-w-md w-full border border-primary/20 bg-card/45 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
            <div className="mx-auto bg-primary/10 p-4 rounded-2xl h-14 w-14 flex items-center justify-center mb-6 text-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] animate-pulse">
              <Lock className="h-6.5 w-6.5" />
            </div>

            <h2 className="text-2xl font-black tracking-tight mb-3">Secure Workspace</h2>
            <p className="text-muted-foreground text-xs leading-relaxed mb-8">
              Access to the business analytics dashboard is restricted to registered members. Log in or create an account to start uploading files, generating charts, and conversing with AI.
            </p>

            <Button
              onClick={() => setIsAuthOpen(true)}
              size="lg"
              className="w-full py-6 rounded-2xl font-bold text-sm shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_0_35px_rgba(var(--primary-rgb),0.3)] transition-all"
            >
              Sign In / Register
            </Button>
          </Card>
        </main>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

        {/* Small Footer */}
        <div className="py-6 border-t border-border/40 bg-background/50 backdrop-blur-md relative z-10">
          <div className="container mx-auto px-4 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground">
            <div>
              © {new Date().getFullYear()} Business Analytics. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-500 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
                Session Secure
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-muted-foreground/60" />
                AES-256 Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const handleDataUploaded = async (data: any, originalFileName?: string) => {
    setIsLoading(true);
    
    // Fallback file name
    const fileName = originalFileName || data.filename || 'business-data.csv';

    // Save to Supabase DB or Local Storage
    try {
      await saveDataset(user?.id, fileName, data.data, data.columns);
      // Reload history list
      fetchDatasets();
    } catch (err) {
      console.warn('Dataset cloud save skipped/failed:', err);
    }

    // Simulate short processing time for UX feel
    setTimeout(() => {
      setUploadedData({
        data: data.data,
        columns: data.columns,
        rowCount: data.data.length,
        filename: fileName
      });
      setIsLoading(false);
      toast.success(`Successfully loaded "${fileName}" with ${data.data.length} rows!`);
    }, 500);
  };

  const handleLoadHistoryDataset = (dataset: SavedDataset) => {
    setIsLoading(true);
    setTimeout(() => {
      setUploadedData({
        data: dataset.data,
        columns: dataset.columns,
        rowCount: dataset.row_count,
        filename: dataset.filename
      });
      setIsLoading(false);
      toast.success(`Restored dataset "${dataset.filename}" from history!`);
    }, 400);
  };

  const handleDeleteHistoryDataset = async (e: React.MouseEvent, datasetId: string) => {
    e.stopPropagation();
    try {
      const success = await deleteDataset(datasetId, user?.id);
      if (success) {
        setHistoryDatasets(prev => prev.filter(d => d.id !== datasetId));
        if (uploadedData?.id === datasetId || (uploadedData && historyDatasets.find(d => d.id === datasetId)?.filename === uploadedData.filename)) {
          setUploadedData(null);
        }
      }
    } catch (err) {
      toast.error('Failed to delete dataset');
    }
  };

  const handleReset = () => {
    setUploadedData(null);
    toast.info('Ready to analyze a new file');
  };

  const handleExport = () => {
    if (exportButtonRef.current) {
      exportButtonRef.current.click();
    }
  };

  const handleSearch = () => {
    const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {!uploadedData && !isLoading ? (
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 items-start">
            {/* Left Col: Upload Block */}
            <div className="md:col-span-2 space-y-6">
              <div className="text-center md:text-left mb-6 space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Get Started with Your Data
                </h2>
                <p className="text-muted-foreground text-sm">
                  Upload your business spreadsheet to unlock custom charts, real-time analytics, and conversational AI reports.
                </p>
              </div>

              <FileUpload onDataUploaded={(data) => handleDataUploaded(data)} />

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-2xl border bg-card/60 backdrop-blur-md shadow-sm">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold text-xs mb-0.5">Visuals</h3>
                  <p className="text-[10px] text-muted-foreground">Premium analytics charts</p>
                </div>
                <div className="text-center p-4 rounded-2xl border bg-card/60 backdrop-blur-md shadow-sm">
                  <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary animate-pulse" />
                  <h3 className="font-bold text-xs mb-0.5">AI Reports</h3>
                  <p className="text-[10px] text-muted-foreground">Smart predictive insights</p>
                </div>
                <div className="text-center p-4 rounded-2xl border bg-card/60 backdrop-blur-md shadow-sm">
                  <FileSpreadsheet className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold text-xs mb-0.5">Export</h3>
                  <p className="text-[10px] text-muted-foreground">Download custom clean CSVs</p>
                </div>
              </div>
            </div>

            {/* Right Col: Dataset History */}
            <div className="space-y-4">
              <Card className="border border-primary/10 rounded-2xl shadow-sm bg-card/60 backdrop-blur-md">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <History className="h-4.5 w-4.5 text-primary" />
                    Dataset History
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {user ? 'Manage your cloud-synchronized datasets.' : 'Manage locally saved datasets.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 max-h-[400px] overflow-y-auto space-y-3">
                  {!isConfigured && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2.5 items-start text-xs text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Database offline.</span> Connect Supabase environment variables in `.env` for persistent cloud storage.
                      </div>
                    </div>
                  )}

                  {isHistoryLoading ? (
                    <div className="space-y-2 pt-2">
                      <div className="h-10 bg-muted animate-pulse rounded-lg" />
                      <div className="h-10 bg-muted animate-pulse rounded-lg" />
                    </div>
                  ) : historyDatasets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      <Database className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      No past datasets found.
                      <p className="opacity-75 mt-1">Upload a spreadsheet file to populate history.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {historyDatasets.map((dataset) => (
                        <div
                          key={dataset.id}
                          onClick={() => handleLoadHistoryDataset(dataset)}
                          className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:border-primary/45 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer group"
                        >
                          <div className="min-w-0 pr-2">
                            <h4 className="font-semibold text-xs truncate text-foreground/90 group-hover:text-primary transition-colors">
                              {dataset.filename}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-0.5">
                                <FileSpreadsheet className="h-3 w-3" />
                                {dataset.row_count} rows
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Calendar className="h-3 w-3" />
                                {new Date(dataset.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteHistoryDataset(e, dataset.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : isLoading ? (
          <DataLoadingSkeleton />
        ) : uploadedData ? (
          <div className="space-y-8">
            {/* Active Dataset Bar */}
            <Card className="border border-primary/20 bg-card/60 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm">
                    <CloudLightning className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-foreground/90 flex items-center gap-2">
                      Active: {uploadedData.filename}
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-0 flex items-center gap-1 font-bold">
                        <Sparkles className="h-3 w-3 animate-spin" />
                        Synchronized
                      </Badge>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ready for advanced dynamic visualization and conversational AI analysis.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div ref={exportButtonRef as any} className="flex-1 sm:flex-none">
                    <ExportData 
                      data={uploadedData.data} 
                      columns={uploadedData.columns}
                      filename={uploadedData.filename.replace(/\.[^/.]+$/, "")}
                    />
                  </div>
                  <Button variant="outline" onClick={handleReset} className="flex-1 sm:flex-none font-bold rounded-xl hover:bg-muted py-5 text-xs">
                    Upload New File
                  </Button>
                  <KeyboardShortcuts 
                    onReset={handleReset}
                    onExport={handleExport}
                    onSearch={handleSearch}
                  />
                </div>
              </div>
            </Card>

            {/* Data Statistics Cards */}
            <DataStatistics 
              data={uploadedData.data} 
              columns={uploadedData.columns} 
            />

            {/* Interactive Data Table Component */}
            <EnhancedDataTable 
              data={uploadedData.data}
              columns={uploadedData.columns}
              rowCount={uploadedData.rowCount}
            />

            {/* Premium Multi-Chart Visual Analytics */}
            <div>
              <h2 className="text-xl md:text-2xl font-black mb-4 flex items-center gap-2 tracking-tight">
                <BarChart3 className="h-5.5 w-5.5 text-primary animate-pulse" />
                Premium Visual Analytics
              </h2>
              <DataCharts 
                data={uploadedData.data} 
                columns={uploadedData.columns} 
              />
            </div>

            {/* Conversational AI Chat Interface */}
            <div className="border-t border-border/40 pt-8">
              <h2 className="text-xl md:text-2xl font-black mb-4 flex items-center gap-2 tracking-tight">
                <Sparkles className="h-5.5 w-5.5 text-primary" />
                Conversational AI Analysis
              </h2>
              <ChatInterface dataset={uploadedData} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}