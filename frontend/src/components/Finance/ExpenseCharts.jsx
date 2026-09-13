import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';

const COLORS = ['#4F46E5', '#059669', '#0284C7', '#F59E0B', '#E11D48', '#8B5CF6', '#14B8A6'];

export const ExpenseCharts = ({ summary, settings }) => {
  const p1 = settings?.p1Name || 'Orang 1';
  const p2 = settings?.p2Name || 'Orang 2';

  const categoryData = (summary?.categoryChartData || []).filter(item => item.value > 0);

  const payerData = [
    {
      name: p1,
      'Total Dibayar': summary?.paidByP1Total || 0,
      'Beban Pribadi': summary?.activeShareP1 || 0
    },
    {
      name: p2,
      'Total Dibayar': summary?.paidByP2Total || 0,
      'Beban Pribadi': summary?.activeShareP2 || 0
    }
  ];

  if (categoryData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Category Pie Chart */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Pengeluaran per Kategori</h4>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">{categoryData.length} Kategori</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => `Rp ${Number(val).toLocaleString('id-ID')}`}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {categoryData.map((cat, idx) => (
            <div key={cat.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <span className="truncate max-w-[100px]">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payer Comparison Bar Chart */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Kontribusi Pengeluaran ({p1} vs {p2})</h4>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
              <Tooltip
                formatter={(val) => `Rp ${Number(val).toLocaleString('id-ID')}`}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Total Dibayar" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
          Total seluruh pengeluaran: <strong className="text-slate-700">Rp {Number(summary?.totalAllExpenses || 0).toLocaleString('id-ID')}</strong>
        </div>
      </div>
    </div>
  );
};
