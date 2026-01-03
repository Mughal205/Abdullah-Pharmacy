
import React, { useMemo } from 'react';
import { Medicine, Sale } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

interface DashboardProps {
  inventory: Medicine[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, sales }) => {
  const totalStockValue = useMemo(() => 
    inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
    [inventory]
  );

  const lowStockCount = useMemo(() => 
    inventory.filter(item => item.quantity <= item.lowStockThreshold).length, 
    [inventory]
  );

  const expiredCount = useMemo(() => {
    const today = new Date();
    return inventory.filter(item => new Date(item.expiryDate) < today).length;
  }, [inventory]);

  const todaySales = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return sales
      .filter(sale => sale.timestamp.startsWith(todayStr))
      .reduce((sum, sale) => sum + sale.totalAmount, 0);
  }, [sales]);

  // Transform sales for chart
  const salesData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const total = sales
        .filter(s => s.timestamp.startsWith(date))
        .reduce((sum, s) => sum + s.totalAmount, 0);
      return { name: date.split('-').slice(1).join('/'), amount: total };
    });
  }, [sales]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
          <p className="text-slate-500">Real-time stats for your pharmacy management.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
          <span className="text-slate-400">📅</span>
          <span className="text-sm font-medium text-slate-700">{new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-2xl">💊</div>
            <div>
              <p className="text-sm font-medium text-slate-500">Inventory Items</p>
              <h3 className="text-2xl font-bold text-slate-800">{inventory.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-green-500 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-2xl">💵</div>
            <div>
              <p className="text-sm font-medium text-slate-500">Today's Sales</p>
              <h3 className="text-2xl font-bold text-slate-800">Rs. {todaySales.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-500 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 text-2xl">⚠️</div>
            <div>
              <p className="text-sm font-medium text-slate-500">Low Stock</p>
              <h3 className="text-2xl font-bold text-slate-800">{lowStockCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-rose-500 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 text-2xl">⌛</div>
            <div>
              <p className="text-sm font-medium text-slate-500">Expired/Close</p>
              <h3 className="text-2xl font-bold text-slate-800">{expiredCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Sales Trend (PKR)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  formatter={(value) => [`Rs. ${Number(value).toFixed(2)}`, 'Amount']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Stock Breakdown</h4>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-slate-800">Rs. {totalStockValue.toLocaleString()}</p>
            </div>
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-slate-600">Top Categories</h5>
              {['Antibiotics', 'Painkillers', 'Vitamins', 'Skincare'].map(cat => {
                const count = inventory.filter(i => i.category === cat).length;
                const percentage = (count / inventory.length) * 100 || 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>{cat}</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
