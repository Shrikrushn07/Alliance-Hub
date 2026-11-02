import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  CheckCircle2,
  Layers
} from 'lucide-react';
import { CampusEvent, CampusFestival, EventCategory } from '../../types';

interface EventCalendarProps {
  events: CampusEvent[];
  festivals: CampusFestival[];
  onSelectEvent: (event: CampusEvent) => void;
  onRegisterEvent: (event: CampusEvent) => void;
  onSelectFestival: (festival: CampusFestival) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  festivals,
  onSelectEvent,
  onRegisterEvent,
  onSelectFestival
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  
  // Starting month: April 2026 (Active Festival Season)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(3); // 0-indexed: 3 = April
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-04-16'); // Default to Alliance ONE opening day!
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter events based on category
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
      return true;
    });
  }, [events, categoryFilter]);

  // Map events to date strings "YYYY-MM-DD"
  const eventsByDate = useMemo(() => {
    const map: Record<string, CampusEvent[]> = {};
    for (const evt of filteredEvents) {
      const dateKey = evt.startDatetime.split('T')[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(evt);
    }
    return map;
  }, [filteredEvents]);

  // Festivals active dates
  const festivalsByDate = useMemo(() => {
    const map: Record<string, CampusFestival[]> = {};
    for (const fest of festivals) {
      const start = new Date(fest.startDate);
      const end = new Date(fest.endDate);
      const cur = new Date(start);
      while (cur <= end) {
        const key = cur.toISOString().split('T')[0];
        if (!map[key]) map[key] = [];
        map[key].push(fest);
        cur.setDate(cur.getDate() + 1);
      }
    }
    return map;
  }, [festivals]);

  // Calendar month days calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ dateStr, dayNum, isCurrentMonth: false });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ dateStr, dayNum, isCurrentMonth: true });
    }

    // Next month padding to fill grid
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: i, isCurrentMonth: false });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Selected date's events
  const selectedDayEvents = eventsByDate[selectedDateStr] || [];
  const selectedDayFestivals = festivalsByDate[selectedDateStr] || [];

  return (
    <div className="bg-white border border-[#E6E8EB] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E8EB]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1D4ED8] uppercase tracking-wider">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Alliance Academic & Festival Calendar</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#111418] mt-1 flex items-center gap-2">
            <span>{monthNames[currentMonth]} {currentYear}</span>
            <span className="text-xs font-normal text-[#575F6E] font-mono">
              ({filteredEvents.length} events logged)
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#F4F4F1] border border-[#E6E8EB] rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'month' ? 'bg-white text-[#111418] shadow-xs' : 'text-[#575F6E] hover:text-[#111418]'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'week' ? 'bg-white text-[#111418] shadow-xs' : 'text-[#575F6E] hover:text-[#111418]'
              }`}
            >
              Weekly Horizon
            </button>
          </div>

          {/* Month Prev/Next Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 border border-[#D1D5DB] rounded-xl hover:bg-[#F4F4F1] text-[#111418] transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentYear(2026);
                setCurrentMonth(3); // April 2026
                setSelectedDateStr('2026-04-16');
              }}
              className="px-3 py-1.5 text-xs font-semibold border border-[#D1D5DB] rounded-xl hover:bg-[#F4F4F1] text-[#111418]"
            >
              Festival Season
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 border border-[#D1D5DB] rounded-xl hover:bg-[#F4F4F1] text-[#111418] transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['All', 'Cultural', 'Technical', 'Sports', 'Entrepreneurship', 'Workshop & Masterclass', 'Department Fest'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-[#111418] text-white font-semibold'
                : 'bg-[#FBFBFA] border border-[#E6E8EB] text-[#575F6E] hover:bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* VIEW: MONTH GRID */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 7-Column Calendar Grid (8 cols) */}
          <div className="lg:col-span-8 bg-[#FBFBFA] border border-[#E6E8EB] rounded-2xl p-4 overflow-hidden">
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-[#88909E] uppercase pb-3 border-b border-[#E6E8EB]">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {calendarDays.map((cell, idx) => {
                const dayEvts = eventsByDate[cell.dateStr] || [];
                const dayFests = festivalsByDate[cell.dateStr] || [];
                const isSelected = selectedDateStr === cell.dateStr;
                const hasFest = dayFests.length > 0;
                const hasEvents = dayEvts.length > 0;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`min-h-[76px] p-2 rounded-xl text-left border flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? 'border-[#1D4ED8] bg-blue-50/50 shadow-xs'
                        : cell.isCurrentMonth
                        ? 'border-[#E6E8EB] bg-white hover:border-[#111418]'
                        : 'border-transparent bg-transparent opacity-30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold ${
                        isSelected ? 'text-[#1D4ED8]' : 'text-[#111418]'
                      }`}>
                        {cell.dayNum}
                      </span>

                      {hasFest && (
                        <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" title="Major Festival Active" />
                      )}
                    </div>

                    {/* Miniature event pills */}
                    <div className="space-y-1 w-full overflow-hidden">
                      {hasFest && (
                        <div className="text-[9px] font-bold text-white bg-[#111418] px-1 py-0.5 rounded truncate">
                          {dayFests[0].title.split(' ')[0]} Fest
                        </div>
                      )}

                      {dayEvts.slice(0, 2).map(ev => (
                        <div 
                          key={ev.id} 
                          className="text-[9px] font-medium text-[#111418] bg-[#F4F4F1] border border-[#E6E8EB] px-1 py-0.2 rounded truncate"
                        >
                          {ev.title}
                        </div>
                      ))}

                      {dayEvts.length > 2 && (
                        <div className="text-[8px] font-mono text-[#88909E] text-right">
                          +{dayEvts.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Day Inspector Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E6E8EB] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="pb-3 border-b border-[#E6E8EB]">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#88909E] block">
                Selected Date Schedule
              </span>
              <h3 className="text-base font-extrabold text-[#111418] mt-0.5">
                {new Date(selectedDateStr).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
            </div>

            {/* Active Festival on this date */}
            {selectedDayFestivals.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#1D4ED8] uppercase tracking-wider block">
                  Active Major Festival
                </span>
                {selectedDayFestivals.map(fest => (
                  <div 
                    key={fest.id}
                    onClick={() => onSelectFestival(fest)}
                    className="p-3 bg-gradient-to-br from-[#111418] to-slate-900 text-white rounded-xl cursor-pointer hover:border-[#1D4ED8] border border-transparent transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-blue-300">
                      <span>{fest.startDate} – {fest.endDate}</span>
                      <span className="bg-[#1D4ED8] text-white px-1.5 py-0.2 rounded">Official</span>
                    </div>
                    <div className="font-bold text-sm">{fest.title}</div>
                    <div className="text-xs text-white/80 line-clamp-1">{fest.venue}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-Events scheduled on this date */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#111418] uppercase tracking-wider block">
                Scheduled Events ({selectedDayEvents.length})
              </span>

              {selectedDayEvents.length === 0 && selectedDayFestivals.length === 0 ? (
                <div className="p-8 text-center bg-[#FBFBFA] border border-dashed border-[#D1D5DB] rounded-xl text-xs text-[#88909E] space-y-1">
                  <p>No competitions or workshops scheduled for this date.</p>
                  <p className="text-[11px]">Click on highlighted days (e.g. Apr 16–18 or May 8–10).</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {selectedDayEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => onSelectEvent(event)}
                      className="p-3.5 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-[#E6E8EB] text-[#111418]">
                          {event.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#575F6E]">
                          <Clock className="w-3 h-3 text-[#1D4ED8]" />
                          <span>{event.startDatetime.split('T')[1].slice(0, 5)}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors leading-snug">
                        {event.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#575F6E]">
                        <MapPin className="w-3 h-3 text-[#88909E] shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>

                      <div className="pt-2 border-t border-[#E6E8EB] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#88909E]">
                          {event.prizePool || 'Certificate'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRegisterEvent(event);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* VIEW: WEEKLY TIMELINE HORIZON */}
      {viewMode === 'week' && (
        <div className="space-y-4">
          <div className="p-3 bg-[#F4F4F1] border border-[#E6E8EB] rounded-xl text-xs text-[#575F6E]">
            Displaying the active 7-day chronological horizon around <strong>Alliance ONE Mega-Fest (April 14 – April 20, 2026)</strong>.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <div 
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-4 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] font-bold text-[#1D4ED8]">
                    {event.startDatetime.replace('T', ' · ')}
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white border border-[#E6E8EB]">
                    {event.category}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#111418]">
                  {event.title}
                </h4>

                <p className="text-xs text-[#575F6E] line-clamp-2">
                  {event.description}
                </p>

                <div className="pt-2 border-t border-[#E6E8EB] flex items-center justify-between text-xs">
                  <span className="text-[#88909E] truncate max-w-[150px]">{event.venue}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegisterEvent(event);
                    }}
                    className="px-3 py-1 bg-[#111418] text-white rounded-lg text-xs font-semibold hover:bg-[#1D4ED8]"
                  >
                    Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
