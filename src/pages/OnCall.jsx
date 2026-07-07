import { useEffect, useState } from 'react';
import { getUpcomingOnCall, acknowledgeOnCall } from '../api/onCallApi';
import toast from 'react-hot-toast';

export default function OnCall() {
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    getUpcomingOnCall()
      .then(r => setDuties(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAck = async (id) => {
    try {
      await acknowledgeOnCall(id);
      toast.success('On-call duty acknowledged!');
      fetchData();
    } catch {
      toast.error('Failed to acknowledge');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">On-Call Roster</h1>
        <p className="text-slate-500 text-sm mt-1">
          Your upcoming on-call duties — acknowledge to confirm you're aware
        </p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
        <p className="text-orange-800 text-sm">
          🔔 <strong>Reminder:</strong> If your on-call duty falls on a public holiday or weekend,
          a comp-off day is automatically credited to your account the following morning.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="divide-y divide-slate-100">
          {loading && (
            <p className="text-center text-slate-400 py-12 text-sm">Loading...</p>
          )}
          {!loading && duties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No upcoming on-call duties</p>
              <p className="text-slate-300 text-xs mt-1">
                Duties will appear here when assigned by your manager
              </p>
            </div>
          )}
          {duties.map((d) => (
            <div key={d.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900 text-sm">{d.onCallDate}</p>
                  {d.iAmPrimary ? (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Primary</span>
                  ) : (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Secondary</span>
                  )}
                  {d.isWeekend && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Weekend</span>
                  )}
                  {d.isHoliday && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      🎉 {d.holidayName}
                    </span>
                  )}
                </div>
                {d.secondaryUser && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Secondary: {d.secondaryUser.name}
                  </p>
                )}
                {d.compOffCredited && (
                  <p className="text-xs text-green-600 mt-0.5 font-medium">
                    ✅ Comp-off credited
                  </p>
                )}
              </div>
              <div>
                {d.iHaveAcknowledged ? (
                  <span className="text-green-500 text-xs font-semibold">✅ Acknowledged</span>
                ) : (
                  <button
                    onClick={() => handleAck(d.id)}
                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}