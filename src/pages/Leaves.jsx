import { useEffect, useState } from 'react';
import { getLeaveBalances, getMyLeaves, applyLeave, cancelLeave } from '../api/leaveApi';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

const LEAVE_TYPES = [
  { value: 'ANNUAL', label: 'Annual Leave' },
  { value: 'MEDICAL', label: 'Medical Leave' },
  { value: 'MATERNITY', label: 'Maternity Leave' },
  { value: 'PATERNITY', label: 'Paternity Leave' },
  { value: 'COMP_OFF', label: 'Comp-Off' },
  { value: 'LOP', label: 'Loss of Pay' },
];

export default function Leaves() {
  const [balances, setBalances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    leaveType: 'ANNUAL',
    fromDate: '',
    toDate: '',
    reason: '',
    applyAsCompOff: false,
  });

  const fetchData = async () => {
    try {
      const [b, l] = await Promise.all([getLeaveBalances(), getMyLeaves()]);
      setBalances(b.data.balances || []);
      setLeaves(l.data.content || []);
    } catch {
      toast.error('Failed to load leave data');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fromDate || !form.toDate || !form.reason) {
      return toast.error('Please fill all fields');
    }
    setSubmitting(true);
    try {
      await applyLeave(form);
      toast.success('Leave applied successfully!');
      setShowForm(false);
      setForm({ leaveType: 'ANNUAL', fromDate: '', toDate: '', reason: '', applyAsCompOff: false });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to apply leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelLeave(id);
      toast.success('Leave cancelled successfully');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Cannot cancel this leave');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-1">Apply and track your leave requests</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
        >
          + Apply Leave
        </button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {balances.map((b) => (
          <div key={b.leaveType} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-blue-600">{b.balance}</p>
            <p className="text-xs text-slate-500 mt-1 leading-tight">{b.displayName}</p>
          </div>
        ))}
      </div>

      {/* Apply form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Apply for Leave</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Leave Type
              </label>
              <select
                value={form.leaveType}
                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LEAVE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reason
              </label>
              <input
                type="text"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Reason for leave"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={form.fromDate}
                onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={form.toDate}
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
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

      {/* Leave history */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">My Leave Requests</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {leaves.length === 0 && (
            <p className="text-center text-slate-400 py-12 text-sm">
              No leave requests yet. Apply for your first leave above.
            </p>
          )}
          {leaves.map((leave) => (
            <div key={leave.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900 text-sm">
                    {leave.leaveTypeDisplay}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[leave.status]}`}>
                    {leave.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {leave.fromDate} → {leave.toDate} · {leave.numberOfDays} working day(s)
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{leave.reason}</p>
                {leave.managerComment && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    Manager: {leave.managerComment}
                  </p>
                )}
              </div>
              {leave.status === 'PENDING' && (
                <button
                  onClick={() => handleCancel(leave.id)}
                  className="text-xs text-red-500 hover:text-red-700 ml-4 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}