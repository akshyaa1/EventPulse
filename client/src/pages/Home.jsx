import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import EventCard from '../components/EventCard';
import { Search, Sparkles, Calendar, PlusCircle, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Tech', 'Music', 'Business', 'Design', 'Workshops', 'Social'];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isAuthenticated, isOrganizer } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async (query = search) => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (query.trim()) params.search = query.trim();

      const res = await api.get('/events', { params });
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents(search);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Glow ambient spots */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Discover & Manage Live Events Worldwide</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            Where Moments Turn Into <span className="gradient-text">Unforgettable</span> Gatherings
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            The modern platform to discover conferences, hackathons, concerts, and masterclasses — or organize, manage, and scale your own events effortlessly.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic, speaker, conference, city..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Organizer Quick Callout */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span>Are you an event creator?</span>
            {isAuthenticated && isOrganizer ? (
              <Link to="/create-event" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" /> Launch your event now
              </Link>
            ) : (
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
                Register as an Organizer to start hosting
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Explore Upcoming Events
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Showing {events.length} curated events
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card rounded-2xl h-80 animate-pulse p-4">
                <div className="w-full h-40 bg-slate-800 rounded-xl mb-4" />
                <div className="w-3/4 h-5 bg-slate-800 rounded mb-2" />
                <div className="w-1/2 h-4 bg-slate-800 rounded mb-4" />
                <div className="w-full h-8 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-2xl max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No events found</h3>
            <p className="text-slate-400 text-xs mb-6 max-w-xs mx-auto">
              We couldn't find any events matching your search or category filter. Try clearing filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                fetchEvents('');
              }}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
