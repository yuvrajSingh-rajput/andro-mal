import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: VITE_API_URL,
});

export const uploadApk = async (file: File, onProgress: (pct: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const total = progressEvent.total || file.size;
      const pct = Math.round((progressEvent.loaded * 100) / total);
      onProgress(pct);
    }
  });

  return response.data;
};

export const pollJobResult = async (jobId: string) => {
  const response = await apiClient.get(`/result/${jobId}`);
  return response.data;
};
