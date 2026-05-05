import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Users, FlaskConical, PackageSearch, TrendingUp } from 'lucide-react';
import { getChemicalsApi } from '../../services/repository/masterRepository';
import { getMonthlyApi } from '../../services/repository/stockRepository';
import Loader from '../common/Loader';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`${bg} rounded-2xl p-6 border-2 border-gray-200`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <div className={`w-12 h-12 ${color === 'text-black' ? 'bg-black text-white' : 'bg-gray-100'} rounded-xl flex items-center justify-center`}>
        <Icon size={22} className={color} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user }   = useSelector(s => s.auth);
  const [chemicals, setChemicals] = useState([]);
  const [monthly, setMonthly]     = useState(null);
  const [loading, setLoading]     = useState(true);

  const now = new Date();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [cRes, mRes] = await Promise.all([
          getChemicalsApi(),
          getMonthlyApi(now.getMonth() + 1, now.getFullYear()),
        ]);
        setChemicals(cRes.data.data?.chemicals || []);
        setMonthly(mRes.data.data || null);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  const totals = monthly?.monthly_totals;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-black rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold">Welcome back, {user?.name} </h2>
        <p className="text-gray-400 text-sm mt-1 capitalize">{user?.role} · M&D Engineers Private Limited</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FlaskConical}  label="Total Chemicals"  value={chemicals.length}                        color="text-black" bg="bg-white" />
        <StatCard icon={PackageSearch} label="Stock Entries"    value={totals?.total_entries || 0}              color="text-black" bg="bg-white" />
        <StatCard icon={TrendingUp}    label="Monthly Sales"    value={`₹${Number(totals?.total_sales_amount || 0).toLocaleString('en-IN')}`} color="text-black" bg="bg-white" />
        <StatCard icon={Users}         label="Total GST"        value={`₹${Number(totals?.total_gst || 0).toLocaleString('en-IN')}`}          color="text-black" bg="bg-white" />
      </div>

      {/* Month Summary */}
      {monthly && (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <h3 className="font-bold text-black mb-4">
            {monthly.month} {monthly.year} — Chemical Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {['Chemical','Unit','Purchased','Used','Sales Amount','GST','Total'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-black first:rounded-l-lg last:rounded-r-lg">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(monthly.chemical_wise_summary || []).slice(0, 8).map(c => (
                  <tr key={c.chemical_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-black">{c.chemical_name}</td>
                    <td className="px-4 py-3 text-gray-700">{c.unit}</td>
                    <td className="px-4 py-3 text-emerald-600">{Number(c.total_purchased).toFixed(2)}</td>
                    <td className="px-4 py-3 text-orange-500">{Number(c.total_used).toFixed(2)}</td>
                    <td className="px-4 py-3 text-black">₹{Number(c.total_sales_amount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-black">₹{Number(c.total_gst).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-semibold text-black">₹{Number(c.total_amount).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}