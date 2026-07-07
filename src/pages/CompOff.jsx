import { useEffect, useState } from 'react';
import { getActiveCredits } from '../api/compOffApi';

export default function CompOff() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveCredits()
      .then(r => setCredits(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Comp-Off Credits</h1>
        <p className="text-slate-500 text-sm mt-1">
          Auto-credited when you work on-call during holidays or weekends
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm">
          💡 <strong>How it works:</strong> When you're on-call on a public holiday or weekend,
          1 comp-off day is automatically credited to your account within the next day.
          Credits expire 3 months from the date earned. Redeem them via the Leave page
          by selecting <strong>Comp-Off</strong> as your leave type.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Active Credits</h2>
          <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
            {credits.length} available
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading && (
            <p className="text-center text-slate-400 py-12 text-sm">Loading...</p>
          )}
          {!loading && credits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No active comp-off credits</p>
              <p className="text-slate-300 text-xs mt-1">
                Credits appear here after working on-call on holidays or weekends
              </p>
            </div>
          )}
          {credits.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 text-sm">{c.holidayName}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Worked on: {c.workedOnDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Expires: {c.expiryDate}</p>
                <p className={`text-xs mt-0.5 font-semibold ${
                  c.daysUntilExpiry < 30 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {c.daysUntilExpiry} days left
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}