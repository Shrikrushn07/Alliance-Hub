import React from 'react';
import { 
  Bookmark, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowUpRight, 
  Zap, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Building2, 
  Award,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Opportunity, Student } from '../../types';
import { calculateOpportunityMatch, storageService } from '../../services/storageService';

interface OpportunityCardProps {
  opportunity: Opportunity;
  student: Student;
  onSelect: (opp: Opportunity) => void;
  onQuickApply: (opp: Opportunity) => void;
  onToggleSave: (oppId: string, title: string, e: React.MouseEvent) => void;
  onExplainMatch?: (opp: Opportunity) => void;
  isSaved: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  student,
  onSelect,
  onQuickApply,
  onToggleSave,
  onExplainMatch,
  isSaved
}) => {
  const match = calculateOpportunityMatch(student, opportunity);
  const category = opportunity.category;

  // Polymorphic rendering based on category
  if (category === 'Hackathons') {
    return (
      <div 
        onClick={() => onSelect(opportunity)}
        className="group relative bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden"
      >
        {/* Subtle architectural top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#111418]" />

        <div>
          {/* Header Metadata */}
          <div className="flex items-center justify-between text-xs text-[#575F6E] mb-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
              <span className="font-bold text-[#1D4ED8] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Hackathon Sprint
              </span>
              <span>·</span>
              <span className="text-[#111418] font-semibold">{opportunity.mode}</span>
            </div>

            <button
              onClick={(e) => onToggleSave(opportunity.id, opportunity.title, e)}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved ? 'text-[#1D4ED8] bg-blue-50' : 'text-[#88909E] hover:text-[#111418]'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors leading-tight">
            {opportunity.title}
          </h3>

          <div className="text-xs text-[#575F6E] mt-1 flex items-center gap-1.5">
            <span>{opportunity.organizer}</span>
            <span className="text-[#D1D5DB]">/</span>
            <span>{opportunity.department}</span>
          </div>

          <p className="text-xs text-[#575F6E] mt-3 line-clamp-2 leading-relaxed">
            {opportunity.description}
          </p>

          {/* Hackathon Specific: Prize & Team Size callout */}
          <div className="mt-4 p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-[#88909E] uppercase tracking-wider block font-medium">Prize Pool</span>
              <span className="font-bold text-[#111418] font-mono">{opportunity.stipendOrPrize}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#88909E] uppercase tracking-wider block font-medium">Sprint Time</span>
              <span className="font-semibold text-[#111418]">{opportunity.eventDate?.split('(')[0] || '36 Hours'}</span>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {opportunity.requiredSkills.map(skill => {
              const has = student.skills.some(s => s.toLowerCase() === skill.toLowerCase());
              return (
                <span
                  key={skill}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    has 
                      ? 'bg-emerald-50 text-emerald-800' 
                      : 'bg-[#F4F4F1] text-[#575F6E]'
                  }`}
                >
                  {skill} {has && '✓'}
                </span>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-[#E6E8EB] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onExplainMatch) onExplainMatch(opportunity);
            }}
            className="flex items-center gap-1.5 hover:text-[#1D4ED8] transition-colors text-left"
            title="Inspect match & eligibility breakdown"
          >
            <span className="text-[#88909E]">Compatibility:</span>
            <span className={`font-mono font-bold ${match.eligibilityMet ? 'text-[#111418]' : 'text-rose-600'}`}>
              {match.score}% {match.eligibilityMet ? '' : '(Ineligible)'}
            </span>
            <Sparkles className="w-3 h-3 text-[#1D4ED8]" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(opportunity);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-[#111418] bg-white border border-[#E6E8EB] hover:bg-[#F4F4F1] rounded-lg transition-colors"
            >
              Details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickApply(opportunity);
              }}
              className="px-3 py-1 bg-[#111418] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (category === 'Internships') {
    return (
      <div 
        onClick={() => onSelect(opportunity)}
        className="group bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs text-[#575F6E] mb-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
              <span className="font-bold text-[#111418] flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#575F6E]" />
                Industry Role
              </span>
              <span>·</span>
              <span>{opportunity.mode}</span>
            </div>

            <button
              onClick={(e) => onToggleSave(opportunity.id, opportunity.title, e)}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved ? 'text-[#1D4ED8] bg-blue-50' : 'text-[#88909E] hover:text-[#111418]'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors leading-tight">
            {opportunity.title}
          </h3>

          <div className="text-xs text-[#575F6E] mt-1 flex items-center gap-1 font-medium">
            <Building2 className="w-3.5 h-3.5 text-[#88909E]" />
            <span>{opportunity.organizer}</span>
          </div>

          <p className="text-xs text-[#575F6E] mt-3 line-clamp-2 leading-relaxed">
            {opportunity.description}
          </p>

          {/* Internship Ledger Callout */}
          <div className="mt-4 p-3 bg-[#F4F4F1] border border-[#E6E8EB] rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-[#88909E] uppercase tracking-wider block">Stipend & Terms</span>
              <span className="font-bold font-mono text-emerald-700">{opportunity.stipendOrPrize}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#88909E] uppercase tracking-wider block">Duration</span>
              <span className="font-semibold text-[#111418]">{opportunity.eventDate || 'Semester'}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {opportunity.requiredSkills.map(skill => {
              const has = student.skills.some(s => s.toLowerCase() === skill.toLowerCase());
              return (
                <span
                  key={skill}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    has ? 'bg-emerald-50 text-emerald-800' : 'bg-white border border-[#E6E8EB] text-[#575F6E]'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-[#E6E8EB] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onExplainMatch) onExplainMatch(opportunity);
            }}
            className="text-left hover:text-[#1D4ED8] transition-colors"
            title="Inspect match & eligibility breakdown"
          >
            <span className="text-[10px] text-[#88909E] block">Match Fit</span>
            <span className={`font-mono font-bold flex items-center gap-1 ${match.eligibilityMet ? 'text-[#111418]' : 'text-rose-600'}`}>
              {match.score}% {match.eligibilityMet ? 'Fit' : '(Ineligible)'}
              <Sparkles className="w-3 h-3 text-[#1D4ED8]" />
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(opportunity);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-[#111418] bg-white border border-[#E6E8EB] hover:bg-[#F4F4F1] rounded-lg transition-colors"
            >
              Details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickApply(opportunity);
              }}
              className="px-3 py-1 bg-[#111418] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (category === 'Research') {
    return (
      <div 
        onClick={() => onSelect(opportunity)}
        className="group bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs text-[#575F6E] mb-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#1D4ED8]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Research Fellowship</span>
              <span>·</span>
              <span className="text-[#575F6E]">{opportunity.mode}</span>
            </div>

            <button
              onClick={(e) => onToggleSave(opportunity.id, opportunity.title, e)}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved ? 'text-[#1D4ED8] bg-blue-50' : 'text-[#88909E] hover:text-[#111418]'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors leading-tight">
            {opportunity.title}
          </h3>

          <div className="text-xs text-[#575F6E] mt-1">
            Laboratory: <span className="text-[#111418] font-medium">{opportunity.organizer}</span>
          </div>

          <p className="text-xs text-[#575F6E] mt-3 line-clamp-2 leading-relaxed">
            {opportunity.description}
          </p>

          {/* Research Grant Strip */}
          <div className="mt-4 p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-[#88909E] uppercase tracking-wider block">Fellowship Grant</span>
              <span className="font-bold font-mono text-[#111418]">{opportunity.stipendOrPrize}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#88909E] uppercase tracking-wider block">Publication Credit</span>
              <span className="font-semibold text-[#1D4ED8]">Co-Authorship</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {opportunity.requiredSkills.map(skill => {
              const has = student.skills.some(s => s.toLowerCase() === skill.toLowerCase());
              return (
                <span
                  key={skill}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    has ? 'bg-emerald-50 text-emerald-800' : 'bg-[#F4F4F1] text-[#575F6E]'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-[#E6E8EB] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onExplainMatch) onExplainMatch(opportunity);
            }}
            className="text-left hover:text-[#1D4ED8] transition-colors"
            title="Inspect match & eligibility breakdown"
          >
            <span className="text-[10px] text-[#88909E] block">Academic Fit</span>
            <span className={`font-mono font-bold flex items-center gap-1 ${match.eligibilityMet ? 'text-[#111418]' : 'text-rose-600'}`}>
              {match.score}% {match.eligibilityMet ? '' : '(Ineligible)'}
              <Sparkles className="w-3 h-3 text-[#1D4ED8]" />
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(opportunity);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-[#111418] bg-white border border-[#E6E8EB] hover:bg-[#F4F4F1] rounded-lg transition-colors"
            >
              Details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickApply(opportunity);
              }}
              className="px-3 py-1 bg-[#111418] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Editorial Card for Workshops, Competitions, Entrepreneurship, Events
  return (
    <div 
      onClick={() => onSelect(opportunity)}
      className="group bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between text-xs text-[#575F6E] mb-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
            <span className="font-semibold text-[#111418]">{opportunity.category}</span>
            <span>·</span>
            <span>{opportunity.mode}</span>
          </div>

          <button
            onClick={(e) => onToggleSave(opportunity.id, opportunity.title, e)}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved ? 'text-[#1D4ED8] bg-blue-50' : 'text-[#88909E] hover:text-[#111418]'
            }`}
            title={isSaved ? 'Saved' : 'Save'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <h3 className="text-lg font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors leading-tight">
          {opportunity.title}
        </h3>

        <div className="text-xs text-[#575F6E] mt-1">
          {opportunity.organizer}
        </div>

        <p className="text-xs text-[#575F6E] mt-3 line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>

        {opportunity.stipendOrPrize && (
          <div className="mt-4 p-2.5 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl text-xs flex items-center justify-between">
            <span className="text-[#88909E] text-[11px]">Reward / Grant</span>
            <span className="font-mono font-bold text-[#111418]">{opportunity.stipendOrPrize}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {opportunity.requiredSkills.map(skill => {
            const has = student.skills.some(s => s.toLowerCase() === skill.toLowerCase());
            return (
              <span
                key={skill}
                className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  has ? 'bg-emerald-50 text-emerald-800' : 'bg-[#F4F4F1] text-[#575F6E]'
                }`}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#E6E8EB] flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onExplainMatch) onExplainMatch(opportunity);
          }}
          className="text-left hover:text-[#1D4ED8] transition-colors"
          title="Inspect match & eligibility breakdown"
        >
          <span className="text-[10px] text-[#88909E] block">Compatibility</span>
          <span className={`font-mono font-bold flex items-center gap-1 ${match.eligibilityMet ? 'text-[#111418]' : 'text-rose-600'}`}>
            {match.score}% {match.eligibilityMet ? 'Fit' : '(Ineligible)'}
            <Sparkles className="w-3 h-3 text-[#1D4ED8]" />
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(opportunity);
            }}
            className="px-2.5 py-1 text-xs font-semibold text-[#111418] bg-white border border-[#E6E8EB] hover:bg-[#F4F4F1] rounded-lg transition-colors"
          >
            Details
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickApply(opportunity);
            }}
            className="px-3 py-1 bg-[#111418] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};
