import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Sparkles, 
  QrCode, 
  Layers, 
  MapPin, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  Clock, 
  Users, 
  Trophy 
} from 'lucide-react';
import { CampusFestival, CampusEvent, Student } from '../types';
import { FestivalCard } from '../components/events/FestivalCard';
import { EventCard } from '../components/events/EventCard';
import { EventCalendar } from '../components/events/EventCalendar';
import { storageService } from '../services/storageService';
import { useToast } from '../components/ui/ToastContext';

interface EventsPageProps {
  festivals: CampusFestival[];
  events: CampusEvent[];
  student: Student;
  onSelectFestival: (festival: CampusFestival) => void;
  onSelectEvent: (event: CampusEvent) => void;
  onRegisterEvent: (event: CampusEvent) => void;
  onOpenMyPasses: () => void;
  onOpenCreateEvent: () => void;
  onRefresh: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  festivals,
  events,
  student,
  onSelectFestival,
  onSelectEvent,
  onRegisterEvent,
  onOpenMyPasses,
  onOpenCreateEvent,
  onRefresh
}) => {
  const { showToast } = useToast();

  const [activeView, setActiveView] = useState<'directory' | 'calendar'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFestivalFilter, setSelectedFestivalFilter] = useState<string>('All');

  const registeredCount = storageService.getEventRegistrations().filter(r => r.registrationStatus === 'Confirmed').length;

  // Primary Featured Festival (Alliance ONE)
  const featuredFestival = useMemo(() => {
    return festivals.find(f => f.featured) || festivals[0];
  }, [festivals]);

  // Sub-event counts for festivals
  const festivalSubEventCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const fest of festivals) {
      map[fest.id] = events.filter(e => e.festivalId === fest.id).length;
    }
    return map;
  }, [festivals, events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchDesc = evt.description.toLowerCase().includes(q);
        const matchOrg = evt.organizer.toLowerCase().includes(q);
        const matchVenue = evt.venue.toLowerCase().includes(q);
        const matchTags = evt.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchOrg && !matchVenue && !matchTags) return false;
      }

      if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
        return false;
      }

      if (selectedFestivalFilter !== 'All') {
        if (selectedFestivalFilter === 'standalone' && evt.festivalId) return false;
        if (selectedFestivalFilter !== 'standalone' && evt.festivalId !== selectedFestivalFilter) return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedCategory, selectedFestivalFilter]);

  const handleToggleSave = (eventId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = storageService.toggleSaveEvent(eventId);
    showToast(
      isSaved ? 'Event Saved' : 'Event Removed',
      isSaved ? `Saved "${title}" to your bookmarks.` : `Removed "${title}" from bookmarks.`,
      'info'
    );
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Editorial Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E6E8EB]">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Life, Cultural Festivals & University Calendar</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111418] mt-1 tracking-tight">
            Campus Events & Festivals
          </h1>
          <p className="text-sm text-[#575F6E] mt-1 max-w-2xl leading-relaxed">
            The pulse of Alliance University. Discover flagship multi-day celebrations, competitive sports clashes, academic symposiums, and student-led cultural battles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Digital Passes Quick Link */}
          <button
            onClick={onOpenMyPasses}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#111418] bg-white border border-[#D1D5DB] hover:border-[#111418] rounded-xl transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4 text-[#1D4ED8]" />
            <span>My Event Passes</span>
            {registeredCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white text-[10px] font-bold font-mono flex items-center justify-center">
                {registeredCount}
              </span>
            )}
          </button>

          {/* Host Event Action */}
          <button
            onClick={onOpenCreateEvent}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Host Festival / Event</span>
          </button>
        </div>
      </div>

      {/* Featured Mega Festival Spotlight Fold */}
      {featuredFestival && (
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-xl border border-slate-800">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img 
              src={featuredFestival.heroImage} 
              alt={featuredFestival.title} 
              className="w-full h-full object-cover object-center opacity-70 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111418] via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111418]/90 via-transparent to-transparent" />
          </div>

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-white text-[#111418] rounded-lg">
                  Flagship Spotlight
                </span>
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#1D4ED8] text-white rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>University Major</span>
                </span>
              </div>

              <span className="font-mono text-xs text-white/80 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                {featuredFestival.startDate} – {featuredFestival.endDate}
              </span>
            </div>

            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {featuredFestival.title}
              </h2>
              {featuredFestival.theme && (
                <div className="text-xs font-mono text-blue-200">
                  Theme: "{featuredFestival.theme}"
                </div>
              )}
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {featuredFestival.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectFestival(featuredFestival)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#111418] bg-white hover:bg-blue-50 rounded-xl transition-colors shadow-sm"
                >
                  <span>Explore Festival Hub & Sub-Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-white/80 font-mono">
                  {festivalSubEventCounts[featuredFestival.id] || 0} Contests Scheduled
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Switcher: Curated Directory vs Interactive Event Calendar */}
      <div className="flex items-center justify-between border-b border-[#E6E8EB] pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <button
            onClick={() => setActiveView('directory')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeView === 'directory'
                ? 'bg-[#111418] text-white shadow-xs'
                : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
            }`}
          >
            Curated Events Directory ({events.length})
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'calendar'
                ? 'bg-[#111418] text-white shadow-xs'
                : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Interactive Campus Calendar</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs font-mono text-[#88909E]">
          Anekal Main Campus · Academic Year 2025-26
        </span>
      </div>

      {/* VIEW 1: CURATED DIRECTORY */}
      {activeView === 'directory' && (
        <div className="space-y-8">
          
          {/* Major Festivals Showcase (Parent Entities) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#1D4ED8]" />
                  <span>Major University Festivals ({festivals.length})</span>
                </h3>
                <p className="text-xs text-[#575F6E] mt-0.5">
                  Multi-day campus celebrations featuring inter-collegiate showdowns and pro-nites.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {festivals.map(fest => (
                <FestivalCard
                  key={fest.id}
                  festival={fest}
                  subEventCount={festivalSubEventCounts[fest.id] || 0}
                  onSelect={onSelectFestival}
                />
              ))}
            </div>
          </div>

          {/* Filter Bar for Campus Competitions & Events */}
          <div className="pt-4 border-t border-[#E6E8EB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#111418]">
                  Individual Competitions, Battles & Workshops ({filteredEvents.length})
                </h3>
                <p className="text-xs text-[#575F6E]">
                  Filter by category, search by skill or venue, and register for digital entry passes.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#88909E]" />
                <input
                  type="text"
                  placeholder="Search events, bands, sports, robotics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>
            </div>

            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                'All',
                'Cultural',
                'Technical',
                'Sports',
                'Entrepreneurship',
                'Workshop & Masterclass',
                'Department Fest'
              ].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#111418] text-white font-semibold'
                      : 'bg-white border border-[#D1D5DB] text-[#575F6E] hover:border-[#111418]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Parent Festival Filter Segment */}
            <div className="flex items-center gap-2 text-xs text-[#575F6E] flex-wrap">
              <span className="text-[11px] font-semibold text-[#88909E]">Filter by Festival:</span>
              <button
                onClick={() => setSelectedFestivalFilter('All')}
                className={`px-2.5 py-1 rounded-lg text-[11px] ${
                  selectedFestivalFilter === 'All' ? 'bg-[#1D4ED8] text-white font-semibold' : 'bg-[#F4F4F1] hover:bg-white text-[#575F6E]'
                }`}
              >
                All Events
              </button>
              {festivals.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFestivalFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] ${
                    selectedFestivalFilter === f.id ? 'bg-[#1D4ED8] text-white font-semibold' : 'bg-[#F4F4F1] hover:bg-white text-[#575F6E]'
                  }`}
                >
                  {f.title.split(' ')[0]}
                </button>
              ))}
              <button
                onClick={() => setSelectedFestivalFilter('standalone')}
                className={`px-2.5 py-1 rounded-lg text-[11px] ${
                  selectedFestivalFilter === 'standalone' ? 'bg-[#1D4ED8] text-white font-semibold' : 'bg-[#F4F4F1] hover:bg-white text-[#575F6E]'
                }`}
              >
                Standalone Only
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E6E8EB] rounded-2xl space-y-2">
              <CalendarIcon className="w-8 h-8 text-[#88909E] mx-auto" />
              <h4 className="text-sm font-bold text-[#111418]">No events match these criteria</h4>
              <p className="text-xs text-[#575F6E]">
                Try adjusting your category or search terms, or view the complete festival hubs above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={storageService.isRegisteredForEvent(event.id)}
                  isSaved={storageService.isEventSaved(event.id)}
                  onSelect={onSelectEvent}
                  onRegister={onRegisterEvent}
                  onToggleSave={handleToggleSave}
                  onSelectFestival={(festId) => {
                    const targetFest = festivals.find(f => f.id === festId);
                    if (targetFest) onSelectFestival(targetFest);
                  }}
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* VIEW 2: INTERACTIVE CALENDAR */}
      {activeView === 'calendar' && (
        <EventCalendar
          events={events}
          festivals={festivals}
          onSelectEvent={onSelectEvent}
          onRegisterEvent={onRegisterEvent}
          onSelectFestival={onSelectFestival}
        />
      )}

      {/* Official Footnote adhering to Data Accuracy Guidelines */}
      <div className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#88909E] gap-2">
        <span>Campus Prototype & Intelligence Engine · Alliance University, Bengaluru</span>
        <span>Official Schedules & Venues Subject to University Senate & Departmental Circulars</span>
      </div>

    </div>
  );
};
