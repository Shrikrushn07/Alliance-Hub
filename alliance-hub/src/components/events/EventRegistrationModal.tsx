import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  Trophy, 
  QrCode, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusEvent, Student, EventRegistration } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../ui/ToastContext';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CampusEvent | null;
  student: Student;
  onSuccess: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  isOpen,
  onClose,
  event,
  student,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [createdPass, setCreatedPass] = useState<EventRegistration | null>(null);

  if (!isOpen || !event) return null;

  const isAlreadyRegistered = storageService.isRegisteredForEvent(event.id);
  const existingPass = storageService.getEventRegistrations().find(r => r.eventId === event.id && r.studentId === student.id);

  const activePass = createdPass || existingPass;

  const handleRegisterInApp = () => {
    const reg = storageService.registerForEvent(event, student);
    setCreatedPass(reg);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#1D4ED8', '#111418', '#10B981']
    });
    showToast('Digital Pass Issued', `You are confirmed for "${event.title}".`, 'success');
    onSuccess();
  };

  const handleOpenExternal = () => {
    if (event.registrationUrl) {
      window.open(event.registrationUrl, '_blank', 'noopener,noreferrer');
      showToast(
        'External Portal Opened',
        'Redirected to official host site. Please complete registration there.',
        'info'
      );
    }
  };

  const formatEventDateTime = (datetimeStr: string) => {
    try {
      const date = new Date(datetimeStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
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
        className="bg-white border border-[#E6E8EB] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in duration-200"
        role="dialog"
      >
        {/* Header Bar */}
        <div className="p-6 bg-[#111418] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-blue-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
              <span>Alliance University Event Registry</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {activePass ? 'Digital Campus Event Pass' : 'Event Registration'}
            </h3>
          </div>
          <button
            onClick={() => {
              setCreatedPass(null);
              onClose();
            }}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Active Pass Confirmed View */}
          {activePass ? (
            <div className="space-y-6">
              
              {/* Virtual Badge / Ticket Pass */}
              <div className="bg-gradient-to-br from-[#111418] via-[#1D4ED8] to-[#111418] p-6 rounded-2xl text-white shadow-lg space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 block">
                      Alliance Hub Verified Pass
                    </span>
                    <h4 className="text-lg font-extrabold text-white mt-0.5 leading-snug">
                      {event.title}
                    </h4>
                    {event.festivalTitle && (
                      <span className="text-xs text-blue-200 font-mono block mt-0.5">
                        {event.festivalTitle}
                      </span>
                    )}
                  </div>

                  <div className="p-2 bg-white rounded-xl shrink-0">
                    <QrCode className="w-10 h-10 text-[#111418]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-white/60 block">Attendee Name</span>
                    <span className="font-bold text-white">{activePass.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-white/60 block">Ticket Code</span>
                    <span className="font-mono font-bold text-blue-200">{activePass.ticketCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-white/60 block">Date & Time</span>
                    <span className="font-mono text-white/90">{formatEventDateTime(event.startDatetime)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-white/60 block">Venue</span>
                    <span className="text-white/90 truncate block">{event.venue}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-white/70 font-mono">
                  <span>Status: Confirmed</span>
                  <span>Issued: {new Date(activePass.registeredAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Present this digital pass or ticket code at the security checkpoint upon entry.</span>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setCreatedPass(null);
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>

            </div>
          ) : event.registrationType === 'external' ? (
            /* External Registration Portal View */
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>External University Host Portal</span>
                </div>
                <p className="leading-relaxed">
                  Registration for <strong>{event.title}</strong> is managed directly by <em>{event.organizer}</em> on their specialized system. Clicking the button below will open the official portal.
                </p>
                <div className="text-[11px] font-mono text-amber-800 pt-1">
                  Target Link: {event.registrationUrl}
                </div>
              </div>

              <div className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-2xl space-y-3 text-xs">
                <div className="font-bold text-[#111418]">{event.title}</div>
                <div className="text-[#575F6E] leading-relaxed">{event.description}</div>
                <div className="pt-2 border-t border-[#E6E8EB] space-y-1 font-mono text-[#575F6E]">
                  <div>Date: {formatEventDateTime(event.startDatetime)}</div>
                  <div>Venue: {event.venue}</div>
                  <div>Eligibility: {event.eligibility}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-[#575F6E] hover:text-[#111418]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl shadow-xs transition-colors"
                >
                  <span>Open Official Registration Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* In-App Registration Confirmation View */
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-[#111418]">{event.title}</h4>
                <p className="text-xs text-[#575F6E] mt-1 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Event Logistics */}
              <div className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-2xl space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-[#111418] font-mono">
                  <Clock className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                  <span className="font-semibold">{formatEventDateTime(event.startDatetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-[#575F6E]">
                  <MapPin className="w-4 h-4 text-[#88909E] shrink-0" />
                  <span>{event.venue}</span>
                </div>
                {event.prizePool && (
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold pt-1 border-t border-[#E6E8EB]">
                    <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Prize Pool: {event.prizePool}</span>
                  </div>
                )}
              </div>

              {/* Rules / Guidelines */}
              {event.rulesOrGuidelines && event.rulesOrGuidelines.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#111418]">
                    Participation Rules & Equipment:
                  </span>
                  <ul className="space-y-1 text-xs text-[#575F6E]">
                    {event.rulesOrGuidelines.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#1D4ED8]">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Student Credentials Summary */}
              <div className="p-3 bg-[#F4F4F1] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#88909E] block">Registering As:</span>
                  <span className="font-semibold text-[#111418]">{student.name}</span>
                  <span className="text-[#575F6E] block text-[11px]">{student.department} · {student.year}</span>
                </div>
                <span className="text-[11px] font-mono text-[#1D4ED8] font-semibold bg-white px-2.5 py-1 rounded-lg border border-[#E6E8EB]">
                  Verified Student
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E8EB]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-[#575F6E] hover:text-[#111418]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRegisterInApp}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl shadow-xs transition-colors"
                >
                  Confirm Registration & Get Digital Pass
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
