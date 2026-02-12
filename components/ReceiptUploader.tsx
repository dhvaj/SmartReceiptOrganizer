import React, { useCallback, useState } from 'react';
import { analyzeReceipt, fileToGenerativePart } from '../services/geminiService';
import { Receipt } from '../types';
import { Plus, Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';

interface ReceiptUploaderProps {
  onReceiptAdded: (receipt: Receipt) => void;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onReceiptAdded }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create a local preview URL for the image immediately
      const imageUrl = URL.createObjectURL(file);
      
      const data = await analyzeReceipt(file);
      
      const newReceipt: Receipt = {
        id: crypto.randomUUID(),
        ...data,
        imageUrl, 
      };

      onReceiptAdded(newReceipt);
    } catch (err) {
      console.error(err);
      setError("Failed to process receipt. Please try again.");
    } finally {
      setIsProcessing(false);
      // Reset the input value to allow uploading the same file again if needed
      event.target.value = '';
    }
  }, [onReceiptAdded]);

  return (
    <div className="mb-8">
      <div className="relative group cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        />
        <div className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
          ${isProcessing ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-300 hover:border-indigo-500 hover:bg-slate-50'}
        `}>
          <div className="flex flex-col items-center justify-center space-y-4">
            {isProcessing ? (
              <>
                <div className="p-3 bg-indigo-100 rounded-full animate-pulse">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-900">Analyzing Receipt...</h3>
                  <p className="text-indigo-600">Gemini is extracting the details</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                  <UploadCloud className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Drop your receipt here</h3>
                  <p className="text-slate-500 mt-1">or click to browse</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}
    </div>
  );
};