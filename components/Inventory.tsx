
import React, { useState } from 'react';
import { Medicine } from '../types';

interface InventoryProps {
  inventory: Medicine[];
  onAdd: (medicine: Omit<Medicine, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Medicine>) => void;
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newMed, setNewMed] = useState<Omit<Medicine, 'id'>>({
    name: '',
    category: 'Antibiotics',
    batchNumber: '',
    expiryDate: '',
    quantity: 0,
    price: 0,
    lowStockThreshold: 10,
    manufacturer: ''
  });

  const filteredMeds = inventory.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newMed);
    setIsAdding(false);
    setNewMed({
      name: '',
      category: 'Antibiotics',
      batchNumber: '',
      expiryDate: '',
      quantity: 0,
      price: 0,
      lowStockThreshold: 10,
      manufacturer: ''
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Medicine Inventory</h2>
          <p className="text-slate-500">Manage products, stock levels, and expiry dates.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm flex items-center gap-2 transition-all active:scale-95"
        >
          {isAdding ? '✕ Cancel' : '➕ Add Medicine'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-white p-8 rounded-2xl border-2 border-blue-100 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Medicine Name</label>
              <input 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Paracetamol"
                value={newMed.name}
                onChange={e => setNewMed({...newMed, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                value={newMed.category}
                onChange={e => setNewMed({...newMed, category: e.target.value})}
              >
                <option>Antibiotics</option>
                <option>Painkillers</option>
                <option>Vitamins</option>
                <option>Skincare</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Manufacturer</label>
              <input 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                placeholder="PharmaCorp"
                value={newMed.manufacturer}
                onChange={e => setNewMed({...newMed, manufacturer: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Price (PKR)</label>
              <input 
                type="number" step="0.01" required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                value={newMed.price}
                onChange={e => setNewMed({...newMed, price: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Stock Quantity</label>
              <input 
                type="number" required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                value={newMed.quantity}
                onChange={e => setNewMed({...newMed, quantity: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Expiry Date</label>
              <input 
                type="date" required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                value={newMed.expiryDate}
                onChange={e => setNewMed({...newMed, expiryDate: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700">Save Medicine</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input 
              type="text"
              placeholder="Search by name, category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-bold">Low Stock Highlights</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                <th className="px-6 py-4">Medicine & Category</th>
                <th className="px-6 py-4">Manufacturer</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMeds.map((med) => {
                const isLow = med.quantity <= med.lowStockThreshold;
                const isExpired = new Date(med.expiryDate) < new Date();
                return (
                  <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-slate-800">{med.name}</div>
                        <div className="text-xs text-slate-500">{med.category} • {med.batchNumber || 'No Batch'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{med.manufacturer}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">Rs. {med.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${isLow ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {med.quantity} in stock
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${isExpired ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                        {new Date(med.expiryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onDelete(med.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredMeds.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No medicines found. Try searching something else.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
