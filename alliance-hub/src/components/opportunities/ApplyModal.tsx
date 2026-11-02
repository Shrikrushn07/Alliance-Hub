import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowUpRight, Send } from 'lucide-react';
import { Opportunity, Student } from '../../types';
import { calculateOpportunityMatch, storageService } from '../../services/storageService';
import { useToast } from '../ui/ToastContext';

interface ApplyModalProps {
  opportunity: Opportunity | null;
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  opportunity,
  student,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [statement, setStatement] = useState('');
  const [portfolioLink, setPortfolioLink] = useState(student.portfolioUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !opportunity) return null;

  const match = calculateOpportunityMatch(student, opportunity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      storageService.applyToOpportunity(opportunity, statement);
      setIsSubmitting(false);
      showToast(
        'Application Submitted Successfully',
        `Your application for ${opportunity.title} was recorded in your tracker.`,
        'success'
      );
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E8EB] flex items-center justify-between bg-[#FBFBFA]">
          <div>
            <div className="text-xs text-[#575F6E] uppercase tracking-wider font-semibold">
              Apply via Alliance Hub
            </div>
            <h3 className="text-base font-bold text-[#111418] truncate max-w-md">
              {opportunity.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#88909E] hover:text-[#111418] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Match Insight summary */}
          <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E6E8EB] text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-[#111418]">Skills Alignment</span>
              <span className="font-mono font-bold text-[#1D4ED8]">{match.score}% Compatible</span>
            </div>
            <p className="text-[#575F6E] leading-relaxed mb-2">
              {match.explanation}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#E6E8EB]">
              <span className="text-[#88909E]">Verified Skills:</span>
              {match.matchingSkills.map(s => (
                <span key={s} className="font-medium text-[#111418]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
              Applicant Profile
            </label>
            <div className="flex items-center gap-3 p-3 bg-white border border-[#E6E8EB] rounded-xl">
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-10 h-10 rounded-full object-cover border border-[#E6E8EB]" 
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-[#111418] truncate">{student.name}</div>
                <div className="text-xs text-[#575F6E] truncate">
                  {student.degree} · {student.year}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="statement" className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
              Statement of Intent / Relevance
            </label>
            <textarea
              id="statement"
              rows={3}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Why are you a good fit for this role or event? Highlight your relevant projects or contributions..."
              className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent placeholder:text-[#88909E]"
            />
          </div>

          <div>
            <label htmlFor="portfolio" className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
              GitHub or Portfolio URL
            </label>
            <input
              id="portfolio"
              type="url"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E6E8EB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#575F6E] hover:text-[#111418] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-50 rounded-lg transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Confirm Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
