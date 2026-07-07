import { useEffect, useState } from 'react';
import { getMySwaps, getIncomingSwaps, respondToSwap, cancelSwap } from '../api/swapApi';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING_TARGET_APPROVAL: 'bg-yellow-100 text-yellow-700',
  PENDING_MANAGER_APPROVAL: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

export default function ShiftSwap() {
  const [mySwaps, setMySwaps] = useState([]);
  const [incoming, setIncoming] = useState([]);

  const fetchData = () => {
    getMySwaps().then(r => setMySwaps(r.data.content || [])).catch(() => {});
    getIncomingSwaps().then(r => setIncoming(r.data || [])).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const handleRespond = async (id, accepted) => {
    try {
      await respondToSwap(id, {
        accepted,
        comment: accepted ? 'Accepted' : 'Declined',
      });
      toast.success(accepted ? 'Swap accepted!' : 'Swap declined');
      fetchData();
    } catch {
      toast.error('Failed to respond to swap');
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelSwap(id);
      toast.success('Swap request cancelled');
      fetchData();
    } catch {
      toast.error('Cannot cancel this swap');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Shift Swap</h1>
        <p className="text-slate-500 text-sm mt-1">
          Request shift swaps with teammates — both parties must confirm
        </p>
      </div>

      {/* Incoming swaps needing response */}
      {incoming.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            ⚠️ {incoming.length} Swap Request{incoming.length > 1 ? 's' : ''} Need Your Response
          </h2>
          <div className="space-y-3">
            {incoming.map((s) => (
              <div key={s.id} className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    <span className="text-blue-600">{s.requester.name}</span> wants to swap shifts
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Their shift: <strong>{s.requesterShiftDate}</strong> ↔ Your shift: <strong>{s.targetShiftDate}</strong>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Reason: {s.reason}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleRespond(s.id, true)}
                    className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(s.id, false)}
                    className="bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My swap requests */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">My Swap Requests</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {mySwaps.length === 0 && (
            <p className="text-center text-slate-400 py-12 text-sm">
              No swap requests yet
            </p>
          )}
          {mySwaps.map((s) => (
            <div key={s.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Swap with <span className="text-blue-600">{s.target.name}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Your date: <strong>{s.requesterShiftDate}</strong> ↔ Their date: <strong>{s.targetShiftDate}</strong>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{s.statusDescription}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[s.status]}`}>
                  {s.status.replace(/_/g, ' ')}
                </span>
                {(s.status === 'PENDING_TARGET_APPROVAL') && (
                  <button
                    onClick={() => handleCancel(s.id)}
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