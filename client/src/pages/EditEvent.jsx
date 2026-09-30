import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { ArrowLeft, AlertCircle, Save, Trash2 } from 'lucide-react';

const categories = ['Tech', 'Music', 'Business', 'Design', 'Workshops', 'Social', 'Other'];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech',
    date: '',
    time: '',
    locationType: 'venue',
    location: '',
    capacity: 100,
    price: 0,
    imageUrl: '',
    status: 'upcoming',
    tags: ''
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [registeredCount, setRegisteredCount] = useState(0);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setInitialLoading(true);
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        const ev = res.data.data;
        // Format ISO date to yyyy-MM-dd for HTML date input
        const dateStr = ev.date ? new Date(ev.date).toISOString().split('T')[0] : '';
        setFormData({
          title: ev.title || '',
          description: ev.description || '',
          category: ev.category || 'Tech',
          date: dateStr,
          time: ev.time || '',
          locationType: ev.locationType || 'venue',
          location: ev.location || '',
          capacity: ev.capacity || 1,
          price: ev.price || 0,
          imageUrl: ev.imageUrl || '',
          status: ev.status || 'upcoming',
          tags: ev.tags ? ev.tags.join(', ') : ''
        });
        setRegisteredCount(ev.registeredCount || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      if (Number(formData.capacity) < registeredCount) {
        setError(`Capacity cannot be lower than existing registrations (${registeredCount})`);
        setSubmitting(false);
        return;
      }

      const res = await api.put(`/events/${id}`, formData);
      if (res.data.success) {
        navigate(`/events/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this event? All associated registrations will also be deleted.')) {
      try {
        setSubmitting(true);
        const res = await api.delete(`/events/${id}`);
        if (res.data.success) {
          navigate('/dashboard');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete event');
        setSubmitting(false);
      }
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 text-sm">Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to={`/events/${id}`} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Event Details
          </Link>
          <h1 className="text-3xl font-extrabold text-white mt-2">Edit Event</h1>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 border border-red-500/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Event
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-800">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Event Details</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Description</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-800">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Schedule, Location & Capacity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time</label>
              <input
                type="text"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Format</label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="venue">In-Person Venue</option>
                <option value="online">Online / Virtual</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Address or Link</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Capacity (Minimum {registeredCount} registered)
              </label>
              <input
                type="number"
                name="capacity"
                min={registeredCount}
                required
                value={formData.capacity}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Price (USD)</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cover Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to={`/events/${id}`}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
