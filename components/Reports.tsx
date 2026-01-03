
import React, { useState, useMemo } from 'react';
import { Sale } from '../types';

interface ReportsProps {
  sales: Sale[];
}

const Reports: React.FC<ReportsProps> = ({ sales }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = useMemo(() => {
    return sales.filter(s => 
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.customerName && s.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    ).reverse();
  }, [sales, searchTerm]);

  const stats = useMemo(() => {
    const total = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const count = sales.length;
    const avg = count > 0 ? total / count : 0;
    return { total, count, avg };
  }, [sales]);

  const handlePrint = () => {
    window.print();
  };

  const openReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setShowReceipt(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #thermal-receipt-view, #thermal-receipt-view * { visibility: visible; }
          #thermal-receipt-view {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            padding: 5mm;
            margin: 0;
            background: white;
            font-family: 'Courier New', Courier, monospace;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sales Reports & Receipts</h2>
        <p className="text-slate-500 font-medium">Detailed history of all pharmacy transactions.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-slate-900">PKR {stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Invoices</p>
          <p className="text-3xl font-black text-slate-900">{stats.count}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Order Value</p>
          <p className="text-3xl font-black text-slate-900">PKR {stats.avg.toFixed(2)}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <span className="absolute left-4 top-3 text-slate-400">🔍</span>
            <input 
              type="text"
              placeholder="Search by Invoice ID or Customer..."
              className="w-full pl-12 pr-4 py-2.5 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            📥 Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Invoice ID</th>
                <th className="px-8 py-5">Date & Time</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5 text-right">Amount</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-blue-600 font-bold">#{sale.id}</span>
                  </td>
                  <td className="px-8 py-5 text-slate-600 text-sm font-medium">
                    {new Date(sale.timestamp).toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-slate-800 font-bold uppercase text-xs">{sale.customerName || 'Walk-in'}</span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-900">
                    PKR {sale.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button 
                      onClick={() => openReceipt(sale)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:border-blue-500 hover:text-blue-600 shadow-sm transition-all"
                    >
                      <span>🖨️ View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <span className="text-5xl opacity-20">📜</span>
                      <p className="font-bold">No transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal Overlay (Reusable) */}
      {showReceipt && selectedSale && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 no-print">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h4 className="font-black text-slate-800 tracking-tight uppercase text-sm">Transaction Log</h4>
              <button onClick={() => setShowReceipt(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
            </div>
            
            <div className="p-8">
              <div id="thermal-receipt-view" className="bg-white text-slate-900 overflow-hidden">
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold uppercase tracking-widest leading-tight">Abdullah Pharmacy</h1>
                  <p className="text-[10px] font-bold">REG # 40125-PK</p>
                  <p className="text-[10px]">3 Marla Scheme Near Cricket Stadium Chakwal</p>
                  <p className="text-[10px]">TEL: +923005471567</p>
                  <div className="border-b border-dashed border-slate-900 my-4"></div>
                  <p className="font-bold text-sm tracking-widest uppercase">Reprint Invoice</p>
                </div>

                <div className="space-y-1 text-[10px] mb-4 font-mono">
                  <div className="flex justify-between">
                    <span>INV NO:</span>
                    <span className="font-bold">{selectedSale.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DATE:</span>
                    <span>{new Date(selectedSale.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between uppercase">
                    <span>CUSTOMER:</span>
                    <span className="font-bold">{selectedSale.customerName || 'WALK-IN'}</span>
                  </div>
                </div>

                <div className="border-t border-b border-dashed border-slate-900 py-2 mb-4">
                  <div className="flex justify-between font-bold text-[10px] mb-2 uppercase font-mono">
                    <span className="w-1/2 text-left">Item</span>
                    <span className="w-1/4 text-center">Qty</span>
                    <span className="w-1/4 text-right">Price</span>
                  </div>
                  {selectedSale.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-[10px] leading-tight mb-1 font-mono">
                      <span className="w-1/2">{item.name}</span>
                      <span className="w-1/4 text-center">{item.quantity}</span>
                      <span className="w-1/4 text-right">{(item.quantity * item.priceAtSale).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-sm font-bold border-t border-slate-900 pt-2 mt-2 uppercase">
                    <span>Grand Total:</span>
                    <span>PKR {selectedSale.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-center text-[9px] mt-12 space-y-1 opacity-60">
                  <p>********************************</p>
                  <p>REPRINTED ON {new Date().toLocaleString()}</p>
                  <p>STAY HEALTHY, STAY SAFE</p>
                  <p>NO RETURNS ON SOLD MEDICINES</p>
                  <p>********************************</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t flex gap-4">
              <button 
                onClick={handlePrint}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
              >
                <span>🖨️ PRINT</span>
              </button>
              <button 
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all"
              >
                BACK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
