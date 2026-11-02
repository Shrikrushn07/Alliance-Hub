import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  Users, 
  Trophy,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusFestival, CampusEvent, EventCategory, EventVerificationStatus } from '../../types';
import { storageService } from '../../services/storageService';
import { apiService } from '../../services/apiService';
import { useToast } from '../ui/ToastContext';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  festivals: CampusFestival[];
  onSuccess: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  festivals,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [creationType, setCreationType] = useState<'festival' | 'event'>('event');

  // Festival Form State
  const [festTitle, setFestTitle] = useState('');
  const [festTagline, setFestTagline] = useState('');
  const [festTheme, setFestTheme] = useState('');
  const [festDescription, setFestDescription] = useState('');
  const [festStartDate, setFestStartDate] = useState('2026-04-16');
  const [festEndDate, setFestEndDate] = useState('2026-04-18');
  const [festVenue, setFestVenue] = useState('Central Amphitheatre & Sports Arena');
  const [festOrganizer, setFestOrganizer] = useState('Alliance Cultural Committee');
  const [festClubs, setFestClubs] = useState('Rotaract, IEEE Student Branch, Music Society');

  // Event / Sub-Event Form State
  const [evtTitle, setEvtTitle] = useState('');
  const [evtCategory, setEvtCategory] = useState<EventCategory>('Cultural');
  const [associatedFestivalId, setAssociatedFestivalId] = useState<string>('');
  const [evtDescription, setEvtDescription] = useState('');
  const [evtStartDatetime, setEvtStartDatetime] = useState('2026-04-17T18:00');
  const [evtEndDatetime, setEvtEndDatetime] = useState('2026-04-17T21:00');
  const [evtVenue, setEvtVenue] = useState('Central Amphitheatre Stage');
  const [evtEligibility, setEvtEligibility] = useState('Open to all Alliance University students');
  const [evtOrganizer, setEvtOrganizer] = useState('Alliance Cultural Committee');
  const [evtPrizePool, setEvtPrizePool] = useState('₹50,000 + Trophies');
  const [evtSpots, setEvtSpots] = useState<number>(30);
  const [evtRegType, setEvtRegType] = useState<'in-app' | 'external'>('in-app');
  const [evtRegUrl, setEvtRegUrl] = useState('');
  const [evtDeadline, setEvtDeadline] = useState('2026-04-12');
  const [evtTags, setEvtTags] = useState('Stage, Competition, Cash Prize');

  if (!isOpen) return null;

  const handleCreateFestival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!festTitle.trim()) return;

    const slug = festTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newFestival: CampusFestival = {
      id: `fest-${Date.now()}`,
      title: festTitle.trim(),
      slug,
      tagline: festTagline.trim() || 'Annual University Celebration',
      theme: festTheme.trim() || undefined,
      description: festDescription.trim(),
      heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
      organizer: festOrganizer.trim(),
      organizerDepartment: 'Office of Campus Life',
      startDate: festStartDate,
      endDate: festEndDate,
      venue: festVenue.trim(),
      verificationStatus: 'Pending Verification',
      publicationStatus: 'Published',
      featured: false,
      participatingClubs: festClubs.split(',').map(s => s.trim()).filter(Boolean),
      announcements: []
    };

    storageService.addFestival(newFestival);
    apiService.createFestival(newFestival).catch(err => console.warn('Backend festival sync:', err));
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
    showToast('Festival Created', `"${newFestival.title}" published for review.`, 'success');
    onSuccess();
    onClose();
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim()) return;

    const parentFest = festivals.find(f => f.id === associatedFestivalId);

    const newEvent: CampusEvent = {
      id: `evt-${Date.now()}`,
      festivalId: parentFest ? parentFest.id : undefined,
      festivalTitle: parentFest ? parentFest.title : undefined,
      title: evtTitle.trim(),
      category: evtCategory,
      description: evtDescription.trim(),
      startDatetime: evtStartDatetime,
      endDatetime: evtEndDatetime,
      venue: evtVenue.trim(),
      eligibility: evtEligibility.trim(),
      organizer: evtOrganizer.trim(),
      verificationStatus: 'Pending Verification',
      publicationStatus: 'Published',
      registrationType: evtRegType,
      registrationUrl: evtRegType === 'external' ? evtRegUrl.trim() : undefined,
      registrationDeadline: evtDeadline,
      prizePool: evtPrizePool.trim() || undefined,
      openSpots: evtSpots,
      totalRegistrations: 0,
      tags: evtTags.split(',').map(s => s.trim()).filter(Boolean)
    };

    storageService.addEvent(newEvent);
    apiService.createEvent(newEvent).catch(err => console.warn('Backend event sync:', err));
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.7 }
    });
    showToast(
      'Campus Event Created',
      `"${newEvent.title}" published ${parentFest ? `under ${parentFest.title}` : 'as standalone event'}.`,
      'success'
    );
    onSuccess();
    onClose();
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
              <span>Campus Festival & Event Studio</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Host a University Festival or Competition
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle Selector */}
        <div className="p-4 bg-[#F4F4F1] border-b border-[#E6E8EB] flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCreationType('event')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              creationType === 'event'
                ? 'bg-[#111418] text-white shadow-xs'
                : 'text-[#575F6E] hover:text-[#111418]'
            }`}
          >
            Campus Event / Sub-Event
          </button>
          <button
            type="button"
            onClick={() => setCreationType('festival')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              creationType === 'festival'
                ? 'bg-[#111418] text-white shadow-xs'
                : 'text-[#575F6E] hover:text-[#111418]'
            }`}
          >
            Major Campus Festival (Parent)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[550px] overflow-y-auto">
          
          {creationType === 'event' ? (
            /* EVENT FORM */
            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              
              {/* Parent Festival Selector (Crucial Parent-Child Relationship) */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
                <label className="font-semibold text-[#111418] block">
                  Parent Festival Association (Optional)
                </label>
                <select
                  value={associatedFestivalId}
                  onChange={(e) => setAssociatedFestivalId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-xl text-xs"
                >
                  <option value="">Standalone University Event (No Parent Festival)</option>
                  {festivals.map(fest => (
                    <option key={fest.id} value={fest.id}>
                      Part of: {fest.title} ({fest.startDate})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#575F6E]">
                  If selected, this event will be grouped directly inside that festival's dedicated page and schedule.
                </span>
              </div>

              <div>
                <label className="font-semibold text-[#111418] block mb-1">Event / Competition Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Hack-a-Sprint / Battle of the Bands"
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Category *</label>
                  <select
                    value={evtCategory}
                    onChange={(e) => setEvtCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl bg-white"
                  >
                    <option value="Cultural">Cultural</option>
                    <option value="Technical">Technical</option>
                    <option value="Sports">Sports</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Workshop & Masterclass">Workshop & Masterclass</option>
                    <option value="Department Fest">Department Fest</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Organizing Entity *</label>
                  <input
                    type="text"
                    placeholder="e.g. Alliance Robotics Guild"
                    value={evtOrganizer}
                    onChange={(e) => setEvtOrganizer(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#111418] block mb-1">Description & Format *</label>
                <textarea
                  rows={2}
                  placeholder="Format, rounds, judging criteria, and participant expectations..."
                  value={evtDescription}
                  onChange={(e) => setEvtDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={evtStartDatetime}
                    onChange={(e) => setEvtStartDatetime(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#111418] block mb-1">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={evtEndDatetime}
                    onChange={(e) => setEvtEndDatetime(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Campus Venue *</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Amphitheatre / Sports Ground"
                    value={evtVenue}
                    onChange={(e) => setEvtVenue(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Prize Pool / Awards</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,00,000 + Medals"
                    value={evtPrizePool}
                    onChange={(e) => setEvtPrizePool(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                  />
                </div>
              </div>

              {/* Registration Flow */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Registration Mechanism</label>
                  <select
                    value={evtRegType}
                    onChange={(e) => setEvtRegType(e.target.value as 'in-app' | 'external')}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl bg-white"
                  >
                    <option value="in-app">Alliance Hub Digital Pass (In-App)</option>
                    <option value="external">External Host Portal Link</option>
                  </select>
                </div>

                {evtRegType === 'external' ? (
                  <div>
                    <label className="font-semibold text-[#111418] block mb-1">Registration Portal URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={evtRegUrl}
                      onChange={(e) => setEvtRegUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-[#111418] block mb-1">Registration Deadline</label>
                    <input
                      type="date"
                      value={evtDeadline}
                      onChange={(e) => setEvtDeadline(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E6E8EB]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-[#575F6E] hover:text-[#111418]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors"
                >
                  Publish Event for Verification
                </button>
              </div>
            </form>
          ) : (
            /* MAJOR FESTIVAL FORM */
            <form onSubmit={handleCreateFestival} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#111418] block mb-1">Festival Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alliance ONE 2026 / ALF 2026"
                  value={festTitle}
                  onChange={(e) => setFestTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#111418] block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. The Flagship Annual University Mega-Festival"
                  value={festTagline}
                  onChange={(e) => setFestTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#111418] block mb-1">Official Theme</label>
                <input
                  type="text"
                  placeholder="e.g. Nexus of Horizons: Art, Code & Kinetic Energy"
                  value={festTheme}
                  onChange={(e) => setFestTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#111418] block mb-1">Description & Scope *</label>
                <textarea
                  rows={2}
                  placeholder="Festival overview, participating schools, and historical significance..."
                  value={festDescription}
                  onChange={(e) => setFestDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Opening Date *</label>
                  <input
                    type="date"
                    value={festStartDate}
                    onChange={(e) => setFestStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Closing Date *</label>
                  <input
                    type="date"
                    value={festEndDate}
                    onChange={(e) => setFestEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Main Festival Grounds</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Amphitheatre & Sports Complex"
                    value={festVenue}
                    onChange={(e) => setFestVenue(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Organizing Body</label>
                  <input
                    type="text"
                    placeholder="e.g. Department of Student Affairs"
                    value={festOrganizer}
                    onChange={(e) => setFestOrganizer(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#111418] block mb-1">Participating Clubs (Comma-Separated)</label>
                <input
                  type="text"
                  placeholder="Rotaract, IEEE Student Branch, Music Society, E-Cell"
                  value={festClubs}
                  onChange={(e) => setFestClubs(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E6E8EB]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-[#575F6E] hover:text-[#111418]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors"
                >
                  Create Major Festival
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
