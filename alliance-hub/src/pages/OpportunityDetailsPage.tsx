import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Calendar, 
  MapPin, 
  Share2, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Award, 
  BookOpen, 
  Send,
  Building2,
  Clock
} from 'lucide-react';
import { Opportunity, Student, Team } from '../types';
import { calculateOpportunityMatch, storageService } from '../services/storageService';
import { useToast } from '../components/ui/ToastContext';

interface OpportunityDetailsPageProps {
  opportunity: Opportunity;
  student: Student;
  teams: Team[];
  onBack: () => void;
  onOpenApply: (opp: Opportunity) => void;
  onNavigateToTeams: (targetOppId?: string) => void;
  onSelectSimilarOpp: (opp: Opportunity) => void;
}

export const OpportunityDetailsPage: React.FC<OpportunityDetailsPageProps> = ({
  opportunity,
  student,
  teams,
  onBack,
  onOpenApply,
  onNavigateToTeams,
  onSelectSimilarOpp
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const match = calculateOpportunityMatch(student, opportunity);
  const isSaved = storageService.isOpportunitySaved(opportunity.id);

  // Teams targeting this opportunity
  const targetingTeams = teams.filter(t => t.targetOpportunityId === opportunity.id);

  // Similar opportunities in same category or matching skills
  const allOpps = storageService.getOpportunities();
  const similarOpps = allOpps
    .filter(o => o.id !== opportunity.id && (o.category === opportunity.category || o.department === opportunity.department))
    .slice(0, 3);

  const handleToggleSave = () => {
    const isNowSaved = storageService.toggleSaveOpportunity(opportunity.id);
    showToast(
      isNowSaved ? 'Saved to Workspace' : 'Removed from Saved',
      isNowSaved ? `"${opportunity.title}" was saved.` : `Removed from saved list.`,
      'info'
    );
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('Link Copied', 'Opportunity link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top back navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#575F6E] hover:text-[#111418] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Opportunities</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 sm:p-8 relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#575F6E]">
              <span className="font-semibold text-[#111418]">{opportunity.category}</span>
              <span>·</span>
              <span>{opportunity.organizerType}</span>
              <span>·</span>
              <span>{opportunity.mode}</span>
              {opportunity.verified && (
                <>
                  <span>·</span>
                  <span className="text-[#1D4ED8] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Campus Entity
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111418] tracking-tight">
              {opportunity.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-[#575F6E]">
              <Building2 className="w-4 h-4 text-[#88909E]" />
              <span className="font-medium text-[#111418]">{opportunity.organizer}</span>
              <span>({opportunity.department})</span>
            </div>
          </div>

          {/* Action cluster */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleToggleSave}
              className={`p-2.5 rounded-xl border transition-colors ${
                isSaved 
                  ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]' 
                  : 'border-[#D1D5DB] bg-white text-[#575F6E] hover:text-[#111418]'
              }`}
              title={isSaved ? 'Saved' : 'Save opportunity'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-[#D1D5DB] bg-white text-[#575F6E] hover:text-[#111418] transition-colors"
              title="Share Opportunity"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenApply(opportunity)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply Now</span>
            </button>
          </div>

        </div>

        {/* Quick metadata strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-[#E6E8EB] text-xs">
          <div>
            <span className="text-[#88909E] block text-[11px]">Application Deadline</span>
            <span className="font-mono font-bold text-[#111418]">{opportunity.deadline}</span>
          </div>

          <div>
            <span className="text-[#88909E] block text-[11px]">Event Date / Timeline</span>
            <span className="font-semibold text-[#111418]">{opportunity.eventDate || 'Immediate Start'}</span>
          </div>

          <div>
            <span className="text-[#88909E] block text-[11px]">Prize or Compensation</span>
            <span className="font-semibold text-[#111418]">{opportunity.stipendOrPrize || 'Academic Credit'}</span>
          </div>

          <div>
            <span className="text-[#88909E] block text-[11px]">Location</span>
            <span className="font-semibold text-[#111418] truncate block">{opportunity.location}</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 columns (Content vs Skill Gap & Teammates) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details & Responsibilities (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Overview */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111418]">
              Overview & Objectives
            </h2>
            <p className="text-sm text-[#575F6E] leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>

            {opportunity.responsibilities && (
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418] mb-2">
                  Expected Contributions
                </h3>
                <ul className="space-y-2 text-xs text-[#575F6E]">
                  {opportunity.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#1D4ED8] font-bold">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Eligibility & Requirements */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111418]">
              Eligibility & Guidelines
            </h2>
            <p className="text-xs text-[#575F6E] leading-relaxed">
              {opportunity.eligibility}
            </p>
            {opportunity.externalUrl && (
              <div className="pt-2">
                <a
                  href={opportunity.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                >
                  <span>Official Event Portal / Guidelines</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Teams already forming for this opportunity */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#111418]">
                  Teams Recruiting For This Event
                </h2>
                <p className="text-xs text-[#575F6E]">
                  {targetingTeams.length} student teams currently seeking collaborators
                </p>
              </div>
              <button
                onClick={() => onNavigateToTeams(opportunity.id)}
                className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
              >
                View in Team Hub
              </button>
            </div>

            {targetingTeams.length === 0 ? (
              <div className="p-4 bg-[#F4F4F1] rounded-xl text-center text-xs text-[#575F6E]">
                No student teams registered yet. Be the first to start a squad!
              </div>
            ) : (
              <div className="space-y-3">
                {targetingTeams.map(t => (
                  <div key={t.id} className="p-3.5 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#111418]">{t.name}</span>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {t.openPositions.filter(p => p.status === 'Open').length} Open Positions
                      </span>
                    </div>
                    <p className="text-xs text-[#575F6E] line-clamp-1">{t.projectTitle}</p>
                    <div className="text-[11px] text-[#88909E]">
                      Leader: {t.leaderName} · Members: {t.members.length}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Skill Gap Analysis & Learning Roadmap (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Skill Gap Analysis Box */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418]">
                  Skill Gap Analysis
                </h3>
                <span className="text-xs text-[#575F6E]">Comparing with your verified profile</span>
              </div>
              <span className="font-mono font-bold text-lg text-[#1D4ED8]">
                {match.score}%
              </span>
            </div>

            <p className="text-xs text-[#575F6E] leading-relaxed">
              {match.explanation}
            </p>

            {/* Matched Skills */}
            <div>
              <div className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Match ({match.matchingSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {match.matchingSkills.map(skill => (
                  <span 
                    key={skill}
                    className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            {match.missingSkills.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-amber-700 mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Missing Competencies ({match.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {match.missingSkills.map(skill => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-100 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actionable Learning Resources */}
          {opportunity.learningRoadmap && opportunity.learningRoadmap.length > 0 && (
            <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E6E8EB]">
                <BookOpen className="w-4 h-4 text-[#1D4ED8]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418]">
                  Curated Learning Roadmap
                </h3>
              </div>

              <div className="space-y-3">
                {opportunity.learningRoadmap.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl transition-all group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#88909E] mb-1">
                      <span>{item.resourceType}</span>
                      <span className="font-mono">~{item.estimatedHours}h to prepare</span>
                    </div>
                    <div className="text-xs font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors">
                      {item.resourceName}
                    </div>
                    <div className="text-[11px] text-[#1D4ED8] font-medium mt-1 inline-flex items-center gap-1">
                      <span>Target: {item.skill}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Similar Opportunities */}
          {similarOpps.length > 0 && (
            <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418] pb-3 border-b border-[#E6E8EB]">
                Similar Opportunities
              </h3>
              <div className="space-y-3">
                {similarOpps.map(s => (
                  <div
                    key={s.id}
                    onClick={() => onSelectSimilarOpp(s)}
                    className="p-3 rounded-xl hover:bg-[#F4F4F1] transition-colors cursor-pointer text-xs space-y-1"
                  >
                    <div className="font-bold text-[#111418] truncate">{s.title}</div>
                    <div className="text-[#575F6E] text-[11px]">
                      {s.organizer} · {s.mode}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
