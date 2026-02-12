import React from 'react';
import { Receipt } from '../types';
import { Calendar, Trash2, ExternalLink, FileText } from 'lucide-react';

interface ReceiptListProps {
  receipts: Receipt[];
  onDelete: (id: string) => void;
}

export const ReceiptList: React.FC<ReceiptListProps> = ({ receipts, onDelete }) => {
  if (receipts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No receipts yet</h3>
        <p className="text-slate-500">Upload a receipt to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {receipts.map((receipt) => (
              <tr key={receipt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {receipt.imageUrl && (
                      <div className="w-10 h-10 mr-4 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        <img src={receipt.imageUrl} alt="Receipt thumbnail" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-slate-900">{receipt.vendor}</div>
                      <div className="text-xs text-slate-500 md:hidden">{receipt.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {receipt.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {receipt.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">
                  {receipt.currency} {receipt.tax.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                  {receipt.currency} {receipt.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                     {receipt.imageUrl && (
                        <a 
                          href={receipt.imageUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="View Receipt Image"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    <button
                      onClick={() => onDelete(receipt.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Receipt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};