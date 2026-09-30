import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, Users, Tag } from 'lucide-react';

const categoryColors = {
  Tech: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Music: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Business: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Design: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Workshops: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Social: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Other: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
};

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isSoldOut = seatsLeft <= 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 border border-slate-800">
      {/* Event Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${categoryColors[event.category] || categoryColors.Other}`}>
            {event.category}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-white border border-slate-700 shadow-sm backdrop-blur-md">
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </span>
        </div>

        {/* Date Ribbon */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-slate-200 bg-slate-950/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>

          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-2 mb-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>

            <div className="flex items-center gap-2">
              {event.locationType === 'online' ? (
                <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Card Footer: Capacity and Action */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-500" />
                {isSoldOut ? (
                  <span className="text-red-400 font-semibold">Sold Out</span>
                ) : (
                  <span><strong className="text-slate-200">{seatsLeft}</strong> spots left</span>
                )}
              </span>
              <span className="text-slate-500">{percentFilled}% filled</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentFilled >= 90 ? 'bg-red-500' : percentFilled >= 70 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>

          <Link
            to={`/events/${event._id}`}
            className="w-full block text-center py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all duration-200 border border-slate-700/60 hover:border-transparent shadow-sm"
          >
            {isSoldOut ? 'View Details' : 'View & RSVP →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
