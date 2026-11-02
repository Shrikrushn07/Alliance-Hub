import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Bookmark, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Users, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { CampusEvent } from '../../types';

interface EventCardProps {
  event: CampusEvent;
  isRegistered?: boolean;
  isSaved?: boolean;
  onSelect: (event: CampusEvent) => void;
  onRegister: (event: CampusEvent) => void;
  onToggleSave: (eventId: string, eventTitle: string, e: React.MouseEvent) => void;
  onSelectFestival?: (festivalId: string) => void;
}

const CATEGORY_STYLES: Record<string, { badge: string; border: string }> = {
  'Cultural': { badge: 'bg-rose-50 text-rose-800 border-rose-200', border: 'hover:border-rose-300' },
  'Technical': { badge: 'bg-blue-50 text-blue-800 border-blue-200', border: 'hover:border-blue-300' },
  'Sports': { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', border: 'hover:border-emerald-300' },
  'Entrepreneurship': { badge: 'bg-amber-50 text-amber-800 border-amber-200', border: 'hover:border-amber-300' },
  'Workshop & Masterclass': { badge: 'bg-purple-50 text-purple-800 border-purple-200', border: 'hover:border-purple-300' },
  'Department Fest': { badge: 'bg-slate-100 text-slate-800 border-slate-300', border: 'hover:border-slate-400' }
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isRegistered = false,
  isSaved = false,
  onSelect,
  onRegister,
  onToggleSave,
  onSelectFestival
}) => {
  const categoryStyle = CATEGORY_STYLES[event.category] || {
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    border: 'hover:border-slate-300'
  };

  const formatEventDateTime = (datetimeStr: string) => {
    try {
      const date = new Date(datetimeStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return datetimeStr;
    }
  };

  return (
    <div 
      onClick={() => onSelect(event)}
      className="group bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-5 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${categoryStyle.badge}`}>
              {event.category}
            </span>

            {event.festivalTitle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (event.festivalId && onSelectFestival) {
                    onSelectFestival(event.festivalId);
                  }
                }}
                className="text-[10px] font-mono font-medium text-[#1D4ED8] bg-blue-50/70 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1 transition-colors"
                title={`Part of ${event.festivalTitle}`}
              >
                <Layers className="w-3 h-3" />
                <span className="truncate max-w-[130px]">{event.festivalTitle}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => onToggleSave(event.id, event.title, e)}
            className="p-1.5 text-[#88909E] hover:text-[#111418] hover:bg-[#F4F4F1] rounded-lg transition-colors"
            title={isSaved ? 'Saved to bookmarks' : 'Save event'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#1D4ED8] text-[#1D4ED8]' : ''}`} />
          </button>
        </div>

        {/* Title & Description */}
        <div>
          <h4 className="text-base font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors leading-snug">
            {event.title}
          </h4>
          <p className="text-xs text-[#575F6E] mt-1 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Highlights: Schedule & Venue */}
        <div className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#111418] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
            <span className="font-semibold">{formatEventDateTime(event.startDatetime)}</span>
          </div>

          <div className="flex items-center gap-2 text-[#575F6E]">
            <MapPin className="w-3.5 h-3.5 text-[#88909E] shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Prize Pool or Spots Left */}
        <div className="flex items-center justify-between text-[11px] text-[#575F6E]">
          {event.prizePool ? (
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <Trophy className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{event.prizePool}</span>
            </div>
          ) : (
            <span className="text-[#88909E]">Official Certificate of Participation</span>
          )}

          {event.openSpots && (
            <span className="font-mono text-[#88909E]">
              {event.totalRegistrations || 0}/{event.openSpots} registered
            </span>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-[#E6E8EB] flex items-center justify-between gap-3 text-xs">
        <span className="text-[11px] text-[#88909E] truncate max-w-[130px]">
          By {event.organizer}
        </span>

        <div className="flex items-center gap-2">
          {isRegistered ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pass Confirmed</span>
            </span>
          ) : event.registrationType === 'external' ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRegister(event);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D1D5DB] hover:border-[#111418] text-[#111418] rounded-xl font-semibold transition-all shadow-xs"
            >
              <span>Portal Link</span>
              <ExternalLink className="w-3 h-3 text-[#88909E]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRegister(event);
              }}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#111418] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold transition-all shadow-xs"
            >
              <span>Get Pass</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
