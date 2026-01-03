
import React, { useState, useMemo } from 'react';
import { Medicine, Sale, SaleItem } from '../types';

interface SalesProps {
  inventory: Medicine[];
  onSale: (items: SaleItem[], customerName: string) => void;
  salesHistory: Sale[];
}

const Sales: React.FC<SalesProps> = ({ inventory, onSale, salesHistory }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [customer, setCustomer] = useState('');
  const [search, setSearch] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<Sale & { discount?: number, cashReceived?: number, change?: number } | null>(null);

  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.priceAtSale * item.quantity), 0), 
    [cart]
  );

  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = subtotal - discountAmount;
  const changeDue = cashReceived ? parseFloat(cashReceived) - grandTotal : 0;

  const availableItems = inventory.filter(i => 
    i.quantity > 0 && 
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (med: Medicine) => {
    const existing = cart.find(c => c.medicineId === med.id);
    if (existing) {
      if (existing.quantity >= med.quantity) return;
      setCart(cart.map(c => c.medicineId === med.id ? {...c, quantity: c.quantity + 1} : c));
    } else {
      setCart([...cart, {
        medicineId: med.id,
        name: med.name,
        quantity: 1,
        priceAtSale: med.price
      }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.medicineId === id) {
        const med = inventory.find(i => i.id === id);
        const newQty = Math.max(1, item.quantity + delta);
        if (med && newQty <= med.quantity) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.medicineId !== id));
  };

  const processSale = () => {
    if (cart.length === 0) return;
    
    const finalSale = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      items: [...cart],
      totalAmount: grandTotal,
      customerName: customer || 'Walk-in Customer',
      discount: discountAmount,
      cashReceived: parseFloat(cashReceived) || grandTotal,
      change: changeDue > 0 ? changeDue : 0
    };

    onSale(cart, customer);
    setActiveReceipt(finalSale);
    setShowReceipt(true);
    setCart([]);
    setCustomer('');
    setDiscount(0);
    setCashReceived('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500 relative">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #thermal-receipt, #thermal-receipt * { visibility: visible; }
          #thermal-receipt {
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

      {/* Product Selection Area */}
      <div className="lg:col-span-7 space-y-6">
        <header>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Billing Terminal</h2>
          <p className="text-slate-500">Add medicines to generate customer invoice.</p>
        </header>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative mb-6">
            <span className="absolute left-4 top-3.5 text-slate-400 text-xl">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name or category (e.g. Paracetamol)..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {availableItems.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all text-left group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">💊</span>
                    <p className="font-bold text-slate-800 leading-tight">{item.name}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">PKR {item.price.toFixed(2)} • <span className={item.quantity < 20 ? 'text-amber-600 font-bold' : ''}>{item.quantity} in stock</span></p>
                </div>
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">+</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bill Cart Area */}
      <div className="lg:col-span-5">
        <div className="sticky top-8 bg-white rounded-[2rem] border border-slate-200 shadow-2xl flex flex-col h-[calc(100vh-100px)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span> Current Bill
            </h3>
            <div className="space-y-3">
              <input 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
                placeholder="👤 Customer Name (Optional)"
                value={customer}
                onChange={e => setCustomer(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {cart.map(item => (
              <div key={item.medicineId} className="flex justify-between items-center group animate-in slide-in-from-right-4 duration-200">
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-500">PKR {item.priceAtSale.toFixed(2)} / unit</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <button onClick={() => updateQuantity(item.medicineId, -1)} className="px-2 py-1 hover:bg-slate-200 text-slate-600 font-bold">-</button>
                    <span className="px-3 py-1 font-bold text-sm min-w-[30px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.medicineId, 1)} className="px-2 py-1 hover:bg-slate-200 text-slate-600 font-bold">+</button>
                  </div>
                  <p className="font-bold text-slate-700 min-w-[70px] text-right text-sm">PKR {(item.quantity * item.priceAtSale).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.medicineId)} className="text-slate-300 hover:text-rose-500 transition-colors">✕</button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 py-20">
                <div className="text-6xl opacity-20">🧾</div>
                <p className="font-bold">Cart is empty</p>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="p-6 bg-slate-900 text-white space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Discount (%)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  value={discount}
                  onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Cash Received</label>
                <input 
                  type="number"
                  placeholder="PKR 0.00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  value={cashReceived}
                  onChange={e => setCashReceived(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span>PKR {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-400 text-sm">
                  <span>Discount ({discount}%)</span>
                  <span>- PKR {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-bold">Grand Total</span>
                <span className="text-3xl font-black text-blue-400">PKR {grandTotal.toFixed(2)}</span>
              </div>
              {parseFloat(cashReceived) > 0 && (
                <div className={`flex justify-between items-center p-3 rounded-xl border-2 ${changeDue >= 0 ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'}`}>
                  <span className="font-bold">{changeDue >= 0 ? 'Change Due' : 'Balance Due'}</span>
                  <span className="text-xl font-black">PKR {Math.abs(changeDue).toFixed(2)}</span>
                </div>
              )}
            </div>

            <button 
              disabled={cart.length === 0}
              onClick={processSale}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-bold text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{cart.length > 0 ? '🚀 Checkout & Print' : 'Select Medicines'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bill Receipt Modal */}
      {showReceipt && activeReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 no-print">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h4 className="font-black text-slate-800 tracking-tight">INVOICE READY</h4>
              <button onClick={() => setShowReceipt(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
            </div>
            
            <div className="p-8">
              <div id="thermal-receipt" className="bg-white text-slate-900 overflow-hidden">
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold uppercase tracking-widest leading-tight">Abdullah Pharmacy</h1>
                  <p className="text-[10px] font-bold">REG # 40125-PK</p>
                  <p className="text-[10px]">3 Marla Scheme Near Cricket Stadium Chakwal</p>
                  <p className="text-[10px]">TEL: +923005471567</p>
                  <div className="border-b border-dashed border-slate-900 my-4"></div>
                  <p className="font-bold text-sm tracking-widest">CASH INVOICE</p>
                </div>

                <div className="space-y-1 text-[10px] mb-4">
                  <div className="flex justify-between">
                    <span>INV NO:</span>
                    <span className="font-bold">{activeReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DATE:</span>
                    <span>{new Date(activeReceipt.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between uppercase">
                    <span>CUSTOMER:</span>
                    <span className="font-bold">{activeReceipt.customerName}</span>
                  </div>
                </div>

                <div className="border-t border-b border-dashed border-slate-900 py-2 mb-4">
                  <div className="flex justify-between font-bold text-[10px] mb-2 uppercase">
                    <span className="w-1/2">Item Description</span>
                    <span className="w-1/4 text-center">Qty</span>
                    <span className="w-1/4 text-right">Price</span>
                  </div>
                  {activeReceipt.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-[10px] leading-tight mb-1">
                      <span className="w-1/2">{item.name}</span>
                      <span className="w-1/4 text-center">{item.quantity}</span>
                      <span className="w-1/4 text-right">{(item.quantity * item.priceAtSale).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>SUBTOTAL:</span>
                    <span>{activeReceipt.totalAmount + (activeReceipt.discount || 0)}</span>
                  </div>
                  {activeReceipt.discount && activeReceipt.discount > 0 ? (
                    <div className="flex justify-between font-bold">
                      <span>DISCOUNT:</span>
                      <span>-{activeReceipt.discount.toFixed(2)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-sm font-bold border-t border-slate-900 pt-1 mt-1">
                    <span>NET TOTAL:</span>
                    <span>PKR {activeReceipt.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span>CASH PAID:</span>
                    <span>{activeReceipt.cashReceived?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs pt-1">
                    <span>CHANGE:</span>
                    <span>{activeReceipt.change?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-center text-[9px] mt-10 space-y-1">
                  <p>********************************</p>
                  <p>STAY HEALTHY, STAY SAFE</p>
                  <p>NO RETURNS ON SOLD MEDICINES</p>
                  <p>POWERED BY ABDULLAH SYSTEMS</p>
                  <p>********************************</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t flex gap-4">
              <button 
                onClick={handlePrint}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
              >
                <span>🖨️ PRINT BILL</span>
              </button>
              <button 
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
