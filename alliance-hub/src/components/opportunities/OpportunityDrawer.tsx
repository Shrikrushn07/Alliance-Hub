import React from 'react';
import { 
  X, 
  Bookmark, 
  Send, 
  Building2, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Users,
  ArrowRight
} from 'lucide-react';
import { Opportunity, Student } from '../../types';
import { calculateOpportunityMatch, storageService } from '../../services/storageService';

interface OpportunityDrawerProps {
  opportunity: Opportunity | null;
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onOpenApply: (opp: Opportunity) => void;
  onFullDetails: (opp: Opportunity) => void;
  onToggleSave: (oppId: string, title: string, e: React.MouseEvent) => void;
}

export const OpportunityDrawer: React.FC<OpportunityDrawerProps> = ({
  opportunity,
  student,
  isOpen,
  onClose,
  onOpenApply,
  onFullDetails,
  onToggleSave
}) => {
  if (!isOpen || !opportunity) return null;

  const match = calculateOpportunityMatch(student, opportunity);
  const isSaved = storageService.isOpportunitySaved(opportunity.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
        role="dialog"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E6E8EB] bg-[#FBFBFA] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#575F6E] mb-1">
              <span className="font-semibold text-[#111418]">{opportunity.category}</span>
              <span>·</span>
              <span>{opportunity.mode}</span>
            </div>
            <h2 className="text-xl font-bold text-[#111418] leading-tight">
              {opportunity.title}
            </h2>
            <div className="text-xs text-[#575F6E] mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#88909E]" />
              <span>{opportunity.organizer}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#88909E] hover:text-[#111418] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Compatibility Breakdown Ribbon */}
          <div className="p-4 bg-[#F4F4F1] border border-[#E6E8EB] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#111418]">Skill Match Analysis</span>
              <span className="font-mono font-bold text-sm text-[#1D4ED8]">{match.score}% Compatible</span>
            </div>
            <p className="text-[#575F6E] leading-relaxed">
              {match.explanation}
            </p>

            <div className="pt-2 border-t border-[#E6E8EB] flex flex-wrap gap-1">
              <span className="text-[#88909E] mr-1">Your Skills:</span>
              {match.matchingSkills.map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium">
                  {s} ✓
                </span>
              ))}
              {match.missingSkills.map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-white border border-[#E6E8EB] text-[#575F6E] rounded">
                  {s} (Gap)
                </span>
              ))}
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl text-xs">
            <div>
              <span className="text-[#88909E] block text-[10px]">Deadline</span>
              <span className="font-mono font-bold text-[#111418]">{opportunity.deadline}</span>
            </div>
            <div>
              <span className="text-[#88909E] block text-[10px]">Prize / Stipend</span>
              <span className="font-semibold text-[#111418]">{opportunity.stipendOrPrize || 'Standard Entry'}</span>
            </div>
            <div>
              <span className="text-[#88909E] block text-[10px]">Event Date</span>
              <span className="font-semibold text-[#111418]">{opportunity.eventDate || 'Ongoing'}</span>
            </div>
            <div>
              <span className="text-[#88909E] block text-[10px]">Location</span>
              <span className="font-semibold text-[#111418] truncate block">{opportunity.location}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[#111418]">
              Overview
            </h4>
            <p className="text-[#575F6E] leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Eligibility */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[#111418]">
              Eligibility Criteria
            </h4>
            <p className="text-[#575F6E] leading-relaxed">
              {opportunity.eligibility}
            </p>
          </div>

          {/* Learning Roadmap if present */}
          {opportunity.learningRoadmap && opportunity.learningRoadmap.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-[#111418] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>Recommended Prep Lab</span>
              </h4>
              <div className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl space-y-1">
                <div className="font-semibold text-[#111418]">{opportunity.learningRoadmap[0].resourceName}</div>
                <div className="text-[#575F6E]">~{opportunity.learningRoadmap[0].estimatedHours} hours self-paced preparation</div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Actions Footer */}
        <div className="p-5 border-t border-[#E6E8EB] bg-[#FBFBFA] flex items-center justify-between gap-3">
          <button
            onClick={(e) => onToggleSave(opportunity.id, opportunity.title, e)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
              isSaved ? 'text-[#1D4ED8] border-[#1D4ED8] bg-blue-50' : 'text-[#575F6E] border-[#D1D5DB] hover:text-[#111418]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onFullDetails(opportunity)}
              className="px-3.5 py-2 text-xs font-semibold text-[#111418] bg-white border border-[#D1D5DB] hover:bg-[#F4F4F1] rounded-xl transition-colors"
            >
              Full Details
            </button>
            <button
              onClick={() => onOpenApply(opportunity)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
