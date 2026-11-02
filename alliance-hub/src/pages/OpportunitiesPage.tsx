import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Bookmark, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal, 
  X, 
  ChevronRight, 
  Eye, 
  Building2, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Award 
} from 'lucide-react';
import { Opportunity, OpportunityCategory, Student } from '../types';
import { ALL_SKILLS_LIST } from '../data/mockData';
import { storageService, calculateOpportunityMatch } from '../services/storageService';
import { useToast } from '../components/ui/ToastContext';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { OpportunityDrawer } from '../components/opportunities/OpportunityDrawer';

interface OpportunitiesPageProps {
  opportunities: Opportunity[];
  student: Student;
  onSelectOpportunity: (opp: Opportunity) => void;
  onOpenApply: (opp: Opportunity) => void;
  onExplainMatch: (opp: Opportunity) => void;
  initialCategory?: string;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({
  opportunities,
  student,
  onSelectOpportunity,
  onOpenApply,
  onExplainMatch,
  initialCategory
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | '7-days' | '14-days' | '30-days'>('all');
  const [eligibleOnly, setEligibleOnly] = useState<boolean>(false);
  const [minMatch, setMinMatch] = useState<number>(0);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'applicants'>('match');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Slide-over drawer state
  const [drawerOpp, setDrawerOpp] = useState<Opportunity | null>(null);

  const categories = [
    'All',
    'Hackathons',
    'Internships',
    'Research',
    'Entrepreneurship',
    'Workshops',
    'Technical Competitions',
    'Certifications',
    'University Events'
  ];

  const departments = [
    'All',
    'Cross-Disciplinary',
    'Alliance College of Engineering & Design',
    'Department of Computer Science & Engineering',
    'Alliance School of Business',
    'Alliance School of Law',
    'School of Liberal Arts'
  ];

  const handleToggleSave = (oppId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = storageService.toggleSaveOpportunity(oppId);
    showToast(
      isSaved ? 'Opportunity Saved' : 'Removed from Saved',
      isSaved ? `"${title}" saved to your workspace.` : 'Removed from saved opportunities.',
      'info'
    );
  };

  const now = new Date('2026-11-01');

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(opp => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = opp.title.toLowerCase().includes(q);
          const matchOrg = opp.organizer.toLowerCase().includes(q);
          const matchDesc = opp.description.toLowerCase().includes(q);
          const matchSkills = opp.requiredSkills.some(s => s.toLowerCase().includes(q));
          if (!matchTitle && !matchOrg && !matchDesc && !matchSkills) return false;
        }

        // Category
        if (selectedCategory !== 'All' && opp.category !== selectedCategory) {
          return false;
        }

        // Mode
        if (selectedMode !== 'All' && opp.mode !== selectedMode) {
          return false;
        }

        // Specific Skill filter
        if (selectedSkill !== 'All') {
          const hasSkill = opp.requiredSkills.some(s => s.toLowerCase() === selectedSkill.toLowerCase());
          if (!hasSkill) return false;
        }

        // Department filter
        if (selectedDepartment !== 'All') {
          if (!opp.department.toLowerCase().includes(selectedDepartment.toLowerCase()) && 
              selectedDepartment !== opp.department) {
            return false;
          }
        }

        // Deadline filter
        if (deadlineFilter !== 'all') {
          const oppDate = new Date(opp.deadline).getTime();
          const diffDays = (oppDate - now.getTime()) / (1000 * 60 * 60 * 24);
          if (deadlineFilter === '7-days' && (diffDays < 0 || diffDays > 7)) return false;
          if (deadlineFilter === '14-days' && (diffDays < 0 || diffDays > 14)) return false;
          if (deadlineFilter === '30-days' && (diffDays < 0 || diffDays > 30)) return false;
        }

        // Saved only
        if (showSavedOnly && !storageService.isOpportunitySaved(opp.id)) {
          return false;
        }

        // Eligibility audit & Min Match
        const match = calculateOpportunityMatch(student, opp);
        if (eligibleOnly && !match.eligibilityMet) {
          return false;
        }
        if (match.score < minMatch) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          const matchA = calculateOpportunityMatch(student, a).score;
          const matchB = calculateOpportunityMatch(student, b).score;
          return matchB - matchA;
        }
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'applicants') {
          return (b.totalApplicants || 0) - (a.totalApplicants || 0);
        }
        return 0;
      });
  }, [
    opportunities, 
    searchQuery, 
    selectedCategory, 
    selectedMode, 
    selectedSkill, 
    selectedDepartment, 
    deadlineFilter, 
    eligibleOnly, 
    showSavedOnly, 
    minMatch, 
    sortBy, 
    student
  ]);

  // Featured opportunity for editorial spotlight fold
  const featuredOpportunity = opportunities.find(o => o.featured) || opportunities[0];
  const featuredMatch = featuredOpportunity ? calculateOpportunityMatch(student, featuredOpportunity) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Introduction Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6E8EB]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alliance University Centralized Opportunity Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111418] mt-1">
            Discover Campus Opportunities
          </h1>
          <p className="text-sm text-[#575F6E] mt-1">
            Filter through verified hackathons, research labs, venture studio grants, and industry internships across all Alliance schools.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#88909E] font-mono">
            Showing <strong className="text-[#111418]">{filteredOpportunities.length}</strong> listings
          </span>
        </div>
      </div>

      {/* FEATURED EDITORIAL OPPORTUNITY BANNER */}
      {featuredOpportunity && (
        <div className="bg-white border border-[#E6E8EB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1D4ED8] via-[#3B82F6] to-[#111418]" />
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#1D4ED8] uppercase tracking-wider font-mono">
                  Editor's Campus Spotlight
                </span>
                <span className="text-[#88909E]">·</span>
                <span className="font-semibold text-[#111418]">{featuredOpportunity.category}</span>
                <span className="text-[#88909E]">·</span>
                <span className="text-[#575F6E]">{featuredOpportunity.mode}</span>
                <span className="text-[#88909E]">·</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Accredited by CII
                </span>
              </div>

              <h2 
                onClick={() => onSelectOpportunity(featuredOpportunity)}
                className="text-2xl sm:text-3xl font-extrabold text-[#111418] hover:text-[#1D4ED8] transition-colors cursor-pointer leading-tight"
              >
                {featuredOpportunity.title}
              </h2>

              <p className="text-xs text-[#575F6E] leading-relaxed">
                {featuredOpportunity.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-[#575F6E]">
                <div>Organizer: <strong className="text-[#111418]">{featuredOpportunity.organizer}</strong></div>
                <div>Deadline: <strong className="text-[#111418] font-mono">{featuredOpportunity.deadline}</strong></div>
                <div>Prize: <strong className="text-emerald-700 font-mono font-bold">{featuredOpportunity.stipendOrPrize}</strong></div>
              </div>
            </div>

            {/* Match CTA Capsule */}
            <div className="lg:w-64 bg-[#FBFBFA] border border-[#E6E8EB] rounded-2xl p-4 flex flex-col justify-between shrink-0 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#88909E]">Your Compatibility</span>
                  <span className="font-mono font-bold text-lg text-[#1D4ED8]">{featuredMatch?.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E6E8EB] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1D4ED8] rounded-full"
                    style={{ width: `${featuredMatch?.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#575F6E] mt-2 line-clamp-2">
                  {featuredMatch?.explanation}
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => onOpenApply(featuredOpportunity)}
                  className="w-full py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors shadow-xs"
                >
                  Quick Apply
                </button>
                <button
                  onClick={() => onExplainMatch(featuredOpportunity)}
                  className="w-full py-1.5 text-[11px] font-semibold text-[#1D4ED8] hover:underline"
                >
                  Why does this match?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH AND MULTI-DIMENSIONAL FILTER CONTROLS */}
      <div className="space-y-3 bg-white border border-[#E6E8EB] rounded-2xl p-5 shadow-xs">
        
        {/* Row 1: Keyword Search + Sort + View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#88909E]" />
            <input
              type="text"
              placeholder="Search by title, skill (e.g. PyTorch, React, ROS2, Docker), or organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88909E] hover:text-[#111418]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-medium bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            >
              <option value="match">Sort: Best Compatibility</option>
              <option value="deadline">Sort: Deadline (Earliest)</option>
              <option value="applicants">Sort: Most Applicants</option>
            </select>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                showAdvancedFilters || selectedSkill !== 'All' || selectedDepartment !== 'All' || deadlineFilter !== 'all' || eligibleOnly
                  ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]'
                  : 'border-[#D1D5DB] bg-white text-[#575F6E] hover:text-[#111418]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-white border border-[#D1D5DB] rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#F4F4F1] text-[#111418]' : 'text-[#88909E] hover:text-[#111418]'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#F4F4F1] text-[#111418]' : 'text-[#88909E] hover:text-[#111418]'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Segmented Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar pt-1">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-[#111418] text-white shadow-xs'
                    : 'bg-[#FBFBFA] border border-[#E6E8EB] text-[#575F6E] hover:text-[#111418] hover:border-[#D1D5DB]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Row 3: Advanced Collapsible Filter Drawer */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-[#E6E8EB] grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#88909E] uppercase tracking-wider mb-1">
                Filter by Required Skill
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#D1D5DB] rounded-lg bg-white"
              >
                <option value="All">All Technical Skills</option>
                {ALL_SKILLS_LIST.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#88909E] uppercase tracking-wider mb-1">
                University Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#D1D5DB] rounded-lg bg-white truncate"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#88909E] uppercase tracking-wider mb-1">
                Deadline Urgency
              </label>
              <select
                value={deadlineFilter}
                onChange={(e) => setDeadlineFilter(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-[#D1D5DB] rounded-lg bg-white"
              >
                <option value="all">Any Registration Date</option>
                <option value="7-days">Next 7 Days (Urgent)</option>
                <option value="14-days">Next 14 Days</option>
                <option value="30-days">Next 30 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#88909E] uppercase tracking-wider mb-1">
                Delivery Format
              </label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#D1D5DB] rounded-lg bg-white"
              >
                <option value="All">All Formats</option>
                <option value="In-Person">In-Person Only</option>
                <option value="Hybrid">Hybrid Format</option>
                <option value="Virtual">Virtual / Remote</option>
              </select>
            </div>
          </div>
        )}

        {/* Row 4: Quick Toggles (Eligible Only, Saved Only, Min Match) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E6E8EB] text-xs text-[#575F6E]">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(e) => setEligibleOnly(e.target.checked)}
                className="rounded border-[#D1D5DB] text-[#1D4ED8]"
              />
              <span className="font-medium text-[#111418]">Only show eligible for my degree/year</span>
            </label>

            <span className="text-[#E6E8EB]">|</span>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSavedOnly}
                onChange={(e) => setShowSavedOnly(e.target.checked)}
                className="rounded border-[#D1D5DB] text-[#1D4ED8]"
              />
              <span>Saved opportunities only</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#88909E]">Min Synergy:</span>
            {[0, 50, 75, 90].map(score => (
              <button
                key={score}
                onClick={() => setMinMatch(score)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  minMatch === score ? 'bg-[#111418] text-white font-medium' : 'text-[#575F6E] hover:text-[#111418]'
                }`}
              >
                {score === 0 ? 'All' : `${score}%+`}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Empty State */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-white border border-[#E6E8EB] rounded-2xl p-12 text-center space-y-3">
          <SlidersHorizontal className="w-8 h-8 text-[#88909E] mx-auto" />
          <h3 className="text-base font-bold text-[#111418]">No opportunities match your filter combination</h3>
          <p className="text-xs text-[#575F6E] max-w-sm mx-auto">
            Try resetting your department or required skill filter, or lowering the minimum compatibility threshold.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedMode('All');
              setSelectedSkill('All');
              setSelectedDepartment('All');
              setDeadlineFilter('all');
              setEligibleOnly(false);
              setMinMatch(0);
              setShowSavedOnly(false);
            }}
            className="mt-2 px-4 py-2 text-xs font-semibold text-[#111418] bg-[#F4F4F1] hover:bg-[#E6E8EB] rounded-lg"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Polymorphic Grid with interactive match buttons */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              student={student}
              onSelect={onSelectOpportunity}
              onQuickApply={onOpenApply}
              onToggleSave={handleToggleSave}
              onExplainMatch={onExplainMatch}
              isSaved={storageService.isOpportunitySaved(opp.id)}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-[#E6E8EB] rounded-2xl divide-y divide-[#E6E8EB] overflow-hidden shadow-xs">
          {filteredOpportunities.map(opp => {
            const match = calculateOpportunityMatch(student, opp);
            const isSaved = storageService.isOpportunitySaved(opp.id);

            return (
              <div
                key={opp.id}
                onClick={() => onSelectOpportunity(opp)}
                className="p-4 hover:bg-[#FBFBFA] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#575F6E]">
                    <span className="font-semibold text-[#111418]">{opp.category}</span>
                    <span>·</span>
                    <span>{opp.organizer}</span>
                    <span>·</span>
                    <span>{opp.mode}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors truncate">
                    {opp.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 text-[11px] text-[#575F6E] pt-0.5">
                    <span className="text-[#88909E]">Required Skills:</span>
                    {opp.requiredSkills.slice(0, 4).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0 text-xs">
                  <div className="text-right hidden md:block">
                    <span className="text-[#88909E] block text-[10px]">Reward</span>
                    <span className="font-medium text-[#111418]">{opp.stipendOrPrize || 'Standard'}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[#88909E] block text-[10px]">Deadline</span>
                    <span className="font-mono font-semibold text-[#111418]">{opp.deadline}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExplainMatch(opp);
                    }}
                    className="text-right hover:opacity-80 transition-opacity"
                    title="Inspect match & eligibility breakdown"
                  >
                    <span className="text-[#88909E] block text-[10px]">Synergy</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      match.eligibilityMet ? 'text-[#1D4ED8] bg-blue-50' : 'text-rose-700 bg-rose-50'
                    }`}>
                      {match.score}% {match.eligibilityMet ? '' : '!'}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDrawerOpp(opp);
                    }}
                    className="p-1.5 text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1] rounded-lg transition-colors"
                    title="Quick inspect drawer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleToggleSave(opp.id, opp.title, e)}
                    className="p-1.5 text-[#88909E] hover:text-[#111418]"
                    title={isSaved ? 'Saved' : 'Save'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#1D4ED8] text-[#1D4ED8]' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over Opportunity Inspection Drawer */}
      <OpportunityDrawer
        opportunity={drawerOpp}
        student={student}
        isOpen={drawerOpp !== null}
        onClose={() => setDrawerOpp(null)}
        onOpenApply={(opp) => {
          setDrawerOpp(null);
          onOpenApply(opp);
        }}
        onFullDetails={(opp) => {
          setDrawerOpp(null);
          onSelectOpportunity(opp);
        }}
        onToggleSave={handleToggleSave}
      />

    </div>
  );
};
