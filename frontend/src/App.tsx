import { useState, useEffect } from 'react';
import { UploadCard } from './components/UploadCard';
import { ResultCard } from './components/ResultCard';
import { InstallPrompt } from './components/InstallPrompt';
import { uploadApk, pollJobResult } from './api/client';
import type { ApkAnalysisResult, DynamicJobInfo } from './types';
import { Shield } from 'lucide-react';

function App() {
  const [result, setResult] = useState<ApkAnalysisResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorStr, setErrorStr] = useState<string | undefined>();
  const [jobId, setJobId] = useState<string | null>(null);
  const [dynamicJob, setDynamicJob] = useState<DynamicJobInfo | null>(null);

  useEffect(() => {
    let timeoutId: number;

    const poll = async () => {
      if (!jobId) return;
      try {
        const data = await pollJobResult(jobId);
        if (data) {
          setDynamicJob(data);
          if (data.status === 'complete') {
            setResult(data.result);
            setIsUploading(false);
            setJobId(null);
            setDynamicJob(null);
          } else if (data.status === 'error') {
            setErrorStr(data.message || 'Unknown error during dynamic analysis');
            if (data.result) {
              setResult(data.result);
            }
            setIsUploading(false);
            setJobId(null);
            setDynamicJob(data);
          } else {
            timeoutId = window.setTimeout(poll, 1500);
          }
        }
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : undefined;
        setErrorStr(message || 'Polling failed');
        setIsUploading(false);
        setJobId(null);
        setDynamicJob(null);
      }
    };

    poll();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [jobId]);

  const handleUploadStart = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setErrorStr(undefined);
    setResult(null);
    setDynamicJob(null);

    try {
      const data = await uploadApk(file, (pct) => setUploadProgress(pct));
      
      if (data.job_id) {
        setJobId(data.job_id);
        setResult(data.static_result);
        setDynamicJob({
          status: 'running',
          stage: 'Initializing dynamic sandbox...',
          stage_index: 1,
          total_stages: 4,
          progress: 5,
          elapsed_seconds: 0,
          estimated_seconds: 90
        });
        setIsUploading(false);
      } else if (data.status === 'success') {
        setResult(data);
        setIsUploading(false);
      } else {
        setErrorStr(data.message || 'Analysis failed');
        setIsUploading(false);
      }
    } catch (err: unknown) {
      const errorObj = err && typeof err === 'object' ? (err as { response?: { data?: { message?: string } }; message?: string }) : null;
      const message = errorObj?.response?.data?.message || errorObj?.message || 'Upload failed';
      setErrorStr(message);
      setIsUploading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setErrorStr(undefined);
    setUploadProgress(0);
    setJobId(null);
    setDynamicJob(null);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col selection:bg-accent/20 selection:text-text">
      {/* App shell: slim top bar */}
      <header className="h-14 border-b border-border bg-surface px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-button bg-surface-2 border border-border flex items-center justify-center text-accent">
            <Shield className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="font-semibold text-text text-sm tracking-tight">AndroMal</span>
        </div>

        <span className="text-xs font-mono text-muted">
          Static + dynamic APK analysis
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-8 sm:py-12 flex flex-col items-center justify-start">
        {!result ? (
          <UploadCard 
            onUploadStart={handleUploadStart} 
            isUploading={isUploading} 
            uploadProgress={uploadProgress} 
            errorStr={errorStr} 
          />
        ) : (
          <ResultCard 
            result={result} 
            onReset={reset}
            dynamicJob={dynamicJob}
          />
        )}
      </main>

      <InstallPrompt />
    </div>
  );
}

export default App;
