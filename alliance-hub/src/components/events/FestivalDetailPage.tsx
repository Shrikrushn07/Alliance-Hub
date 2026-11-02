import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Bell, 
  Clock, 
  Trophy, 
  Share2, 
  CheckCircle2, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { CampusFestival, CampusEvent, Student } from '../../types';
import { EventCard } from './EventCard';
import { storageService } from '../../services/storageService';
import { useToast } from '../ui/ToastContext';

interface FestivalDetailPageProps {
  festival: CampusFestival;
  subEvents: CampusEvent[];
  student: Student;
  onBack: () => void;
  onSelectSubEvent: (event: CampusEvent) => void;
  onRegisterEvent: (event: CampusEvent) => void;
  onRefresh: () => void;
}

export const FestivalDetailPage: React.FC<FestivalDetailPageProps> = ({
  festival,
  subEvents,
  student,
  onBack,
  onSelectSubEvent,
  onRegisterEvent,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [activeScheduleDay, setActiveScheduleDay] = useState<number>(0);

  // Sub-categories available in this festival
  const subCategories = useMemo(() => {
    const cats = Array.from(new Set(subEvents.map(e => e.category)));
    return ['All', ...cats];
  }, [subEvents]);

  const filteredSubEvents = useMemo(() => {
    if (selectedSubCategory === 'All') return subEvents;
    return subEvents.filter(e => e.category === selectedSubCategory);
  }, [subEvents, selectedSubCategory]);

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

  const handleShareFestival = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    showToast('Link Copied', `Official link for ${festival.title} copied.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#575F6E] hover:text-[#111418] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campus Events Directory</span>
        </button>

        <button
          onClick={handleShareFestival}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#D1D5DB] hover:border-[#111418] rounded-xl text-[#111418] shadow-xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-[#575F6E]" />
          <span>Share Festival</span>
        </button>
      </div>

      {/* Editorial Festival Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-xl border border-slate-800">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img 
            src={festival.heroImage} 
            alt={festival.title} 
            className="w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111418] via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111418]/90 via-transparent to-transparent" />
        </div>

        {/* Floating Content over Hero */}
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-white/90 text-[#111418] rounded-lg">
              Official University Festival
            </span>
            {festival.verificationStatus === 'Verified' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-[#1D4ED8] text-white rounded-lg shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified by Campus Senate</span>
              </span>
            )}
            <span className="px-3 py-1 text-xs font-mono bg-white/10 text-white/90 rounded-lg backdrop-blur-sm">
              {festival.expectedAttendees ? `~${festival.expectedAttendees.toLocaleString()} Expected Students` : 'Open Campus'}
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-mono text-blue-300 uppercase tracking-widest">
              {festival.startDate} — {festival.endDate}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {festival.title}
            </h1>
            {festival.theme && (
              <p className="text-sm sm:text-base text-blue-100 font-mono">
                Theme: "{festival.theme}"
              </p>
            )}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl line-clamp-2 pt-1">
              {festival.description}
            </p>
          </div>
        </div>
      </div>

      {/* Festival Key Logistics Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white border border-[#E6E8EB] rounded-2xl shadow-xs text-xs">
        <div className="space-y-1">
          <span className="text-[#88909E] uppercase font-mono text-[10px] block">Main Festival Dates</span>
          <div className="font-bold text-[#111418] flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>{festival.startDate} – {festival.endDate}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[#88909E] uppercase font-mono text-[10px] block">Primary Grounds</span>
          <div className="font-bold text-[#111418] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
            <span className="truncate">{festival.venue}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[#88909E] uppercase font-mono text-[10px] block">Curating Authority</span>
          <div className="font-bold text-[#111418] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
            <span className="truncate">{festival.organizer}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[#88909E] uppercase font-mono text-[10px] block">Sub-Events & Contests</span>
          <div className="font-bold text-[#1D4ED8] flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>{subEvents.length} Active Challenges</span>
          </div>
        </div>
      </div>

      {/* Live Festival Announcements Feed */}
      {festival.announcements && festival.announcements.length > 0 && (
        <div className="p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1D4ED8] font-mono uppercase tracking-wider">
            <Bell className="w-4 h-4 text-[#1D4ED8]" />
            <span>Live Festival Bulletin & Advisories</span>
          </div>
          <div className="space-y-2">
            {festival.announcements.map(ann => (
              <div key={ann.id} className="p-3 bg-white/90 border border-blue-100 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111418]">{ann.title}</span>
                  <span className="font-mono text-[10px] text-[#88909E]">{ann.publishedAt}</span>
                </div>
                <p className="text-[#575F6E] leading-relaxed">{ann.description}</p>
                <div className="text-[10px] font-mono text-[#88909E] pt-0.5">Author: {ann.author}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day-by-Day Festival Schedule Highlights */}
      {festival.scheduleHighlights && festival.scheduleHighlights.length > 0 && (
        <div className="bg-white border border-[#E6E8EB] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E8EB]">
            <div>
              <span className="text-xs font-mono font-bold text-[#1D4ED8] uppercase tracking-wider block">
                Official Festival Itinerary
              </span>
              <h3 className="text-xl font-extrabold text-[#111418] mt-0.5">
                Day-by-Day Progression
              </h3>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F4F4F1] border border-[#E6E8EB] rounded-xl text-xs font-semibold overflow-x-auto">
              {festival.scheduleHighlights.map((sched, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveScheduleDay(idx)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeScheduleDay === idx 
                      ? 'bg-white text-[#111418] shadow-xs font-bold' 
                      : 'text-[#575F6E] hover:text-[#111418]'
                  }`}
                >
                  {sched.day}
                </button>
              ))}
            </div>
          </div>

          {/* Active Day Detail Display */}
          {festival.scheduleHighlights[activeScheduleDay] && (
            <div className="p-6 bg-[#FBFBFA] border border-[#E6E8EB] rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-base font-bold text-[#111418]">
                  {festival.scheduleHighlights[activeScheduleDay].title}
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono text-[#1D4ED8]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{festival.scheduleHighlights[activeScheduleDay].time}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#575F6E] leading-relaxed">
                {festival.scheduleHighlights[activeScheduleDay].description}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#88909E] pt-2 border-t border-[#E6E8EB]">
                <MapPin className="w-3.5 h-3.5 text-[#88909E]" />
                <span>Venue: {festival.scheduleHighlights[activeScheduleDay].venue}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parent-Child Sub-Events & Competitions Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E8EB]">
          <div>
            <div className="text-xs font-mono font-bold text-[#1D4ED8] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Festival Competitions, Battles & Workshops</span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#111418] mt-1">
              Sub-Events Directory ({filteredSubEvents.length})
            </h3>
            <p className="text-xs text-[#575F6E] mt-0.5">
              Each sub-event requires an individual team entry or delegate pass. Select any challenge below to register.
            </p>
          </div>

          {/* Category Filter Segments */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {subCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedSubCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  selectedSubCategory === cat
                    ? 'bg-[#111418] text-white font-semibold'
                    : 'bg-white border border-[#D1D5DB] text-[#575F6E] hover:border-[#111418]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Events Cards Grid */}
        {filteredSubEvents.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#E6E8EB] rounded-2xl text-xs text-[#88909E]">
            No competitions found in this category for {festival.title}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={storageService.isRegisteredForEvent(event.id)}
                isSaved={storageService.isEventSaved(event.id)}
                onSelect={onSelectSubEvent}
                onRegister={onRegisterEvent}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </div>

      {/* Participating Clubs and University Departments */}
      {festival.participatingClubs && festival.participatingClubs.length > 0 && (
        <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-3 shadow-xs">
          <span className="text-xs font-mono font-bold text-[#88909E] uppercase tracking-wider block">
            Participating Student Societies & Campus Councils
          </span>
          <div className="flex flex-wrap gap-2">
            {festival.participatingClubs.map((club, idx) => (
              <div 
                key={idx}
                className="px-3 py-1.5 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl text-xs font-medium text-[#111418] flex items-center gap-1.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
                <span>{club}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
