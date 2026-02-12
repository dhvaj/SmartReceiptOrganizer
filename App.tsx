import React, { useState, useEffect } from 'react';
import { Receipt } from './types';
import { ReceiptUploader } from './components/ReceiptUploader';
import { Dashboard } from './components/Dashboard';
import { ReceiptList } from './components/ReceiptList';
import { Wallet, Info } from 'lucide-react';

const App: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false);

  useEffect(() => {
    // Check for API key on mount
    if (!process.env.API_KEY) {
      setShowApiKeyWarning(true);
    }
    
    // Load data from localStorage
    const saved = localStorage.getItem('receipts');
    if (saved) {
      try {
        setReceipts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever receipts change
    localStorage.setItem('receipts', JSON.stringify(receipts));
  }, [receipts]);

  const handleReceiptAdded = (newReceipt: Receipt) => {
    setReceipts(prev => [newReceipt, ...prev]);
  };

  const handleDelete = (id: string) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Receipt Organizer</h1>
          </div>
          <div className="text-sm text-slate-500">
             Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {showApiKeyWarning && (
           <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start space-x-3">
             <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
             <div>
               <h3 className="font-semibold text-yellow-900">API Key Missing</h3>
               <p className="text-yellow-700 text-sm mt-1">
                 It looks like the <code>API_KEY</code> environment variable is missing. 
                 The receipt analysis features will not work without it.
               </p>
             </div>
           </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Input and Stats */}
          <div className="xl:col-span-2 space-y-8">
             <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
              </div>
              <Dashboard receipts={receipts} />
             </section>

             <section>
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-semibold text-slate-900">History</h2>
                 <span className="text-sm text-slate-500">{receipts.length} receipts</span>
               </div>
               <ReceiptList receipts={receipts} onDelete={handleDelete} />
             </section>
          </div>

          {/* Right Column: Upload */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Add New Receipt</h2>
              <p className="text-sm text-slate-500 mb-6">
                Upload a photo of your receipt. Gemini will analyze it and extract the details automatically.
              </p>
              <ReceiptUploader onReceiptAdded={handleReceiptAdded} />
              
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-sm font-medium text-slate-900 mb-4">Supported Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Dining', 'Travel', 'Supplies', 'Groceries', 'Entertainment', 'Utilities'].map(cat => (
                    <span key={cat} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;