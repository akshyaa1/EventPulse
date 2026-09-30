import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Ticket,
  User,
  ShieldCheck,
  Edit3
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [ticketsCount, setTicketsCount] = useState(1);
  const [attendeePhone, setAttendeePhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load event:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    try {
      setBookingLoading(true);
      setErrorMessage('');
      const res = await api.post(`/registrations/${id}`, {
        ticketsCount: Number(ticketsCount),
        attendeePhone
      });

      if (res.data.success) {
        setBookingSuccess(res.data.data);
        // Refresh event details to reflect updated registeredCount
        fetchEventDetails();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to complete registration');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 text-sm">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">{errorMessage || "The event you are looking for doesn't exist or was removed."}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to all events
        </Link>
      </div>
    );
  }

  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);
  const isSoldOut = seatsLeft <= 0;
  const isCreator = user?._id && event.organizer?._id && user._id === event.organizer._id;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button and Share */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all events
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          {copied ? 'Link Copied!' : 'Share Event'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Image, Details, Description */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 aspect-[16/9] sm:aspect-[21/9] bg-slate-900 shadow-2xl">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 text-white backdrop-blur-md shadow-lg">
                {event.category}
              </span>
            </div>

            {isCreator && (
              <div className="absolute top-4 right-4">
                <Link
                  to={`/events/edit/${event._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  Edit This Event
                </Link>
              </div>
            )}
          </div>

          {/* Title and Overview */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {event.title}
              </h1>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Highlights Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-800/80">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-400">Date & Time</h4>
                  <p className="text-sm font-semibold text-white">{formattedDate}</p>
                  <p className="text-xs text-slate-400">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 shrink-0">
                  {event.locationType === 'online' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-400">Location</h4>
                  <p className="text-sm font-semibold text-white capitalize">{event.locationType} Event</p>
                  <p className="text-xs text-slate-400 break-words">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base font-bold text-white mb-3">About This Event</h3>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Organizer Info */}
            {event.organizer && (
              <div className="pt-6 border-t border-slate-800/80 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-lg">
                  {event.organizer.name?.[0] || 'O'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white">{event.organizer.name}</h4>
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-xs text-slate-400">
                    {event.organizer.organization || 'Verified Event Organizer'}
                  </p>
                  {event.organizer.bio && (
                    <p className="text-xs text-slate-500 mt-1 max-w-lg">{event.organizer.bio}</p>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Ticket / RSVP Card */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 sticky top-24 shadow-2xl">
            
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div>
                <span className="text-xs font-medium text-slate-400">Admission Price</span>
                <div className="text-3xl font-extrabold text-white">
                  {event.price === 0 ? <span className="text-emerald-400">FREE</span> : `$${event.price}`}
                  {event.price > 0 && <span className="text-xs font-normal text-slate-400 ml-1">/ person</span>}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-slate-400">Availability</span>
                <div className="text-sm font-bold text-slate-200">
                  {seatsLeft > 0 ? (
                    <span className="text-emerald-400">{seatsLeft} spots left</span>
                  ) : (
                    <span className="text-red-400">Sold Out</span>
                  )}
                </div>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="my-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Booking Success Modal / Alert */}
            {bookingSuccess ? (
              <div className="my-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Booking Confirmed!</h4>
                <p className="text-xs text-slate-300">
                  Your ticket code is <strong className="text-indigo-300 font-mono tracking-wider">{bookingSuccess.ticketCode}</strong>
                </p>
                <div className="pt-2">
                  <Link
                    to="/my-registrations"
                    className="inline-block w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
                  >
                    View in My Bookings →
                  </Link>
                </div>
              </div>
            ) : isCreator ? (
              <div className="my-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-center space-y-2">
                <p className="text-xs text-indigo-300 font-medium">You are the creator of this event.</p>
                <Link
                  to="/dashboard"
                  className="block w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Manage in Dashboard
                </Link>
              </div>
            ) : isSoldOut ? (
              <div className="my-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-center">
                <p className="text-sm font-semibold text-slate-300">All spots are fully booked.</p>
                <p className="text-xs text-slate-500 mt-1">Check back later in case attendees cancel.</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="my-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Number of Tickets
                  </label>
                  <select
                    value={ticketsCount}
                    onChange={(e) => setTicketsCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {[...Array(Math.min(5, seatsLeft))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Ticket' : 'Tickets'} {event.price > 0 ? `($${event.price * (i + 1)})` : '(Free)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Subtotal calculation */}
                {event.price > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300">
                    <span>Total Amount</span>
                    <strong className="text-white text-sm">${event.price * ticketsCount}</strong>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  {bookingLoading ? 'Securing Spot...' : (isAuthenticated ? 'Confirm RSVP & Book Ticket' : 'Sign In to RSVP')}
                </button>
              </form>
            )}

            {/* Guarantees */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant digital ticket confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cancel anytime from your dashboard</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetails;
