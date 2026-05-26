"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onDataUploaded: (data: any) => void;
}

export function FileUpload({ onDataUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;

    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      onDataUploaded(result);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Card
      className={`p-8 border-2 border-dashed transition-colors ${
        dragActive ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <FileSpreadsheet className="h-8 w-8 text-primary" />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {uploading ? 'Processing...' : 'Upload Your Business Data'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your CSV or Excel file here, or click to browse
          </p>
        </div>

        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
        
        <Button
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={uploading}
          size="lg"
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Choose File'}
        </Button>

        <p className="text-xs text-muted-foreground">
          Supported formats: CSV, XLS, XLSX
        </p>
      </div>
    </Card>
  );
}
