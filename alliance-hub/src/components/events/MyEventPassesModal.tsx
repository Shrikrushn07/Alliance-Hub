import React from 'react';
import { 
  X, 
  QrCode, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  ShieldCheck, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import { EventRegistration } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../ui/ToastContext';

interface MyEventPassesModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: EventRegistration[];
  onRefresh: () => void;
}

export const MyEventPassesModal: React.FC<MyEventPassesModalProps> = ({
  isOpen,
  onClose,
  registrations,
  onRefresh
}) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const confirmedPasses = registrations.filter(r => r.registrationStatus === 'Confirmed');

  const handleCancelRegistration = (reg: EventRegistration) => {
    storageService.cancelEventRegistration(reg.id);
    showToast('Registration Cancelled', `Relinquished pass for ${reg.eventTitle}.`, 'info');
    onRefresh();
  };

  const formatEventDateTime = (datetimeStr: string) => {
    try {
      const date = new Date(datetimeStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return datetimeStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-6 bg-[#111418] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-blue-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
              <span>Campus Digital Wallet</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              My Festival & Event Passes ({confirmedPasses.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of passes */}
        <div className="p-6 space-y-4 max-h-[550px] overflow-y-auto">
          {confirmedPasses.length === 0 ? (
            <div className="p-12 text-center bg-[#FBFBFA] border border-dashed border-[#D1D5DB] rounded-2xl space-y-2">
              <QrCode className="w-10 h-10 text-[#88909E] mx-auto" />
              <h4 className="text-sm font-bold text-[#111418]">No Active Event Passes</h4>
              <p className="text-xs text-[#575F6E] max-w-sm mx-auto">
                Explore Alliance ONE, ALF, and upcoming campus competitions to claim verified student access passes.
              </p>
            </div>
          ) : (
            confirmedPasses.map(reg => (
              <div 
                key={reg.id}
                className="bg-gradient-to-r from-[#111418] via-slate-900 to-[#1D4ED8] rounded-2xl p-5 text-white shadow-md space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded text-white">
                        {reg.category}
                      </span>
                      {reg.festivalTitle && (
                        <span className="text-[10px] font-mono text-blue-200 truncate max-w-[180px]">
                          {reg.festivalTitle}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-white leading-tight">
                      {reg.eventTitle}
                    </h4>
                  </div>

                  <div className="p-1.5 bg-white rounded-lg shrink-0">
                    <QrCode className="w-8 h-8 text-[#111418]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/15 text-[11px]">
                  <div>
                    <span className="text-white/60 block text-[9px] uppercase">Ticket Code</span>
                    <span className="font-mono font-bold text-blue-200">{reg.ticketCode}</span>
                  </div>
                  <div>
                    <span className="text-white/60 block text-[9px] uppercase">Schedule</span>
                    <span className="font-mono">{formatEventDateTime(reg.startDatetime)}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-white/60 block text-[9px] uppercase">Venue</span>
                    <span className="truncate block">{reg.venue}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Access Confirmed</span>
                  </span>

                  <button
                    onClick={() => handleCancelRegistration(reg)}
                    className="text-[11px] text-white/60 hover:text-rose-300 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Relinquish Pass</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FBFBFA] border-t border-[#E6E8EB] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors"
          >
            Close Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
