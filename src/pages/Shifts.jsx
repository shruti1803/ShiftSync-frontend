import { useEffect, useState } from 'react';
import { getMyShifts } from '../api/shiftApi';

const SHIFT_COLORS = {
  MORNING: 'bg-yellow-100 text-yellow-800',
  AFTERNOON: 'bg-blue-100 text-blue-800',
  NIGHT: 'bg-indigo-100 text-indigo-800',
  US_SHIFT: 'bg-purple-100 text-purple-800',
  GENERAL: 'bg-green-100 text-green-800',
};

export default function Shifts() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const from = new Date().toISOString().split('T')[0];
    const future = new Date();
    future.setDate(future.getDate() + 30);
    const to = future.toISOString().split('T')[0];
    getMyShifts(from, to)
      .then(r => setShifts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Shifts</h1>
        <p className="text-slate-500 text-sm mt-1">Your shift schedule for the next 30 days</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="divide-y divide-slate-100">
          {loading && (
            <p className="text-center text-slate-400 py-12 text-sm">Loading shifts...</p>
          )}
          {!loading && shifts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No shifts scheduled yet</p>
              <p className="text-slate-300 text-xs mt-1">
                Shifts appear here once assigned by your manager
              </p>
            </div>
          )}
          {shifts.map((s) => (
            <div key={s.scheduleId} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900 text-sm">{s.shiftDate}</p>
                  {s.isToday && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                  {s.isSwapped && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      Swapped
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {s.startTime} – {s.endTime}
                </p>
                {s.hasUsHoliday && (
                  <p className="text-xs text-purple-600 mt-0.5 font-medium">
                    🇺🇸 US Holiday: {s.usHolidayName}
                  </p>
                )}
                {s.holidays && s.holidays
                  .filter(h => h.countryCode === 'IN')
                  .map(h => (
                    <p key={h.id} className="text-xs text-orange-600 mt-0.5 font-medium">
                      🇮🇳 {h.name}
                    </p>
                  ))
                }
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${SHIFT_COLORS[s.shiftType] || 'bg-slate-100 text-slate-700'}`}>
                {s.shiftDisplayName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}