import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLeaveBalances } from '../api/leaveApi';
import { getWfhBalance } from '../api/wfhApi';
import { getTodayHolidays } from '../api/holidayApi';
import { getActiveCredits } from '../api/compOffApi';
import { getUpcomingOnCall } from '../api/onCallApi';
import { Umbrella, Laptop, Clock, Phone } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [wfhBalance, setWfhBalance] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [compOff, setCompOff] = useState([]);
  const [onCall, setOnCall] = useState([]);

  useEffect(() => {
    getLeaveBalances().then(r => setLeaveBalances(r.data.balances || [])).catch(() => {});
    getWfhBalance().then(r => setWfhBalance(r.data)).catch(() => {});
    getTodayHolidays().then(r => setHolidays(r.data)).catch(() => {});
    getActiveCredits().then(r => setCompOff(r.data)).catch(() => {});
    getUpcomingOnCall().then(r => setOnCall(r.data)).catch(() => {});
  }, []);

  const annualLeave = leaveBalances.find(b => b.leaveType === 'ANNUAL');
  const greeting = new Date().getHours() < 12 ? 'Good morning' :
    new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Holiday banner */}
      {holidays.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-amber-800">
              Today is {holidays.map(h => h.name).join(' & ')}
            </p>
            <p className="text-amber-600 text-sm">
              {holidays.some(h => h.countryCode === 'US') ? '🇺🇸 US Holiday' : ''}
              {holidays.some(h => h.countryCode === 'IN') ? ' 🇮🇳 India Holiday' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Umbrella}
          label="Annual Leave Left"
          value={annualLeave?.balance ?? '—'}
          sub={`of ${annualLeave?.totalAllocated ?? '—'} days total`}
          color="bg-blue-500"
        />
        <StatCard
          icon={Laptop}
          label="WFH Days Left"
          value={wfhBalance?.currentMonthBalance ?? '—'}
          sub="resets on 1st of month"
          color="bg-emerald-500"
        />
        <StatCard
          icon={Clock}
          label="Comp-Off Credits"
          value={compOff.length}
          sub="active, expires in 3 months"
          color="bg-purple-500"
        />
        <StatCard
          icon={Phone}
          label="Upcoming On-Call"
          value={onCall.length}
          sub="duties assigned"
          color="bg-orange-500"
        />
      </div>

      {/* Leave balance breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-900 mb-5">Leave Balance Breakdown</h2>
        <div className="space-y-4">
          {leaveBalances.map((b) => (
            <div key={b.leaveType} className="flex items-center gap-4">
              <span className="text-sm text-slate-600 w-36">{b.displayName}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: b.totalAllocated > 0
                      ? `${Math.min((b.balance / b.totalAllocated) * 100, 100)}%`
                      : '0%'
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 w-20 text-right">
                {b.balance} / {b.totalAllocated}
              </span>
            </div>
          ))}
          {leaveBalances.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">
              No leave balance data yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}