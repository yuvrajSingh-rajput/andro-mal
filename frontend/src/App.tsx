import { useState, useEffect } from 'react';
import { UploadCard } from './components/UploadCard';
import { ResultCard } from './components/ResultCard';
import { uploadApk, pollJobResult } from './api/client';
import type { ApkAnalysisResult } from './types';

function App() {
  const [result, setResult] = useState<ApkAnalysisResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorStr, setErrorStr] = useState<string | undefined>();
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number;

    const poll = async () => {
      if (!jobId) return;
      try {
        const data = await pollJobResult(jobId);
        if (data && data.status === 'complete') {
          setResult(data.result);
          setIsUploading(false);
          setJobId(null);
        } else if (data && data.status === 'error') {
          setErrorStr(data.message || 'Unknown error during dynamic analysis');
          setIsUploading(false);
          setJobId(null);
        } else {
          timeoutId = window.setTimeout(poll, 2000);
        }
      } catch (err: any) {
        setErrorStr(err.response?.data?.message || 'Polling failed');
        setIsUploading(false);
        setJobId(null);
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

    try {
      const data = await uploadApk(file, (pct) => setUploadProgress(pct));
      
      if (data.job_id) {
        setJobId(data.job_id);
      } else if (data.status === 'success') {
        setResult(data);
        setIsUploading(false);
      } else {
        setErrorStr(data.message || 'Analysis failed');
        setIsUploading(false);
      }
    } catch (err: any) {
      setErrorStr(err.response?.data?.message || err.message || 'Upload failed');
      setIsUploading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setErrorStr(undefined);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl pt-10 flex flex-col justify-center items-center">
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
          />
        )}
      </div>
    </div>
  );
}

export default App;
