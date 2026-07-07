import { useEffect, useState } from 'react';
import { getWfhBalance, getMyWfhRequests, applyWfh, cancelWfh } from '../api/wfhApi';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

export default function Wfh() {
  const [balance, setBalance] = useState(null);
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ wfhDate: '', reason: '' });

  const fetchData = async () => {
    try {
      const [b, r] = await Promise.all([getWfhBalance(), getMyWfhRequests()]);
      setBalance(b.data);
      setRequests(r.data.content || []);
    } catch {
      toast.error('Failed to load WFH data');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.wfhDate || !form.reason) return toast.error('Please fill all fields');
    setSubmitting(true);
    try {
      await applyWfh(form);
      toast.success('WFH request submitted!');
      setShowForm(false);
      setForm({ wfhDate: '', reason: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to apply WFH');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work From Home</h1>
          <p className="text-slate-500 text-sm mt-1">2 days per month, resets on the 1st</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Request WFH
        </button>
      </div>

      {/* Balance cards */}
      {balance && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-4xl font-bold text-emerald-500">{balance.currentMonthBalance}</p>
            <p className="text-slate-500 text-sm mt-2">Days remaining</p>
            <p className="text-slate-400 text-xs mt-0.5">this month</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-4xl font-bold text-blue-500">{balance.monthlyAllowance}</p>
            <p className="text-slate-500 text-sm mt-2">Monthly allowance</p>
            <p className="text-slate-400 text-xs mt-0.5">resets every month</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-4xl font-bold text-slate-700">{balance.totalWfhUsedThisYear}</p>
            <p className="text-slate-500 text-sm mt-2">Used this year</p>
            <p className="text-slate-400 text-xs mt-0.5">total days</p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Request WFH Day</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={form.wfhDate}
                onChange={(e) => setForm({ ...form, wfhDate: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
              <input
                type="text"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Why are you working from home?"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">My WFH Requests</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {requests.length === 0 && (
            <p className="text-center text-slate-400 py-12 text-sm">No WFH requests yet</p>
          )}
          {requests.map((r) => (
            <div key={r.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 text-sm">{r.wfhDate}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.reason}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>
                  {r.status}
                </span>
                {r.status === 'PENDING' && (
                  <button
                    onClick={async () => {
                      try {
                        await cancelWfh(r.id);
                        toast.success('WFH cancelled');
                        fetchData();
                      } catch {
                        toast.error('Cannot cancel');
                      }
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Cancel
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