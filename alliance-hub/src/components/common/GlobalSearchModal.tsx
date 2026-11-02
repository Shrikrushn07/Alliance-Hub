import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  Briefcase, 
  Calendar, 
  Users, 
  Layers, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Command
} from 'lucide-react';
import { Opportunity, CampusEvent, CampusFestival, Student, Team } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  festivals: CampusFestival[];
  events: CampusEvent[];
  students: Student[];
  teams: Team[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onSelectEvent: (event: CampusEvent) => void;
  onSelectFestival: (festival: CampusFestival) => void;
  onSelectStudent: (student: Student) => void;
  onSelectTeam: (team: Team) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  opportunities,
  festivals,
  events,
  students,
  teams,
  onSelectOpportunity,
  onSelectEvent,
  onSelectFestival,
  onSelectStudent,
  onSelectTeam
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'opportunities' | 'events' | 'people' | 'teams'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setFilterType('all');
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const q = query.trim().toLowerCase();

  // Filtered Results
  const results = useMemo(() => {
    if (!q) {
      // Default top suggestions
      return {
        opportunities: opportunities.slice(0, 3),
        festivals: festivals.slice(0, 2),
        events: events.slice(0, 3),
        students: students.slice(1, 4),
        teams: teams.slice(0, 2)
      };
    }

    return {
      opportunities: opportunities.filter(o => 
        o.title.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        o.organizer.toLowerCase().includes(q) ||
        o.requiredSkills.some(s => s.toLowerCase().includes(q))
      ),
      festivals: festivals.filter(f => 
        f.title.toLowerCase().includes(q) ||
        f.tagline.toLowerCase().includes(q) ||
        f.organizer.toLowerCase().includes(q)
      ),
      events: events.filter(e => 
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q)
      ),
      students: students.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.skills.some(sk => sk.toLowerCase().includes(q))
      ),
      teams: teams.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.projectTitle.toLowerCase().includes(q) ||
        t.requiredSkills.some(sk => sk.toLowerCase().includes(q))
      )
    };
  }, [q, opportunities, festivals, events, students, teams]);

  if (!isOpen) return null;

  const totalResultsCount = 
    results.opportunities.length + 
    results.festivals.length + 
    results.events.length + 
    results.students.length + 
    results.teams.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E6E8EB] flex items-center gap-3 bg-[#FBFBFA]">
          <Search className="w-5 h-5 text-[#88909E] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search opportunities, campus events, squads, peers..."
            className="w-full bg-transparent text-sm text-[#111418] placeholder-[#88909E] focus:outline-none font-medium"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#88909E] hover:text-[#111418] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-[#88909E] bg-white border border-[#E6E8EB] rounded shadow-xs">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Category Chips */}
        <div className="px-4 py-2 bg-white border-b border-[#E6E8EB] flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterType === 'all' ? 'bg-[#111418] text-white' : 'text-[#575F6E] hover:bg-[#F4F4F1]'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setFilterType('opportunities')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterType === 'opportunities' ? 'bg-[#111418] text-white' : 'text-[#575F6E] hover:bg-[#F4F4F1]'
            }`}
          >
            Opportunities ({results.opportunities.length})
          </button>
          <button
            onClick={() => setFilterType('events')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterType === 'events' ? 'bg-[#111418] text-white' : 'text-[#575F6E] hover:bg-[#F4F4F1]'
            }`}
          >
            Events & Festivals ({results.festivals.length + results.events.length})
          </button>
          <button
            onClick={() => setFilterType('people')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterType === 'people' ? 'bg-[#111418] text-white' : 'text-[#575F6E] hover:bg-[#F4F4F1]'
            }`}
          >
            Peers ({results.students.length})
          </button>
          <button
            onClick={() => setFilterType('teams')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterType === 'teams' ? 'bg-[#111418] text-white' : 'text-[#575F6E] hover:bg-[#F4F4F1]'
            }`}
          >
            Squads ({results.teams.length})
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-3 space-y-4 divide-y divide-[#E6E8EB]">
          {totalResultsCount === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-[#111418]">No matches found</p>
              <p className="text-xs text-[#575F6E]">
                We couldn't find any opportunities or events matching "{query}". Try checking your spelling or using fewer keywords.
              </p>
            </div>
          ) : (
            <>
              {/* Opportunities Section */}
              {(filterType === 'all' || filterType === 'opportunities') && results.opportunities.length > 0 && (
                <div className="pt-2 first:pt-0 space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#88909E] font-semibold px-2 py-1">
                    Opportunities ({results.opportunities.length})
                  </div>
                  {results.opportunities.map(opp => (
                    <button
                      key={opp.id}
                      onClick={() => {
                        onSelectOpportunity(opp);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#FBFBFA] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0 mt-0.5">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-[#575F6E]">
                            <span>{opp.category}</span>
                            <span>·</span>
                            <span>{opp.mode}</span>
                          </div>
                          <div className="text-sm font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors truncate">
                            {opp.title}
                          </div>
                          <div className="text-xs text-[#575F6E] truncate">
                            {opp.organizer} · Deadline: {opp.deadline}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#88909E] group-hover:text-[#111418] shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* Events & Festivals Section */}
              {(filterType === 'all' || filterType === 'events') && (results.festivals.length > 0 || results.events.length > 0) && (
                <div className="pt-3 space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#88909E] font-semibold px-2 py-1">
                    Campus Festivals & Events ({results.festivals.length + results.events.length})
                  </div>
                  {results.festivals.map(fest => (
                    <button
                      key={fest.id}
                      onClick={() => {
                        onSelectFestival(fest);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#FBFBFA] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono text-amber-700 font-semibold">
                            Major University Festival
                          </div>
                          <div className="text-sm font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors truncate">
                            {fest.title}
                          </div>
                          <div className="text-xs text-[#575F6E] truncate">
                            {fest.tagline} · {fest.startDate} to {fest.endDate}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#88909E] group-hover:text-[#111418] shrink-0 ml-2" />
                    </button>
                  ))}
                  {results.events.map(evt => (
                    <button
                      key={evt.id}
                      onClick={() => {
                        onSelectEvent(evt);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#FBFBFA] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-[#575F6E]">
                            <span>{evt.category}</span>
                            <span>·</span>
                            <span>{evt.venue}</span>
                          </div>
                          <div className="text-sm font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors truncate">
                            {evt.title}
                          </div>
                          <div className="text-xs text-[#575F6E] truncate">
                            {evt.festivalTitle || 'Autonomous Event'} · {evt.startDatetime?.split('T')[0]}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#88909E] group-hover:text-[#111418] shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* People / Collaborators Section */}
              {(filterType === 'all' || filterType === 'people') && results.students.length > 0 && (
                <div className="pt-3 space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#88909E] font-semibold px-2 py-1">
                    Student Collaborators ({results.students.length})
                  </div>
                  {results.students.map(peer => (
                    <button
                      key={peer.id}
                      onClick={() => {
                        onSelectStudent(peer);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#FBFBFA] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={peer.avatar} 
                          alt={peer.name} 
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#E6E8EB]" 
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors truncate">
                            {peer.name}
                          </div>
                          <div className="text-xs text-[#575F6E] truncate">
                            {peer.department} · {peer.skills.slice(0, 3).join(', ')}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#88909E] group-hover:text-[#111418] shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* Teams Section */}
              {(filterType === 'all' || filterType === 'teams') && results.teams.length > 0 && (
                <div className="pt-3 space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#88909E] font-semibold px-2 py-1">
                    Recruiting Teams & Squads ({results.teams.length})
                  </div>
                  {results.teams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => {
                        onSelectTeam(team);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#FBFBFA] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors truncate">
                            {team.name}
                          </div>
                          <div className="text-xs text-[#575F6E] truncate">
                            {team.projectTitle} · Leader: {team.leaderName}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#88909E] group-hover:text-[#111418] shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#FBFBFA] border-t border-[#E6E8EB] flex items-center justify-between text-xs text-[#88909E]">
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-[#E6E8EB] rounded shadow-xs font-mono text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-[#E6E8EB] rounded shadow-xs font-mono text-[10px]">↓</kbd>
            <span>to navigate</span>
          </div>
          <span>Alliance Hub Realtime Catalog</span>
        </div>
      </div>
    </div>
  );
};
