import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X, Loader2, AlertCircle, FileSearch, ShieldCheck, Binary } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';

interface UploadCardProps {
  onUploadStart: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
  errorStr?: string;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onUploadStart,
  isUploading,
  uploadProgress,
  errorStr,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: !!selectedFile || isUploading,
    accept: {
      'application/vnd.android.package-archive': ['.apk'],
      'application/octet-stream': ['.apk'],
      'application/x-zip-compressed': ['.apk'],
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading,
  });

  const handleUpload = () => {
    if (selectedFile) {
      onUploadStart(selectedFile);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-[760px] mx-auto flex flex-col items-center">
      {/* Header section with display typography */}
      <div className="text-center mb-8 sm:mb-10 w-full">
        <h1 className="text-3xl sm:text-[44px] leading-[1.1] font-semibold tracking-[-0.02em] text-text">
          Know what an APK does before you run it.
        </h1>
        <p className="text-muted text-[17px] mt-3 max-w-xl mx-auto leading-normal">
          Upload any Android package to perform automated static inspection, runtime behavioral profiling, and ensemble ML classification.
        </p>
      </div>

      {/* Error Banner if any */}
      {errorStr && (
        <div
          role="alert"
          aria-live="polite"
          className="w-full mb-6 p-4 rounded-card border border-danger-border bg-danger-tint flex items-start gap-3 text-danger text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-danger mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold text-danger">Upload failed</p>
            <p className="text-danger/90 text-xs mt-0.5">{errorStr}</p>
          </div>
          {selectedFile && !isUploading && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleUpload}
              className="border-danger-border hover:bg-danger-tint text-danger text-xs h-8"
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Main Dropzone Card */}
      <Card
        className={twMerge(
          clsx(
            'w-full transition-all duration-200 p-6 sm:p-8',
            errorStr && 'border-danger-border'
          )
        )}
      >
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={twMerge(
              clsx(
                'border-[1.5px] border-dashed rounded-card p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent',
                isDragActive
                  ? 'border-accent bg-accent/5'
                  : 'border-border-strong hover:border-accent hover:bg-surface-2/40'
              )
            )}
          >
            <input {...getInputProps()} aria-label="Upload APK file" />

            <div className="w-14 h-14 rounded-card bg-surface-2 border border-border flex items-center justify-center text-accent mb-4 shrink-0">
              <UploadCloud className="w-7 h-7" aria-hidden="true" />
            </div>

            <p className="text-text font-medium text-base">
              {isDragActive ? 'Drop the APK here to analyze' : 'Drag & drop an APK file'}
            </p>

            <p className="text-muted text-sm mt-1 mb-5">
              or select a local package from your device
            </p>

            <Button
              type="button"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="mb-5 shadow-none"
            >
              Browse files
            </Button>

            <div className="flex items-center gap-2 text-xs font-mono text-muted">
              <span className="px-2 py-0.5 rounded border border-border bg-surface-2">.apk only</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded border border-border bg-surface-2">max 100 MB</span>
            </div>
          </div>
        ) : (
          <div className="rounded-card border border-border bg-surface-2/60 p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-card bg-surface border border-border flex items-center justify-center text-accent shrink-0">
                  <FileIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-text font-mono font-medium text-sm truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <p className="text-muted font-mono text-xs mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {!isUploading && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Remove selected file"
                  className="p-1.5 text-muted hover:text-text rounded-button hover:bg-surface transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2" aria-live="polite">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" aria-hidden="true" />
                    Uploading package to sandbox...
                  </span>
                  <span className="text-accent font-semibold">{uploadProgress}%</span>
                </div>
                <ProgressBar value={uploadProgress} label="Upload Progress" height="h-2" />
              </div>
            )}

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B0D12]" aria-hidden="true" />
                  <span>Uploading package ({uploadProgress}%)</span>
                </>
              ) : (
                'Start analysis'
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* 3-column "How it works" */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full text-left">
        <div className="p-4 rounded-card border border-border bg-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileSearch className="w-4 h-4 text-accent" aria-hidden="true" />
              <span className="font-mono text-xs text-muted">01</span>
            </div>
            <h2 className="text-sm font-semibold text-text">Static scan</h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Decodes manifest permissions, native binary flags, DEX bytecode structures, and suspicious APIs in milliseconds.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-card border border-border bg-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
              <span className="font-mono text-xs text-muted">02</span>
            </div>
            <h2 className="text-sm font-semibold text-text">Sandbox run</h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Boots an isolated Android AVD environment with Frida runtime instrumentation to capture live behavioral telemetry.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-card border border-border bg-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Binary className="w-4 h-4 text-accent" aria-hidden="true" />
              <span className="font-mono text-xs text-muted">03</span>
            </div>
            <h2 className="text-sm font-semibold text-text">ML verdict</h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Ensemble voting across Random Forest, XGBoost, and LightGBM classifies benign status and identifies malware families.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
