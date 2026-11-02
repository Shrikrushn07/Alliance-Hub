import React from 'react';
import { X, Check, CheckCircle2, Users, Bell, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TeamInvitation } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../ui/ToastContext';

interface InvitationsInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitations: TeamInvitation[];
  onRefresh: () => void;
}

export const InvitationsInboxModal: React.FC<InvitationsInboxModalProps> = ({
  isOpen,
  onClose,
  invitations,
  onRefresh
}) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const pendingInvites = invitations.filter(i => i.status === 'Pending');
  const pastInvites = invitations.filter(i => i.status !== 'Pending');

  const handleRespond = (invitation: TeamInvitation, response: 'Accepted' | 'Declined') => {
    storageService.respondToInvitation(invitation.id, response);
    if (response === 'Accepted') {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#1D4ED8', '#059669', '#111418']
      });
      showToast(
        'Squad Invitation Accepted!',
        `You have joined "${invitation.teamName}" as ${invitation.roleName}.`,
        'success'
      );
    } else {
      showToast('Invitation Declined', `Declined invitation for ${invitation.teamName}.`, 'info');
    }
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in duration-200"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-[#E6E8EB] bg-[#FBFBFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#1D4ED8]" />
            <h3 className="text-sm font-bold text-[#111418]">
              Squad Invitations & Collaboration Requests
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#88909E] hover:text-[#111418] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs max-h-[70vh] overflow-y-auto">
          {pendingInvites.length === 0 && pastInvites.length === 0 ? (
            <div className="p-8 text-center text-[#88909E] space-y-2">
              <Users className="w-8 h-8 mx-auto text-[#D1D5DB]" />
              <p>No squad invitations at the moment.</p>
            </div>
          ) : (
            <>
              {/* Pending Invites */}
              {pendingInvites.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8] block">
                    Pending Decisions ({pendingInvites.length})
                  </span>

                  {pendingInvites.map(inv => (
                    <div 
                      key={inv.id}
                      className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-2xl space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={inv.inviterAvatar} 
                            alt={inv.inviterName} 
                            className="w-10 h-10 rounded-full object-cover border border-[#E6E8EB]" 
                          />
                          <div>
                            <div className="font-bold text-sm text-[#111418]">{inv.teamName}</div>
                            <div className="text-[11px] text-[#575F6E]">
                              Invited by <strong className="text-[#111418]">{inv.inviterName}</strong> · {inv.date}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                          {inv.roleName}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#575F6E]">
                        Project: <span className="font-semibold text-[#111418]">{inv.projectTitle}</span>
                      </div>

                      {inv.message && (
                        <div className="p-2.5 bg-white border border-[#E6E8EB] rounded-xl text-[11px] text-[#575F6E] italic">
                          "{inv.message}"
                        </div>
                      )}

                      <div className="pt-2 border-t border-[#E6E8EB] flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRespond(inv, 'Declined')}
                          className="px-3 py-1.5 font-semibold text-[#575F6E] hover:text-[#111418] rounded-lg transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleRespond(inv, 'Accepted')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg shadow-xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Join Squad</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Past Decisions */}
              {pastInvites.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E6E8EB]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#88909E] block">
                    Past Invitations
                  </span>
                  {pastInvites.map(inv => (
                    <div 
                      key={inv.id} 
                      className="p-3 bg-white border border-[#E6E8EB] rounded-xl flex items-center justify-between text-xs text-[#575F6E]"
                    >
                      <div>
                        <span className="font-bold text-[#111418]">{inv.teamName}</span>
                        <span className="text-[11px] text-[#88909E] ml-2">as {inv.roleName}</span>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        inv.status === 'Accepted' ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
