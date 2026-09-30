import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  X,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react';

const OrganizerDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    totalCapacity: 0,
    averageFillRate: 0
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Attendee Modal state
  const [activeEventAttendees, setActiveEventAttendees] = useState(null);
  const [attendeesList, setAttendeesList] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events/my/organized');
      if (res.data.success) {
        setStats(res.data.stats);
        setEvents(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAttendees = async (event) => {
    setActiveEventAttendees(event);
    try {
      setModalLoading(true);
      const res = await api.get(`/registrations/event/${event._id}`);
      if (res.data.success) {
        setAttendeesList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load attendees:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        const res = await api.delete(`/events/${id}`);
        if (res.data.success) {
          fetchDashboardData();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Organizer Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor real-time attendee bookings, revenue metrics, and event operations.
          </p>
        </div>

        <Link
          to="/create-event"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" /> Create New Event
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Events Created</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{stats.totalEvents}</h3>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Attendees</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{stats.totalRegistrations}</h3>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticket Revenue</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">${stats.totalRevenue}</h3>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-pink-500/10 text-pink-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Fill Rate</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{stats.averageFillRate}%</h3>
          </div>
        </div>
      </div>

      {/* Events Management Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Managed Events</h2>
          <span className="text-xs text-slate-400">{events.length} Total</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading your events...</div>
        ) : events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Registrations</th>
                  <th className="px-6 py-4">Price / Revenue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {events.map((ev) => {
                  const evDate = new Date(ev.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={ev._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ev.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <Link
                              to={`/events/${ev._id}`}
                              className="font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1"
                            >
                              {ev.title}
                            </Link>
                            <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                              {ev.location}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                          {ev.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-300 font-medium">
                        {evDate}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{ev.registeredCount}</span>
                          <span className="text-slate-500">/ {ev.capacity}</span>
                        </div>
                        <div className="w-20 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (ev.registeredCount / ev.capacity) * 100)}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">
                          {ev.price === 0 ? 'Free' : `$${ev.price}`}
                        </p>
                        <p className="text-[10px] text-emerald-400">
                          Rev: ${ev.registeredCount * ev.price}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ev.status === 'upcoming'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : ev.status === 'completed'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenAttendees(ev)}
                            title="View Attendee List"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            to={`/events/edit/${ev._id}`}
                            title="Edit Event"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteEvent(ev._id, ev.title)}
                            title="Delete Event"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-600/30 text-slate-300 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-14 p-6">
            <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">You haven't created any events yet.</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Host your first conference, workshop, or meetup now.</p>
            <Link
              to="/create-event"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Create Event
            </Link>
          </div>
        )}
      </div>

      {/* Attendee Roster Modal */}
      {activeEventAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Attendee Roster</h3>
                <p className="text-xs text-slate-400">{activeEventAttendees.title}</p>
              </div>
              <button
                onClick={() => setActiveEventAttendees(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {modalLoading ? (
                <div className="text-center py-8 text-slate-400 text-sm">Loading attendees...</div>
              ) : attendeesList.length > 0 ? (
                <div className="space-y-3">
                  {attendeesList.map((att) => (
                    <div
                      key={att._id}
                      className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-500/20">
                          {att.attendeeName?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{att.attendeeName}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-500" /> {att.attendeeEmail}
                            </span>
                            {att.attendeePhone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-500" /> {att.attendeePhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950 px-2 py-1 rounded border border-indigo-800/60 block mb-1">
                          {att.ticketCode}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {att.ticketsCount} {att.ticketsCount === 1 ? 'ticket' : 'tickets'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No attendees have registered for this event yet.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/60 text-right">
              <button
                onClick={() => setActiveEventAttendees(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
