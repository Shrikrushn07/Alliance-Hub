import React, { useState } from 'react';
import { X, Send, Users, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, Team } from '../../types';
import { storageService, calculateTeammateCompatibility } from '../../services/storageService';
import { useToast } from '../ui/ToastContext';

interface InviteToTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent: Student | null;
  currentStudent: Student;
  teams: Team[];
  onSuccess: () => void;
}

export const InviteToTeamModal: React.FC<InviteToTeamModalProps> = ({
  isOpen,
  onClose,
  targetStudent,
  currentStudent,
  teams,
  onSuccess
}) => {
  const { showToast } = useToast();

  // User's lead teams
  const userLedTeams = teams.filter(t => t.leaderId === currentStudent.id);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(userLedTeams[0]?.id || teams[0]?.id || '');
  const [roleName, setRoleName] = useState('Frontend & Systems Specialist');
  const [message, setMessage] = useState('');

  if (!isOpen || !targetStudent) return null;

  const compat = calculateTeammateCompatibility(currentStudent, targetStudent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const team = teams.find(t => t.id === selectedTeamId) || teams[0];
    if (!team) return;

    storageService.sendInvitation({
      teamId: team.id,
      teamName: team.name,
      projectTitle: team.projectTitle,
      inviterId: currentStudent.id,
      inviterName: currentStudent.name,
      inviterAvatar: currentStudent.avatar,
      inviteeId: targetStudent.id,
      roleName: roleName.trim() || 'Collaborator',
      message: message.trim() || `Hey ${targetStudent.name.split(' ')[0]}! We'd love to have you collaborate with us on ${team.name}.`
    });

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#1D4ED8', '#111418']
    });

    showToast(
      'Invitation Dispatched',
      `Sent formal team invitation to ${targetStudent.name} for "${team.name}".`,
      'success'
    );
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in duration-200"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-[#E6E8EB] bg-[#FBFBFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1D4ED8]" />
            <h3 className="text-sm font-bold text-[#111418]">
              Invite to Project Squad
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#88909E] hover:text-[#111418] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Student Header */}
          <div className="flex items-center gap-3 p-3 bg-[#F4F4F1] rounded-xl border border-[#E6E8EB]">
            <img 
              src={targetStudent.avatar} 
              alt={targetStudent.name} 
              className="w-10 h-10 rounded-full object-cover border border-[#E6E8EB]" 
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[#111418] truncate">{targetStudent.name}</div>
              <div className="text-[11px] text-[#575F6E] truncate">
                {targetStudent.department} · {compat.score}% Synergy
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#111418] uppercase tracking-wider mb-1">
              Select Your Team / Project *
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#111418] uppercase tracking-wider mb-1">
              Designated Role Title *
            </label>
            <input
              type="text"
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Lead Frontend Architect, ML Inference Specialist"
              className="w-full px-3 py-2 text-xs bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#111418] uppercase tracking-wider mb-1">
              Personalized Invitation Note
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hey ${targetStudent.name.split(' ')[0]}, your background in ${targetStudent.skills.slice(0, 2).join(' and ')} would be a tremendous asset for our upcoming submission...`}
              className="w-full px-3 py-2 text-xs bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            />
          </div>

          <div className="pt-2 border-t border-[#E6E8EB] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 font-semibold text-[#575F6E] hover:text-[#111418]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
