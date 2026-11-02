import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Bookmark, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles, 
  Users, 
  Layers, 
  Target, 
  TrendingUp,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Zap,
  Building2,
  Award,
  Bell,
  Search,
  Check,
  UserCheck,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Opportunity, Student, Team, Application, CampusFestival, CampusEvent } from '../types';
import { 
  calculateOpportunityMatch, 
  calculateTeammateCompatibility, 
  storageService 
} from '../services/storageService';
import { useToast } from '../components/ui/ToastContext';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { SkillSimulator } from '../components/dashboard/SkillSimulator';
import { DeadlinesTimeline } from '../components/dashboard/DeadlinesTimeline';

interface DashboardPageProps {
  student: Student;
  opportunities: Opportunity[];
  teams: Team[];
  applications: Application[];
  allStudents: Student[];
  events?: CampusEvent[];
  festivals?: CampusFestival[];
  onNavigate: (tab: string, opportunityId?: string) => void;
  onOpenApply: (opp: Opportunity) => void;
  onSelectStudent: (student: Student) => void;
  onOpenCreateTeam: () => void;
  onExplainMatch?: (opp: Opportunity) => void;
  onSelectEvent?: (event: CampusEvent) => void;
  onSelectFestival?: (fest: CampusFestival) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  student,
  opportunities,
  teams,
  applications,
  allStudents,
  events = [],
  festivals = [],
  onNavigate,
  onOpenApply,
  onSelectStudent,
  onOpenCreateTeam,
  onExplainMatch,
  onSelectEvent,
  onSelectFestival
}) => {
  const { showToast } = useToast();

  const [dashboardSearch, setDashboardSearch] = useState('');

  // 1. Calculate Profile Completion Score & Missing Checklist Items
  const profileAudit = useMemo(() => {
    const items = [
      { id: 'avatar', label: 'Profile Portrait', complete: Boolean(student.avatar), weight: 15 },
      { id: 'bio', label: 'Academic Bio & Degree', complete: Boolean(student.bio && student.degree), weight: 15 },
      { id: 'skills', label: 'Technical & Domain Skills (≥ 4)', complete: student.skills?.length >= 4, weight: 20 },
      { id: 'interests', label: 'Areas of Interest (≥ 2)', complete: student.interests?.length >= 2, weight: 15 },
      { id: 'github', label: 'GitHub / Code Repository', complete: Boolean(student.githubUrl), weight: 10 },
      { id: 'projects', label: 'Showcase Projects (≥ 1)', complete: (student.projects?.length || 0) >= 1, weight: 15 },
      { id: 'portfolio', label: 'Verified Portfolio URL', complete: Boolean(student.portfolioUrl), weight: 10 }
    ];

    const completedWeight = items
      .filter(i => i.complete)
      .reduce((sum, i) => sum + i.weight, 0);

    const missingItems = items.filter(i => !i.complete);

    return {
      score: completedWeight,
      isFullyComplete: completedWeight === 100,
      missingItems,
      nextItem: missingItems[0]
    };
  }, [student]);

  // 2. Application Pipeline Breakdown
  const pipeline = useMemo(() => {
    const applied = applications.filter(a => a.status === 'Applied');
    const shortlisted = applications.filter(a => a.status === 'Shortlisted');
    const interview = applications.filter(a => a.status === 'Selected' || (a.history && a.history.some(h => h.note?.toLowerCase().includes('interview'))));
    const rejected = applications.filter(a => a.status === 'Rejected');

    return {
      appliedCount: applied.length,
      shortlistedCount: shortlisted.length,
      interviewCount: Math.max(interview.length, shortlisted.length > 0 ? 1 : 0),
      rejectedCount: rejected.length,
      totalCount: applications.length
    };
  }, [applications]);

  // 3. Ranked opportunities based on student's verified skills
  const matchedOpportunities = useMemo(() => {
    return [...opportunities]
      .map(opp => ({
        opp,
        match: calculateOpportunityMatch(student, opp)
      }))
      .sort((a, b) => b.match.score - a.match.score);
  }, [opportunities, student]);

  const topMatch = matchedOpportunities[0];
  const secondaryMatches = matchedOpportunities.slice(1, 4);

  // 4. Recommended Teammates with complementary synergy
  const potentialTeammates = useMemo(() => {
    return allStudents
      .filter(s => s.id !== student.id)
      .map(s => ({
        student: s,
        compat: calculateTeammateCompatibility(student, s)
      }))
      .sort((a, b) => b.compat.score - a.compat.score)
      .slice(0, 3);
  }, [allStudents, student]);

  // 5. Featured Upcoming Campus Events & Major Festivals
  const upcomingEvents = useMemo<CampusEvent[]>(() => {
    if (events && events.length > 0) return events.slice(0, 3);
    // Fallback representation if prop is empty
    return [
      {
        id: 'evt-one-hack',
        title: 'Alliance ONE: Midnight Hack-a-Sprint',
        description: 'An overnight technical buildathon challenging students across schools to produce AI, web, and hardware prototypes.',
        category: 'Technical',
        startDatetime: '2026-04-16T22:00:00',
        endDatetime: '2026-04-17T10:00:00',
        venue: 'Engineering Central Concourse',
        eligibility: 'Open to all Alliance University UG & PG students',
        registrationDeadline: '2026-04-15',
        organizer: 'ADSC & ACM Alliance',
        verificationStatus: 'Verified',
        publicationStatus: 'Published',
        registrationType: 'in-app',
        openSpots: 24,
        tags: ['Hackathon', 'Overnight', 'Cash Prize']
      },
      {
        id: 'evt-lit-fest',
        title: 'ALF: National Parliamentary Debate',
        description: 'Alliance Literature Festival flagship Asian Parliamentary debating tournament featuring institutional adjudication.',
        category: 'Cultural',
        startDatetime: '2026-04-24T10:00:00',
        endDatetime: '2026-04-24T18:00:00',
        venue: 'Alliance Moot Court Hall',
        eligibility: 'All students with university ID card',
        registrationDeadline: '2026-04-22',
        organizer: 'Debating Syndicate & School of Law',
        verificationStatus: 'Verified',
        publicationStatus: 'Published',
        registrationType: 'in-app',
        openSpots: 16,
        tags: ['Debate', 'Moot Court', 'Trophy']
      }
    ];
  }, [events]);

  const handleToggleSave = (oppId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = storageService.toggleSaveOpportunity(oppId);
    showToast(
      isSaved ? 'Opportunity Saved' : 'Removed from Saved',
      isSaved ? `"${title}" was saved to your workspace.` : 'Removed from saved opportunities.',
      'info'
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dashboardSearch.trim()) {
      onNavigate('opportunities');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. PERSONALIZED WELCOME & DISCOVERY SEARCH BANNER */}
      <section className="bg-white border border-[#E6E8EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E6E8EB]">
          
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#575F6E]">
              <span className="font-semibold text-[#111418]">{student.campus}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#1D4ED8] font-semibold">{student.year}</span>
              <span aria-hidden="true">·</span>
              <span>AY 2026–27</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111418]">
              Welcome back, {student.name.split(' ')[0]}.
            </h1>

            <p className="text-sm text-[#575F6E] leading-relaxed">
              Your profile currently matches <strong className="text-[#111418] font-semibold">{matchedOpportunities.length} campus opportunities</strong>. You have {pipeline.appliedCount} active application submissions advancing across university review committees.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('events')}
              className="px-3.5 py-2 text-xs font-semibold text-[#111418] bg-[#F4F4F1] hover:bg-[#E6E8EB] rounded-xl transition-colors"
            >
              Campus Festivals
            </button>
            <button
              onClick={onOpenCreateTeam}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors shadow-xs"
            >
              + Create Team Squad
            </button>
          </div>

        </div>

        {/* Universal Multi-Category Search Bar */}
        <div className="pt-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#88909E]" />
            <input
              type="text"
              value={dashboardSearch}
              onChange={(e) => setDashboardSearch(e.target.value)}
              placeholder="Search opportunities, events, projects, and people across Alliance University..."
              className="w-full pl-10 pr-24 py-2.5 text-xs bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#D1D5DB] focus:border-[#1D4ED8] focus:bg-white rounded-xl transition-all focus:outline-none text-[#111418] placeholder-[#88909E]"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Instant Category Jump Links */}
          <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-[#575F6E]">
            <span className="text-[11px] text-[#88909E]">Quick Jump:</span>
            <button
              onClick={() => onNavigate('opportunities')}
              className="hover:text-[#111418] hover:underline"
            >
              Hackathons ({opportunities.filter(o => o.category === 'Hackathons').length})
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('opportunities')}
              className="hover:text-[#111418] hover:underline"
            >
              Internships ({opportunities.filter(o => o.category === 'Internships').length})
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('events')}
              className="hover:text-[#111418] hover:underline"
            >
              Alliance ONE 2026
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('teams')}
              className="hover:text-[#111418] hover:underline"
            >
              Find Teammates ({teams.length} Squads)
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROFILE COMPLETION TRACKER & APPLICATION PIPELINE (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Compact Profile Completion Indicator (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6E8EB] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                  Profile Strength & Readiness
                </h3>
                <p className="text-[11px] text-[#575F6E]">
                  Accredited portfolios receive 3.2x more team invitations
                </p>
              </div>
              <span className="text-base font-extrabold font-mono text-[#1D4ED8] tabular-nums">
                {profileAudit.score}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#F4F4F1] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1D4ED8] rounded-full transition-all duration-500"
                style={{ width: `${profileAudit.score}%` }}
              />
            </div>

            {/* Checklist breakdown */}
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center justify-between text-[#575F6E]">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Technical Skills & Degree</span>
                </span>
                <span className="text-emerald-700 font-mono text-[11px]">Verified</span>
              </div>
              <div className="flex items-center justify-between text-[#575F6E]">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Projects & Research Artifacts</span>
                </span>
                <span className="text-emerald-700 font-mono text-[11px]">Verified</span>
              </div>
              {profileAudit.nextItem ? (
                <div className="flex items-center justify-between text-[#111418] font-medium pt-1">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Missing: {profileAudit.nextItem.label}</span>
                  </span>
                  <span className="font-mono text-amber-700 text-[11px]">+{profileAudit.nextItem.weight}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Portfolio 100% Complete & University Accredited</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E8EB] mt-4 flex items-center justify-between">
            <span className="text-[11px] text-[#88909E]">
              Student ID: {student.id.replace('student-', '').toUpperCase()}
            </span>
            <button
              onClick={() => onNavigate('portfolio')}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline flex items-center gap-1"
            >
              <span>Complete Your Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4-Stage Application Tracker Pipeline (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E6E8EB] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                  Application Pipeline Tracker
                </h3>
                <p className="text-[11px] text-[#575F6E]">Live status across campus review boards & corporate partners</p>
              </div>
              <button
                onClick={() => onNavigate('applications')}
                className="text-xs font-semibold text-[#1D4ED8] hover:underline"
              >
                View Tracker ({pipeline.totalCount})
              </button>
            </div>

            {/* Pipeline Stage Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              
              <div 
                onClick={() => onNavigate('applications')}
                className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl cursor-pointer transition-colors"
              >
                <div className="text-[11px] text-[#575F6E]">Stage 1</div>
                <div className="text-xs font-bold text-[#111418] mt-0.5">Applied</div>
                <div className="text-xl font-bold font-mono tabular-nums text-[#111418] mt-2">
                  {pipeline.appliedCount}
                </div>
                <div className="text-[10px] text-[#88909E] mt-0.5">Dossiers logged</div>
              </div>

              <div 
                onClick={() => onNavigate('applications')}
                className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl cursor-pointer transition-colors"
              >
                <div className="text-[11px] text-blue-700">Stage 2</div>
                <div className="text-xs font-bold text-[#111418] mt-0.5">Shortlisted</div>
                <div className="text-xl font-bold font-mono tabular-nums text-[#1D4ED8] mt-2">
                  {pipeline.shortlistedCount}
                </div>
                <div className="text-[10px] text-[#88909E] mt-0.5">Review passed</div>
              </div>

              <div 
                onClick={() => onNavigate('applications')}
                className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl cursor-pointer transition-colors"
              >
                <div className="text-[11px] text-amber-700">Stage 3</div>
                <div className="text-xs font-bold text-[#111418] mt-0.5">Interview / Test</div>
                <div className="text-xl font-bold font-mono tabular-nums text-amber-700 mt-2">
                  {pipeline.interviewCount}
                </div>
                <div className="text-[10px] text-[#88909E] mt-0.5">Assessment link</div>
              </div>

              <div 
                onClick={() => onNavigate('applications')}
                className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl cursor-pointer transition-colors"
              >
                <div className="text-[11px] text-emerald-700">Stage 4</div>
                <div className="text-xs font-bold text-[#111418] mt-0.5">Offers & Select</div>
                <div className="text-xl font-bold font-mono tabular-nums text-emerald-700 mt-2">
                  {pipeline.rejectedCount > 0 ? `${pipeline.rejectedCount} Decided` : '1 Offer'}
                </div>
                <div className="text-[10px] text-[#88909E] mt-0.5">Final status</div>
              </div>

            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#E6E8EB] flex items-center justify-between text-xs text-[#575F6E]">
            <span>Next Action: Complete Zerodha engineering concurrency assessment</span>
            <button
              onClick={() => onNavigate('applications')}
              className="text-[#1D4ED8] font-semibold hover:underline"
            >
              Open Dossier →
            </button>
          </div>
        </div>

      </div>

      {/* 3. CURATED "RECOMMENDED FOR YOU" SPOTLIGHT */}
      {topMatch && (
        <section className="bg-white border border-[#E6E8EB] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EB]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                Recommended For You (Algorithmic Synergy)
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#1D4ED8]">
              {topMatch.match.score}% Compatibility
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pt-2">
            
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#575F6E]">
                <span className="font-semibold text-[#111418]">{topMatch.opp.category}</span>
                <span aria-hidden="true">·</span>
                <span>{topMatch.opp.mode}</span>
                <span aria-hidden="true">·</span>
                <span>{topMatch.opp.organizer}</span>
              </div>

              <h3 
                onClick={() => onNavigate('opportunities', topMatch.opp.id)}
                className="text-xl sm:text-2xl font-bold text-[#111418] hover:text-[#1D4ED8] transition-colors cursor-pointer leading-tight"
              >
                {topMatch.opp.title}
              </h3>

              <p className="text-xs text-[#575F6E] leading-relaxed line-clamp-2">
                {topMatch.opp.description}
              </p>

              {/* Match rationale */}
              <div className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl text-xs space-y-1">
                <span className="font-semibold text-[#111418] block">Synergy Analysis:</span>
                <p className="text-[#575F6E] leading-relaxed">
                  {topMatch.match.explanation}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-[#575F6E]">
                  <span className="text-[#88909E]">Matched Skills:</span>
                  {topMatch.opp.requiredSkills.map(s => {
                    const has = student.skills.some(sk => sk.toLowerCase() === s.toLowerCase());
                    return (
                      <span 
                        key={s} 
                        className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                          has ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'bg-white border border-[#E6E8EB] text-[#575F6E]'
                        }`}
                      >
                        {s} {has ? '✓' : ''}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick action card */}
            <div className="lg:w-64 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl p-4 flex flex-col justify-between shrink-0 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-[#88909E]">
                  <span>Application Deadline</span>
                  <button
                    onClick={(e) => handleToggleSave(topMatch.opp.id, topMatch.opp.title, e)}
                    className="text-[#88909E] hover:text-[#111418]"
                  >
                    <Bookmark className={`w-4 h-4 ${storageService.isOpportunitySaved(topMatch.opp.id) ? 'fill-[#1D4ED8] text-[#1D4ED8]' : ''}`} />
                  </button>
                </div>
                <div className="text-sm font-bold font-mono text-[#111418]">
                  {topMatch.opp.deadline}
                </div>
                <div className="text-emerald-700 font-semibold text-xs pt-1">
                  {topMatch.opp.stipendOrPrize}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onOpenApply(topMatch.opp)}
                  className="w-full py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors shadow-2xs"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => onNavigate('opportunities', topMatch.opp.id)}
                  className="w-full py-2 text-xs font-semibold text-[#111418] bg-white border border-[#E6E8EB] hover:bg-[#F4F4F1] rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 4. UPCOMING CAMPUS EVENTS & FESTIVALS STRIP */}
      <section className="bg-white border border-[#E6E8EB] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111418] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Upcoming University Events & Major Festivals</span>
            </h2>
            <p className="text-[11px] text-[#575F6E]">Accredited cultural festivals, hackathons, and guest symposiums</p>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="text-xs font-semibold text-[#1D4ED8] hover:underline"
          >
            All Events & Passes →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map(evt => (
            <div 
              key={evt.id}
              onClick={() => {
                if (onSelectEvent) onSelectEvent(evt);
                else onNavigate('events');
              }}
              className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#575F6E]">
                  <span className="font-semibold text-[#111418]">{evt.category}</span>
                  <span className="font-mono text-emerald-700 font-semibold">Passes Available</span>
                </div>

                <h3 className="text-sm font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors line-clamp-1">
                  {evt.title}
                </h3>

                <div className="text-xs text-[#575F6E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#88909E]" />
                  <span>{evt.startDatetime ? evt.startDatetime.replace('T', ' · ') : 'Upcoming'}</span>
                </div>

                <div className="text-[11px] text-[#88909E] truncate">
                  Venue: {evt.venue}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E6E8EB] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#88909E]">
                  {evt.openSpots || 25} spots remaining
                </span>
                <span className="text-[#1D4ED8] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Get Pass <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SECONDARY OPPORTUNITIES & RECOMMENDED TEAMMATES (GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: More Matched Opportunities (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
              More Tailored Opportunities
            </h3>
            <button
              onClick={() => onNavigate('opportunities')}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline"
            >
              Browse Catalog ({opportunities.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {secondaryMatches.map(({ opp }) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                student={student}
                onSelect={(o) => onNavigate('opportunities', o.id)}
                onQuickApply={onOpenApply}
                onToggleSave={handleToggleSave}
                isSaved={storageService.isOpportunitySaved(opp.id)}
                onExplainMatch={onExplainMatch}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Complementary Teammates & Cross-Disciplinary Collaborators (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6E8EB] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                Recommended Teammates
              </h3>
              <p className="text-[11px] text-[#575F6E]">Peers who complement your technical skill stack</p>
            </div>
            <button
              onClick={() => onNavigate('teams')}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline"
            >
              Find Squads →
            </button>
          </div>

          <div className="space-y-3">
            {potentialTeammates.map(({ student: peer, compat }) => (
              <div
                key={peer.id}
                onClick={() => onSelectStudent(peer)}
                className="p-3.5 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl transition-all cursor-pointer space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={peer.avatar} 
                      alt={peer.name} 
                      className="w-8 h-8 rounded-lg object-cover border border-[#E6E8EB] shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-[#111418] truncate flex items-center gap-1">
                        <span>{peer.name}</span>
                        {peer.verifiedStudent && (
                          <CheckCircle2 className="w-3 h-3 text-[#1D4ED8] shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-[#575F6E] truncate">
                        {peer.department.replace('Alliance ', '')}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded shrink-0">
                    {compat.score}% Synergy
                  </span>
                </div>

                <p className="text-[#575F6E] text-[11px] leading-normal line-clamp-1">
                  {compat.explanation}
                </p>

                <div className="flex flex-wrap gap-1 pt-0.5">
                  {peer.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-white border border-[#E6E8EB] rounded text-[#575F6E]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('teams')}
            className="w-full py-2 text-xs font-semibold text-[#111418] bg-[#F4F4F1] hover:bg-[#E6E8EB] rounded-xl transition-colors text-center"
          >
            Launch Teammate Matchmaker Engine
          </button>
        </div>

      </div>

      {/* 6. CHRONOLOGICAL DEADLINES TIMELINE */}
      <DeadlinesTimeline
        opportunities={opportunities}
        onSelectOpp={(opp) => onNavigate('opportunities', opp.id)}
      />

      {/* 7. SKILL GAP SIMULATOR */}
      <SkillSimulator
        student={student}
        opportunities={opportunities}
        onSelectOpp={(opp) => onNavigate('opportunities', opp.id)}
      />

    </div>
  );
};
