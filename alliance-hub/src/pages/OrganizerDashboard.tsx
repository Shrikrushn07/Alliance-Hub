import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  TrendingUp, 
  Users, 
  Search, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  Calendar,
  Bell,
  QrCode,
  Sparkles
} from 'lucide-react';
import { Opportunity, Student, CampusFestival, CampusEvent, EventVerificationStatus } from '../types';
import { storageService } from '../services/storageService';
import { apiService } from '../services/apiService';
import { useToast } from '../components/ui/ToastContext';

interface OrganizerDashboardProps {
  opportunities: Opportunity[];
  festivals: CampusFestival[];
  events: CampusEvent[];
  allStudents: Student[];
  onOpenCreateOpportunity: () => void;
  onOpenCreateEvent: () => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  onSelectFestival: (festival: CampusFestival) => void;
  onRefresh: () => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  opportunities,
  festivals,
  events,
  allStudents,
  onOpenCreateOpportunity,
  onOpenCreateEvent,
  onSelectOpportunity,
  onSelectFestival,
  onRefresh
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'opportunities' | 'festivals-events'>('opportunities');

  // Opportunities applicant triage state
  const [selectedOppForApplicants, setSelectedOppForApplicants] = useState<Opportunity | null>(opportunities[0] || null);
  const [applicantFilter, setApplicantFilter] = useState<'All' | 'Shortlisted' | 'Selected'>('All');

  // Broadcast announcement state
  const [broadcastFestId, setBroadcastFestId] = useState<string>(festivals[0]?.id || '');
  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');
  const [showAnnForm, setShowAnnForm] = useState(false);

  // Simulated applicants for the selected opportunity
  const mockApplicants = [
    { student: allStudents[0], status: 'Shortlisted', score: 94, appliedDate: '2026-10-26' },
    { student: allStudents[1], status: 'Selected', score: 91, appliedDate: '2026-10-27' },
    { student: allStudents[2], status: 'Under Review', score: 85, appliedDate: '2026-10-28' },
    { student: allStudents[3], status: 'Shortlisted', score: 82, appliedDate: '2026-10-29' },
    { student: allStudents[4], status: 'Under Review', score: 78, appliedDate: '2026-10-30' }
  ];

  const totalApplicationsReceived = opportunities.reduce((acc, o) => acc + (o.totalApplicants || 0), 0);
  const totalEventRegistrations = storageService.getEventRegistrations().length;

  const handleUpdateApplicantStatus = (studentName: string, newStatus: string) => {
    showToast(
      'Applicant Status Updated',
      `${studentName}'s record moved to ${newStatus}.`,
      'info'
    );
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annDesc.trim()) return;

    storageService.addFestivalAnnouncement({
      id: `ann-${Date.now()}`,
      festivalId: broadcastFestId,
      title: annTitle.trim(),
      description: annDesc.trim(),
      publishedAt: new Date().toISOString().split('T')[0],
      priority: 'Normal',
      author: 'Festival Directorate'
    });

    apiService.broadcastFestivalAnnouncement(broadcastFestId, {
      title: annTitle.trim(),
      description: annDesc.trim(),
      priority: 'Normal',
      author: 'Festival Directorate'
    }).catch(err => console.warn('Backend broadcast:', err));

    showToast('Announcement Broadcasted', 'Students will see this live on the festival bulletin.', 'success');
    setAnnTitle('');
    setAnnDesc('');
    setShowAnnForm(false);
    onRefresh();
  };

  const handleUpdateEventStatus = (eventId: string, newStatus: EventVerificationStatus) => {
    storageService.updateEventVerification(eventId, newStatus);
    showToast('Event Status Updated', `Status changed to ${newStatus}.`, 'success');
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6E8EB]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1.5 font-mono">
            <Building2 className="w-3.5 h-3.5" />
            <span>Opportunity, Festival & Club Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111418] mt-1">
            Organizer Publishing Studio
          </h1>
          <p className="text-sm text-[#575F6E] mt-1">
            Manage your campus competitions, review student applicant dossiers, curate festivals, and broadcast event updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'opportunities' ? (
            <button
              onClick={onOpenCreateOpportunity}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post Opportunity</span>
            </button>
          ) : (
            <button
              onClick={onOpenCreateEvent}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Host Festival / Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Engagement KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E6E8EB] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-[#575F6E] block mb-1">Active Campus Opportunities</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-[#111418]">{opportunities.length}</span>
          <span className="text-[11px] text-[#88909E] block mt-1">Live in student catalog</span>
        </div>

        <div className="bg-white border border-[#E6E8EB] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-[#575F6E] block mb-1">Major Festivals & Events</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-[#1D4ED8]">{festivals.length + events.length}</span>
          <span className="text-[11px] text-[#88909E] block mt-1">{festivals.length} Festivals · {events.length} Contests</span>
        </div>

        <div className="bg-white border border-[#E6E8EB] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-[#575F6E] block mb-1">Digital Event Passes Claimed</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">{totalEventRegistrations}</span>
          <span className="text-[11px] text-[#88909E] block mt-1">Verified attendee registrations</span>
        </div>

        <div className="bg-white border border-[#E6E8EB] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-[#575F6E] block mb-1">Entity Verification</span>
          <span className="text-sm font-bold text-[#111418] block mt-1 flex items-center gap-1.5 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            Accredited University Host
          </span>
          <span className="text-[11px] text-[#88909E] block mt-1">Centre for Innovation & Student Affairs</span>
        </div>
      </div>

      {/* Segmented Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E6E8EB] pb-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'opportunities'
              ? 'bg-[#111418] text-white shadow-xs'
              : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
          }`}
        >
          Opportunities & Grant Applicants
        </button>
        <button
          onClick={() => setActiveTab('festivals-events')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'festivals-events'
              ? 'bg-[#111418] text-white shadow-xs'
              : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Festivals & Campus Events Management ({festivals.length + events.length})</span>
        </button>
      </div>

      {/* VIEW 1: OPPORTUNITIES & APPLICANT TRIAGE */}
      {activeTab === 'opportunities' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Listings */}
          <div className="lg:col-span-5 bg-white border border-[#E6E8EB] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                Your Published Opportunities
              </h3>
              <span className="text-xs text-[#88909E]">Click to inspect roster</span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {opportunities.map(opp => {
                const isSelected = selectedOppForApplicants?.id === opp.id;

                return (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOppForApplicants(opp)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'border-[#1D4ED8] bg-[#1D4ED8]/5 shadow-sm'
                        : 'border-[#E6E8EB] bg-[#FBFBFA] hover:border-[#111418]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[#575F6E] text-[11px]">
                      <span className="font-semibold text-[#111418]">{opp.category}</span>
                      <span className="font-mono tabular-nums">{opp.totalApplicants || 42} Applicants</span>
                    </div>

                    <h4 className="font-bold text-sm text-[#111418]">
                      {opp.title}
                    </h4>

                    <div className="flex items-center justify-between text-[#88909E] text-[11px] pt-1 border-t border-[#E6E8EB]/50">
                      <span>Deadline: {opp.deadline}</span>
                      <span className="font-medium text-[#111418]">{opp.mode}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Applicant Dossier */}
          <div className="lg:col-span-7 bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-5">
            {selectedOppForApplicants ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6E8EB]">
                  <div>
                    <span className="text-[11px] font-semibold text-[#1D4ED8] uppercase tracking-wider block">
                      Applicant Triage Roster
                    </span>
                    <h3 className="text-base font-bold text-[#111418]">
                      {selectedOppForApplicants.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => onSelectOpportunity(selectedOppForApplicants)}
                    className="text-xs text-[#575F6E] hover:text-[#111418] font-semibold inline-flex items-center gap-1"
                  >
                    <span>Full Listing</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {mockApplicants.map((app, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={app.student.avatar} 
                          alt={app.student.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-[#E6E8EB]" 
                        />
                        <div>
                          <div className="font-bold text-[#111418]">{app.student.name}</div>
                          <div className="text-[#575F6E] text-[11px]">{app.student.department} · {app.student.year}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                          {app.score}% Match
                        </span>

                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateApplicantStatus(app.student.name, e.target.value)}
                          className="px-2 py-1 text-xs border border-[#D1D5DB] rounded-lg bg-white font-medium"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-xs text-[#88909E]">
                Select an opportunity to triage applicants.
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: FESTIVALS & CAMPUS EVENTS MANAGEMENT */}
      {activeTab === 'festivals-events' && (
        <div className="space-y-8">
          
          {/* Announcements Broadcast Bar */}
          <div className="p-6 bg-white border border-[#E6E8EB] rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#1D4ED8]" />
                  <span>Broadcast Official Festival Bulletin</span>
                </h3>
                <p className="text-xs text-[#575F6E] mt-0.5">
                  Publish schedule updates, slot extensions, and emergency notices directly to the student event feeds.
                </p>
              </div>

              <button
                onClick={() => setShowAnnForm(!showAnnForm)}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#111418] bg-[#F4F4F1] hover:bg-white border border-[#D1D5DB] rounded-xl transition-colors"
              >
                {showAnnForm ? 'Cancel' : '+ New Bulletin'}
              </button>
            </div>

            {showAnnForm && (
              <form onSubmit={handlePublishAnnouncement} className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Target Festival</label>
                  <select
                    value={broadcastFestId}
                    onChange={(e) => setBroadcastFestId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl bg-white"
                  >
                    {festivals.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Bulletin Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Robowars Enclosure Pre-Check Schedule Released"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Full Advisory Notice</label>
                  <textarea
                    rows={2}
                    placeholder="Provide clear details, time changes, or contact information for student participants..."
                    value={annDesc}
                    onChange={(e) => setAnnDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl shadow-xs"
                  >
                    Broadcast Bulletin Live
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Table: Campus Events & Competitions Status Triage */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl overflow-hidden shadow-xs space-y-2">
            <div className="p-5 border-b border-[#E6E8EB] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418]">
                  Campus Competitions & Workshops Roster ({events.length})
                </h3>
                <p className="text-xs text-[#575F6E] mt-0.5">
                  Update verification and publication statuses, monitor registrations, and verify parent festival linkages.
                </p>
              </div>

              <button
                onClick={onOpenCreateEvent}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors"
              >
                + Add Sub-Event
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FBFBFA] border-b border-[#E6E8EB] text-[#88909E] uppercase font-mono text-[10px]">
                    <th className="py-3 px-4 font-semibold">Event Title</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Festival Association</th>
                    <th className="py-3 px-4 font-semibold">Venue</th>
                    <th className="py-3 px-4 font-semibold">Registrations</th>
                    <th className="py-3 px-4 font-semibold">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E8EB]">
                  {events.map(evt => (
                    <tr key={evt.id} className="hover:bg-[#FBFBFA] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#111418]">
                        {evt.title}
                        <span className="block text-[11px] font-normal text-[#575F6E]">By {evt.organizer}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#111418]">{evt.category}</td>
                      <td className="py-3.5 px-4">
                        {evt.festivalTitle ? (
                          <span className="font-mono text-[11px] text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {evt.festivalTitle}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#88909E]">Standalone Event</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#575F6E] truncate max-w-xs">{evt.venue}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#111418]">
                        {evt.totalRegistrations || 0} / {evt.openSpots || '∞'}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={evt.verificationStatus}
                          onChange={(e) => handleUpdateEventStatus(evt.id, e.target.value as EventVerificationStatus)}
                          className="px-2 py-1 text-xs border border-[#D1D5DB] rounded-lg bg-white font-medium"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Pending Verification">Pending Verification</option>
                          <option value="Verified">Verified</option>
                          <option value="Published">Published</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
