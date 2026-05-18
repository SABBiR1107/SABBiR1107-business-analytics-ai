"use client";

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Bot, User, AlertCircle, Sparkles, Terminal, Copy, Check, FileSpreadsheet, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  dataset: any;
}

export function ChatInterface({ dataset }: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ChatGPT Top Model Definitions
  const models = [
    { id: 'gpt-4o', name: 'GPT-4o', desc: 'Default ultra-fast & smart model', icon: Sparkles, apiName: 'openai/gpt-4o' },
    { id: 'claude-3-5-sonnet', name: 'Claude Sonnet', desc: 'Best for structured summaries & coding', icon: Bot, apiName: 'anthropic/claude-sonnet-4.6' },
    { id: 'gemini-1-5-pro', name: 'Gemini Pro', desc: 'Perfect for deep logic & long datasets', icon: Sparkles, apiName: 'google/gemini-2.5-pro' },
    { id: 'o1-pro', name: 'o1 Pro', desc: 'Advanced complex reasoning model', icon: Terminal, apiName: 'openai/o1-pro' }
  ];

  const [selectedModel, setSelectedModel] = useState(models[0]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: { dataset, model: selectedModel.apiName },
    onError: (err) => {
      console.error('Chat error:', err);
      setApiError(err.message || 'Failed to get response from AI');
    },
    onResponse: () => {
      setApiError(null);
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const quickReports = [
    { label: '1-Day Report', prompt: 'Generate a 1-day business report based on the data' },
    { label: '1-Week Report', prompt: 'Generate a 1-week business report with trends and insights' },
    { label: '15-Day Report', prompt: 'Generate a 15-day business analytics report' },
    { label: 'Monthly Report', prompt: 'Generate a comprehensive monthly business report' },
  ];

  const handleQuickReport = (prompt: string) => {
    if (isLoading) return;
    
    setApiError(null);
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    
    handleInputChange({
      target: { value: prompt },
    } as React.ChangeEvent<HTMLInputElement>);
    
    setTimeout(() => handleSubmit(syntheticEvent), 0);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setApiError(null);
    handleSubmit(e);
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Safe helper parser for inline bold and badge highlighted text
  const parseInlineBold = (text: string) => {
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return <strong key={bIdx} className="font-extrabold text-foreground bg-primary/5 px-1.5 py-0.5 rounded border border-primary/5">{bPart.slice(2, -2)}</strong>;
      }
      return bPart;
    });
  };

  /**
   * Premium custom Markdown report parser for gorgeous, highly structured report outputs.
   */
  const renderMessageContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code content
        const lines = part.slice(3, -3).trim().split('\n');
        let language = 'code';
        let codeBody = part.slice(3, -3).trim();

        if (lines.length > 0 && lines[0].length < 15 && !lines[0].includes(' ') && isNaN(Number(lines[0]))) {
          language = lines[0];
          codeBody = lines.slice(1).join('\n');
        }

        const blockId = `${msgId}-code-${index}`;

        return (
          <div key={index} className="my-4 border border-border/40 rounded-xl overflow-hidden bg-slate-950 shadow-md max-w-full">
            {/* Code Block Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-border/20 text-[10px] text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                {language}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopyCode(codeBody, blockId)}
                className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-slate-800 rounded-md"
              >
                {copiedId === blockId ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            {/* Scrollable Container with break word safety */}
            <pre className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 text-[11px] leading-relaxed text-emerald-400 font-mono select-text whitespace-pre">
              <code>{codeBody}</code>
            </pre>
          </div>
        );
      }

      // State machine table parser for premium widescreen HTML tables
      const lines = part.split('\n');
      const renderedElements: React.ReactNode[] = [];
      let currentTableRows: string[][] = [];
      let isInsideTable = false;

      const renderTable = (rows: string[][], tableIdx: number) => {
        if (rows.length === 0) return null;
        
        // The first row is the header row
        const headers = rows[0];
        const bodyRows = rows.slice(1);

        return (
          <div key={`table-${tableIdx}`} className="my-5 overflow-x-auto border border-border/40 rounded-xl bg-slate-900/10 backdrop-blur-md shadow-sm max-w-full">
            <table className="w-full text-left border-collapse text-[12px] sm:text-[13px]">
              <thead>
                <tr className="bg-primary/10 border-b border-border/30">
                  {headers.map((cell, cellIdx) => (
                    <th key={cellIdx} className="px-4 py-3 font-extrabold text-foreground tracking-tight whitespace-nowrap">
                      {parseInlineBold(cell.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {bodyRows.map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    className="hover:bg-primary/5 transition-colors odd:bg-secondary/15 even:bg-transparent"
                  >
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-2.5 font-medium text-foreground/90 whitespace-normal">
                        {parseInlineBold(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      };

      const flushTable = (lineIdx: number) => {
        if (currentTableRows.length > 0) {
          renderedElements.push(renderTable(currentTableRows, lineIdx));
          currentTableRows = [];
          isInsideTable = false;
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Check if line is a table row: starts with '|' and ends with '|'
        const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 1;

        if (isTableRow) {
          // If it is a separator line (e.g. |---|---|), skip adding it as a data row
          const isSeparator = /^[|:\s-]+$/.test(trimmed);
          if (isSeparator) {
            isInsideTable = true;
            continue;
          }

          // Split cells by pipe and remove empty first/last elements
          let cells = line.split('|').map(c => c.trim());
          if (line.startsWith('|')) cells.shift();
          if (line.endsWith('|')) cells.pop();

          if (!isInsideTable) {
            isInsideTable = true;
          }
          currentTableRows.push(cells);
        } else {
          // Line is not a table row. If we had an active table, flush/render it first
          flushTable(i);

          // Handle standard markdown formatting for the non-table line
          // 1. Horizontal Rules
          if (trimmed === '---') {
            renderedElements.push(<hr key={i} className="my-4 border-t border-border/40" />);
            continue;
          }

          // 2. Headings (H1, H2, H3)
          if (trimmed.startsWith('# ')) {
            renderedElements.push(
              <h1 key={i} className="text-lg sm:text-xl font-black text-foreground pt-5 pb-1.5 border-b border-border/20 flex items-center gap-2 tracking-tight">
                {parseInlineBold(trimmed.substring(2))}
              </h1>
            );
            continue;
          }
          if (trimmed.startsWith('## ')) {
            renderedElements.push(
              <h2 key={i} className="text-base sm:text-lg font-extrabold text-primary pt-4 pb-1 tracking-tight">
                {parseInlineBold(trimmed.substring(3))}
              </h2>
            );
            continue;
          }
          if (trimmed.startsWith('### ')) {
            renderedElements.push(
              <h3 key={i} className="text-sm sm:text-base font-extrabold text-foreground pt-3 pb-0.5 tracking-tight flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {parseInlineBold(trimmed.substring(4))}
              </h3>
            );
            continue;
          }

          // 3. Bullet list items
          const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
          if (isBullet) {
            renderedElements.push(
              <p key={i} className="pl-5.5 relative before:content-['•'] before:absolute before:left-1.5 before:text-primary before:font-bold leading-relaxed my-1.5 select-text text-foreground/90">
                {parseInlineBold(trimmed.substring(2))}
              </p>
            );
            continue;
          }

          // 4. Blank lines spacer
          if (trimmed === '') {
            renderedElements.push(<div key={i} className="h-1.5" />);
            continue;
          }

          // 5. Standard Paragraph lines
          renderedElements.push(
            <p key={i} className="leading-relaxed mb-1.5 select-text">
              {parseInlineBold(line)}
            </p>
          );
        }
      }

      // Flush any trailing table at the end of lines
      flushTable(lines.length);

      return (
        <div key={index} className="space-y-3.5 text-[13px] sm:text-[14.5px] leading-relaxed select-text font-medium text-foreground/95">
          {renderedElements}
        </div>
      );
    });
  };

  return (
    <Card className="flex flex-col h-[550px] sm:h-[650px] md:h-[800px] border border-primary/10 bg-card/20 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden relative">
      {/* ChatGPT Style Model Selector Header with Dropdown */}
      <CardHeader className="bg-muted/5 border-b border-border/20 px-6 py-4.5 flex flex-row items-center justify-between shrink-0 relative z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="relative">
            {/* Interactive Model Toggle */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-sm font-extrabold flex items-center gap-1.5 text-foreground/90 tracking-tight hover:text-primary transition-colors bg-secondary/40 hover:bg-secondary/70 px-3 py-1.5 rounded-xl border border-border/40 select-none cursor-pointer"
            >
              {selectedModel.name}
              <span className="text-[9px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded font-black tracking-normal uppercase">Active</span>
              <svg className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Model Selector Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                  {models.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setIsDropdownOpen(false);
                        toast.success(`Switched AI Model to ${m.name}`);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 hover:bg-primary/5 group ${selectedModel.id === m.id ? 'bg-primary/10 text-primary' : 'text-foreground/80'}`}
                    >
                      <m.icon className={`h-4.5 w-4.5 mt-0.5 shrink-0 ${selectedModel.id === m.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'}`} />
                      <div>
                        <div className="text-xs font-bold leading-tight">{m.name}</div>
                        <div className="text-[9px] text-muted-foreground leading-normal mt-0.5 font-medium">{m.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-0 p-0 overflow-hidden relative">
        {/* Ambient background gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 -translate-y-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-[90px] pointer-events-none" />

        {/* Messages Stream */}
        <ScrollArea className="flex-1 h-0 min-h-0 px-4 sm:px-6 relative z-10">
          <div className="w-full px-1 sm:px-4 py-8 space-y-6">
            {messages.length === 0 ? (
              /* ChatGPT Empty State Intro with 2x2 Suggestion Cards */
              <div className="flex flex-col items-center justify-center py-8 text-center max-w-3xl mx-auto">
                <div className="bg-gradient-to-tr from-primary to-violet-600 p-4.5 rounded-3xl w-16 h-16 flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/20 mb-5 relative group">
                  <Bot className="h-8 w-8 text-primary-foreground group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-1 -right-1 bg-emerald-500 h-3.5 w-3.5 rounded-full border-2 border-background animate-ping" />
                  <div className="absolute -top-1 -right-1 bg-emerald-500 h-3.5 w-3.5 rounded-full border-2 border-background" />
                </div>
                
                <h3 className="text-xl font-black text-foreground/90 tracking-tight">
                  How can I help you analyze your data today?
                </h3>
                <p className="text-xs text-muted-foreground mt-2 max-w-md leading-relaxed font-medium">
                  Select one of our specialized business summary summaries below, or write a custom query to extract predictive insights.
                </p>

                {/* 2x2 Suggestion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-10">
                  {quickReports.map((report) => (
                    <button
                      key={report.label}
                      onClick={() => handleQuickReport(report.prompt)}
                      className="text-left p-4.5 rounded-2xl border border-border/40 hover:border-primary/40 bg-card/45 hover:bg-card/90 transition-all shadow-sm hover:shadow-md flex flex-col justify-between min-h-[105px] group text-foreground relative overflow-hidden"
                    >
                      {/* Subtle micro hover indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform" />
                      <span className="text-xs font-bold text-foreground/90 group-hover:text-primary transition-colors pr-6">
                        {report.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-normal mt-2 block font-semibold group-hover:text-foreground/80 transition-colors">
                        {report.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ChatGPT Chat Thread */
              <div className="space-y-6">
                {messages.map((message) => {
                  const [mainContent, suggestionsPart] = message.content.split('[SUGGESTED_QUESTIONS]');
                  
                  let parsedSuggestions: string[] = [];
                  if (suggestionsPart) {
                    parsedSuggestions = suggestionsPart
                      .split('\n')
                      .map(line => line.trim())
                      .filter(line => line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line))
                      .map(line => line.replace(/^[-*\d\.]+\s*/, '').trim())
                      .filter(line => line.length > 0)
                      .slice(0, 3);
                  }

                  const isLatestAssistant = message.role === 'assistant' && messages.indexOf(message) === messages.length - 1;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-4 w-full ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="rounded-xl bg-primary/10 border border-primary/20 p-2 h-9 w-9 shrink-0 flex items-center justify-center text-primary shadow-sm">
                          <Bot className="h-5 w-5" />
                        </div>
                      )}
                      
                      {message.role === 'assistant' ? (
                        <div className="flex flex-col gap-2.5 max-w-full flex-1 min-w-0">
                          <div className="w-full bg-muted/30 border border-border/30 rounded-2xl px-5 py-4 rounded-tl-none text-foreground/90 shadow-sm text-sm break-words overflow-hidden">
                            {renderMessageContent(mainContent, message.id)}
                          </div>
                          
                          {(!isLoading && (parsedSuggestions.length > 0 || isLatestAssistant)) && (
                            <div className="flex flex-wrap gap-2 px-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                              {/* Dynamic Suggested Questions */}
                              {parsedSuggestions.map((suggestion, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => handleQuickReport(suggestion)}
                                  className="text-xs font-bold text-primary hover:text-primary-foreground bg-primary/5 hover:bg-primary border border-primary/20 hover:border-primary px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 select-none cursor-pointer"
                                >
                                  <Sparkles className="h-3 w-3 shrink-0" />
                                  {suggestion}
                                </button>
                              ))}

                              {/* Interactive Click-to-Continue button */}
                              {isLatestAssistant && (
                                <button
                                  onClick={() => handleQuickReport("Continue writing from where you left off. Do not repeat your previous sentences, just continue generating the next section of the analysis directly.")}
                                  className="text-xs font-bold text-emerald-500 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 hover:border-emerald-500 px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 select-none cursor-pointer"
                                >
                                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                  </svg>
                                  Continue Generating
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl px-5 py-4 max-w-[85%] sm:max-w-[78%] break-words overflow-hidden border transition-all bg-primary text-primary-foreground border-primary/10 rounded-tr-none shadow-[0_4px_12px_rgba(var(--primary-rgb),0.15)] font-medium text-[13px] leading-relaxed">
                          {renderMessageContent(message.content, message.id)}
                        </div>
                      )}
                      
                      {message.role === 'user' && (
                        <div className="rounded-xl bg-primary border border-primary/10 p-2 h-9 w-9 shrink-0 flex items-center justify-center text-primary-foreground shadow-sm">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-2 h-9 w-9 flex items-center justify-center text-primary">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-2xl px-5 py-3.5 bg-muted/35 border border-border/30 rounded-tl-none flex items-center gap-2.5 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs font-bold text-muted-foreground/90 animate-pulse">Analyzing spreadsheet...</span>
                </div>
              </div>
            )}

            {(apiError || error) && (
              <Alert variant="destructive" className="rounded-2xl border-destructive/25 bg-destructive/10 max-w-xl mx-auto shadow-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <AlertDescription className="text-xs font-semibold">
                  {apiError || error?.message || 'Failed to process request. Verify your OPENROUTER_API_KEY inside your local environment settings.'}
                </AlertDescription>
              </Alert>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Floating Capsule Input Box */}
        <form onSubmit={onSubmit} className="w-full shrink-0 relative z-10 mt-2 bg-gradient-to-t from-background via-background/90 to-transparent pt-4">
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-4">
            <div className="relative flex items-center border border-border/60 bg-background/90 backdrop-blur-md rounded-2xl p-1.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              
              {/* Chat Icon & Attachment tag on left */}
              <div className="pl-3 pr-1.5 flex items-center shrink-0">
                <MessageSquare className="h-4.5 w-4.5 text-muted-foreground/60" />
              </div>

              
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask anything about your business data..."
                disabled={isLoading}
                className="flex-1 min-w-0 bg-transparent py-2.5 px-1 text-sm outline-none placeholder:text-muted-foreground/60 select-text font-medium"
              />
              
              {/* Send Button */}
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="h-9.5 w-9.5 rounded-xl p-0 shrink-0 bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center justify-center shadow-md ml-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <p className="text-[9px] text-center text-muted-foreground/50 mt-2.5 font-bold tracking-wider uppercase select-none">
              Business Analytics Assistant can make mistakes. Verify important charts & predictions.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}