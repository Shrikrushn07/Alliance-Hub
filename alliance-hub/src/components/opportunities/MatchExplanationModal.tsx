import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  Send, 
  ShieldCheck, 
  AlertTriangle,
  Users
} from 'lucide-react';
import { Opportunity, Student } from '../../types';
import { calculateOpportunityMatch } from '../../services/storageService';

interface MatchExplanationModalProps {
  opportunity: Opportunity | null;
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onApply: (opp: Opportunity) => void;
  onFindTeammates: (oppId: string) => void;
}

export const MatchExplanationModal: React.FC<MatchExplanationModalProps> = ({
  opportunity,
  student,
  isOpen,
  onClose,
  onApply,
  onFindTeammates
}) => {
  if (!isOpen || !opportunity) return null;

  const analysis = calculateOpportunityMatch(student, opportunity);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E8EB] bg-[#FBFBFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1D4ED8]" />
            <h3 className="text-sm font-bold text-[#111418]">
              Intelligent Match & Eligibility Audit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#88909E] hover:text-[#111418] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Target Opportunity Title */}
          <div>
            <span className="text-[10px] text-[#88909E] uppercase tracking-wider font-semibold block">
              Opportunity Analyzed
            </span>
            <h4 className="text-base font-bold text-[#111418]">
              {opportunity.title}
            </h4>
            <div className="text-[11px] text-[#575F6E] mt-0.5">
              {opportunity.organizer} · {opportunity.category} · {opportunity.mode}
            </div>
          </div>

          {/* Compatibility Gauge & Status */}
          <div className="p-4 bg-[#F4F4F1] border border-[#E6E8EB] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#88909E] uppercase tracking-wider font-semibold block">
                Calculated Synergy
              </span>
              <div className="text-3xl font-extrabold font-mono text-[#111418] tabular-nums mt-0.5">
                {analysis.score}%
              </div>
              <span className={`text-[11px] font-semibold mt-1 inline-flex items-center gap-1 ${
                analysis.eligibilityMet ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                {analysis.eligibilityMet ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {analysis.eligibilityMet ? 'Mandatory Eligibility Verified' : 'Ineligible for Official Entry'}
              </span>
            </div>

            {/* Visual meter ring or bar */}
            <div className="w-20 text-right">
              <span className="text-[10px] text-[#88909E] block mb-1">Threshold</span>
              <div className="w-full h-2 bg-[#E6E8EB] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    analysis.score >= 75 ? 'bg-emerald-600' : analysis.score >= 50 ? 'bg-[#1D4ED8]' : 'bg-amber-600'
                  }`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Academic Eligibility Statement */}
          <div className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
            analysis.eligibilityMet 
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="font-semibold mb-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Academic Enrollment Audit</span>
            </div>
            {analysis.eligibilityReason}
          </div>

          {/* Explanation Narrative */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#111418] uppercase tracking-wider text-[11px]">
              Why This Opportunity Matches You
            </span>
            <p className="text-[#575F6E] leading-relaxed bg-[#FBFBFA] p-3 rounded-xl border border-[#E6E8EB]">
              {analysis.explanation}
            </p>
          </div>

          {/* Breakdown of Skills */}
          <div className="space-y-3 pt-1">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 block mb-1">
                Verified Skills Present ({analysis.matchingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.matchingSkills.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-medium">
                    {s} ✓
                  </span>
                ))}
              </div>
            </div>

            {analysis.missingSkills.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-amber-800 block mb-1">
                  Missing Competencies ({analysis.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-100 rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggested Next Action */}
          <div className="p-3 bg-[#111418] text-white rounded-xl space-y-1">
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block">
              Suggested Next Step
            </span>
            <div className="font-bold text-xs">{analysis.suggestedNextAction.label}</div>
            <p className="text-[11px] text-gray-300 leading-normal">
              {analysis.suggestedNextAction.detail}
            </p>
          </div>

          {/* Footer CTAs */}
          <div className="pt-3 border-t border-[#E6E8EB] flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onFindTeammates(opportunity.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 font-semibold text-[#575F6E] hover:text-[#111418] rounded-lg transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Find Squad</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onApply(opportunity);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Proceed to Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
