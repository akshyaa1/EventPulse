import React from 'react';
import { Calendar, Github, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Event<span className="text-indigo-400">Pulse</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              The modern full-stack event management and handling platform. Discover, organize, and attend unforgettable experiences worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span>Stack: React • Node.js • Express • MongoDB • JWT</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Explore Events</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Event Categories</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Technology & AI</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Music & Concerts</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Startups & Business</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Design & Workshops</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EventPulse. Built with pair-programming agentic precision.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-indigo-400 font-medium">MERN Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
