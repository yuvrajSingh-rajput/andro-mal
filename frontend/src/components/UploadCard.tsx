import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X, Loader2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface UploadCardProps {
  onUploadStart: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
  errorStr?: string;
}

export const UploadCard: React.FC<UploadCardProps> = ({ onUploadStart, isUploading, uploadProgress, errorStr }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.android.package-archive': ['.apk'],
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

  return (
    <div className="bg-card backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 shadow-2xl w-full max-w-xl mx-auto transition-all">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Android Malware Sandbox
        </h2>
        <p className="text-slate-400 mt-2 text-sm">Upload an APK file to perform deep static and dynamic analysis.</p>
      </div>

      {errorStr && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
          <span>{errorStr}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={twMerge(
            clsx(
              "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors",
              isDragActive ? "border-blue-500 bg-blue-500/5" : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/50"
            )
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
          <p className="text-slate-300 font-medium text-center">
            {isDragActive ? "Drop the APK here" : "Drag & drop an APK file"}
          </p>
          <p className="text-slate-500 text-xs mt-2">Max limit: 100MB</p>
        </div>
      ) : (
        <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-6 relative">
          {!isUploading && (
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <FileIcon className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 font-medium truncate">{selectedFile.name}</p>
              <p className="text-slate-400 text-xs">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-3 rounded-lg font-semibold flex items-center justify-center transition-colors shadow-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing... {uploadProgress}%
              </>
            ) : (
              "Analyze File"
            )}
          </button>

          {isUploading && (
            <div className="mt-4 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
