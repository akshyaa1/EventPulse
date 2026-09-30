import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Video,
  XCircle,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/registrations/my');
      if (res.data.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch user registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your RSVP for "${eventTitle}"? Your spot will be released.`)) {
      return;
    }

    try {
      setActionLoading(id);
      const res = await api.delete(`/registrations/${id}`);
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Registration successfully cancelled.' });
        fetchRegistrations();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to cancel registration'
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Ticket className="w-3.5 h-3.5 text-indigo-400" />
          <span>My Passes & Reservations</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">My Booked Events</h1>
        <p className="text-slate-400 text-sm mt-1">
          Access your confirmed digital tickets, event schedules, and reservation details.
        </p>
      </div>

      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      ) : registrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((reg) => {
            const ev = reg.event;
            if (!ev) return null;

            const eventDate = new Date(ev.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={reg._id}
                className="glass-card rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        Confirmed Pass
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2 line-clamp-1">{ev.title}</h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Ticket ID</span>
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 px-2 py-1 rounded border border-indigo-800/60">
                        {reg.ticketCode}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{eventDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ev.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {ev.locationType === 'online' ? (
                        <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className="truncate">{ev.location}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span>
                      Passes: <strong className="text-white">{reg.ticketsCount}</strong>
                    </span>
                    <span>
                      Amount Paid: <strong className="text-emerald-400">{reg.totalAmount === 0 ? 'FREE' : `$${reg.totalAmount}`}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                  <Link
                    to={`/events/${ev._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View Event Details <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => handleCancelRegistration(reg._id, ev.title)}
                    disabled={actionLoading === reg._id}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {actionLoading === reg._id ? 'Cancelling...' : 'Cancel RSVP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 glass-panel rounded-3xl max-w-lg mx-auto">
          <Ticket className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No active bookings yet</h3>
          <p className="text-slate-400 text-xs mb-6 max-w-xs mx-auto">
            You haven't registered for any events yet. Explore upcoming gatherings and reserve your spot!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Discover Events Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
