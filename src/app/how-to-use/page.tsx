"use client";

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  UploadCloud,
  LineChart,
  MessageSquareCode,
  FileDown,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export default function HowToUsePage() {
  const steps = [
    {
      id: 'upload',
      title: '1. Upload Dataset',
      icon: UploadCloud,
      color: 'text-blue-500 bg-blue-500/10',
      description: 'Easily drag and drop your spreadsheet data to get started.',
      details: [
        'Supports CSV (.csv) and Excel (.xlsx) file formats.',
        'Data is parsed instantly in-browser using secure high-performance workers.',
        'Your uploaded files remain isolated and private inside your session.',
        'Supports column headers to automatically identify data dimensions.'
      ]
    },
    {
      id: 'visualize',
      title: '2. Dynamic Charts',
      icon: LineChart,
      color: 'text-violet-500 bg-violet-500/10',
      description: 'Uncover immediate patterns with auto-generated charts.',
      details: [
        'Choose from dynamic Line, Bar, Pie, Area, Radar, and Scatter charts.',
        'Select variables for the X-Axis and Y-Axis from dropdown controllers.',
        'Set custom aggregate values to sum values by text dimensions.',
        'Charts are fully responsive and styled with professional harmonized color palettes.'
      ]
    },
    {
      id: 'ai-chat',
      title: '3. AI Assistant',
      icon: MessageSquareCode,
      color: 'text-emerald-500 bg-emerald-500/10',
      description: 'Interact directly with your spreadsheet using conversational AI.',
      details: [
        'Ask questions like: "What was our highest selling item last quarter?"',
        'Request custom 1-Day, 1-Week, 15-Day, or monthly business reports.',
        'Identify correlations, outliers, or growth predictions automatically.',
        'No SQL knowledge required—the AI processes natural language queries instantly.'
      ]
    },
    {
      id: 'export',
      title: '4. Download Reports',
      icon: FileDown,
      color: 'text-amber-500 bg-amber-500/10',
      description: 'Keep your team aligned by exporting your processed datasets.',
      details: [
        'Download filtered search tables back as formatted CSVs.',
        'Export dynamic visualizations directly into reports.',
        'Save AI-generated report logs for sharing and future reference.',
        'Save active sessions in Supabase to restore past data at any time.'
      ]
    }
  ];

  const faqs = [
    {
      q: 'Where does my uploaded data go?',
      a: 'If you are a guest, your data stays entirely on your local browser session and is never uploaded to any external server. If you register an account, your data is securely stored in your personal Supabase database instance for cloud synchronization, giving you absolute ownership.'
    },
    {
      q: 'Can I upload files with empty or null cells?',
      a: 'Yes! The parser handles missing or irregular data gracefully. It automatically identifies missing fields and alerts you or represents them cleanly in statistical distributions.'
    },
    {
      q: 'Which AI models power the analysis?',
      a: 'The conversational analysis and report generation is powered by high-performance models available on OpenRouter, guaranteeing quick responses, smart context windows, and high analytical accuracy.'
    },
    {
      q: 'How large of a file can I upload?',
      a: 'For local browser processing, we comfortably support files up to 20MB or approximately 150,000 rows. Files beyond this can be uploaded but may take slightly longer to process.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/15 relative overflow-hidden pb-16">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-64 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 py-16 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Easy-to-follow user guide
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
            How to Use <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent font-extrabold">Business Analytics</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn how to upload datasets, analyze trends using dynamic visualizations, and query our advanced AI model for deep reports.
          </p>
        </div>

        {/* Step-by-Step Tabs */}
        <Card className="border border-primary/10 bg-card/60 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden mb-16">
          <CardHeader className="bg-muted/30 border-b p-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              The Business Analytics Workflow
            </CardTitle>
            <CardDescription>
              Click on each tab to explore details and features.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-secondary/50 border rounded-2xl mb-8 gap-1">
                {steps.map(step => (
                  <TabsTrigger 
                    key={step.id} 
                    value={step.id} 
                    className="rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm select-none cursor-pointer transition-all"
                  >
                    <step.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    <span className="hidden sm:inline">{step.title.split(' ')[1]}</span>
                    <span className="sm:hidden">{step.title.split(' ')[1]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {steps.map(step => (
                <TabsContent key={step.id} value={step.id} className="space-y-6 focus-visible:outline-none">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="md:w-2/5 space-y-4">
                      <div className={`p-4 rounded-2xl h-14 w-14 flex items-center justify-center ${step.color} shadow-sm`}>
                        <step.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                      
                      <Link href="/dashboard" className="inline-block pt-2">
                        <Button className="rounded-xl flex items-center gap-2 group font-semibold shadow-md">
                          Try it now
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>

                    <div className="md:w-3/5 grid gap-4 bg-muted/20 p-6 rounded-2xl border">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm leading-relaxed text-foreground/80">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Everything you need to know about our data policies and limits.</p>
          </div>

          <Card className="border border-primary/10 bg-card/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b/60 last:border-b-0 py-1">
                  <AccordionTrigger className="text-base font-bold text-left hover:text-primary transition-colors py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </main>
    </div>
  );
}
