"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Kbd } from '@/components/ui/kbd';
import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyboardShortcutsProps {
  onReset?: () => void;
  onExport?: () => void;
  onSearch?: () => void;
}

export function KeyboardShortcuts({ onReset, onExport, onSearch }: KeyboardShortcutsProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K - Open keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }

      // Ctrl/Cmd + R - Reset/Upload new file
      if ((e.ctrlKey || e.metaKey) && e.key === 'r' && onReset) {
        e.preventDefault();
        onReset();
      }

      // Ctrl/Cmd + E - Export data
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && onExport) {
        e.preventDefault();
        onExport();
      }

      // Ctrl/Cmd + F - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && onSearch) {
        e.preventDefault();
        onSearch();
      }

      // Escape - Close dialogs
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReset, onExport, onSearch]);

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Open keyboard shortcuts' },
    { keys: ['Ctrl', 'R'], description: 'Upload new file' },
    { keys: ['Ctrl', 'E'], description: 'Export data' },
    { keys: ['Ctrl', 'F'], description: 'Focus search' },
    { keys: ['Esc'], description: 'Close dialogs' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        title="Keyboard Shortcuts (Ctrl+K)"
      >
        <Keyboard className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Speed up your workflow with these keyboard shortcuts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {shortcuts.map((shortcut, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {i > 0 && <span className="text-muted-foreground">+</span>}
                      <Kbd>{key}</Kbd>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Tip:</strong> On Mac, use <Kbd>⌘ Cmd</Kbd> instead of <Kbd>Ctrl</Kbd>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
