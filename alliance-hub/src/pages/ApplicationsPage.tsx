import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Filter, 
  FolderKanban, 
  ListFilter, 
  MoveRight, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Save, 
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  X,
  History
} from 'lucide-react';
import { Application, ApplicationStatus, OpportunityCategory } from '../types';
import { storageService } from '../services/storageService';
import { useToast } from '../components/ui/ToastContext';

interface ApplicationsPageProps {
  applications: Application[];
  onRefresh: () => void;
  onNavigateToCatalog: () => void;
}

const STATUS_COLUMNS: { key: ApplicationStatus; label: string; accent: string }[] = [
  { key: 'Saved', label: 'Saved & Drafts', accent: 'border-slate-300' },
  { key: 'Applied', label: 'Applied', accent: 'border-blue-400' },
  { key: 'Shortlisted', label: 'Shortlisted / Interviews', accent: 'border-amber-400' },
  { key: 'Selected', label: 'Selected / Offers', accent: 'border-emerald-400' },
  { key: 'Completed', label: 'Completed', accent: 'border-purple-400' },
  { key: 'Rejected', label: 'Not Selected', accent: 'border-rose-400' }
];

const STAGE_ORDER: ApplicationStatus[] = ['Saved', 'Applied', 'Shortlisted', 'Selected', 'Completed'];

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  onRefresh,
  onNavigateToCatalog
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'board' | 'table' | 'timeline'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  // Add custom tracker modal state
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customOrg, setCustomOrg] = useState('');
  const [customCategory, setCustomCategory] = useState<OpportunityCategory>('Internships');
  const [customDeadline, setCustomDeadline] = useState('2026-04-15');
  const [customNotes, setCustomNotes] = useState('');
  const [customLink, setCustomLink] = useState('');

  const filteredApps = applications.filter(app => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.opportunityTitle.toLowerCase().includes(q) ||
      app.organizer.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    storageService.updateApplicationStatus(appId, newStatus);
    showToast('Status Updated', `Moved to ${newStatus}.`, 'success');
    onRefresh();
  };

  const handleStartEditNotes = (app: Application) => {
    setEditingNotesId(app.id);
    setNoteContent(app.notes || '');
  };

  const handleSaveNotes = (appId: string) => {
    const target = applications.find(a => a.id === appId);
    if (target) {
      storageService.updateApplicationStatus(appId, target.status, noteContent);
      showToast('Notes Saved', 'Interview and round notes updated.', 'info');
      setEditingNotesId(null);
      onRefresh();
    }
  };

  const handleCreateCustomApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customOrg.trim()) return;

    const newApp: Application = {
      id: `app-custom-${Date.now()}`,
      opportunityId: `custom-${Date.now()}`,
      opportunityTitle: customTitle.trim(),
      organizer: customOrg.trim(),
      category: customCategory,
      deadline: customDeadline,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: customNotes.trim() || undefined,
      externalLink: customLink.trim() || undefined,
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          status: 'Applied',
          note: 'Manually logged external campus opportunity.'
        }
      ]
    };

    const currentApps = storageService.getApplications();
    const updated = [newApp, ...currentApps];
    localStorage.setItem('alliance_hub_applications', JSON.stringify(updated));
    
    setShowAddCustomModal(false);
    setCustomTitle('');
    setCustomOrg('');
    setCustomNotes('');
    setCustomLink('');
    showToast('Application Logged', `Tracked "${newApp.opportunityTitle}".`, 'success');
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6E8EB]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Student Application Tracker & Career Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111418] mt-1">
            Application Journey
          </h1>
          <p className="text-sm text-[#575F6E] mt-1 max-w-2xl">
            Track submission deadlines, interview milestones, shortlist statuses, and private reflection notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Board vs Table vs Timeline View Toggle */}
          <div className="flex items-center p-1 bg-white border border-[#D1D5DB] rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'board' ? 'bg-[#111418] text-white font-semibold' : 'text-[#575F6E] hover:text-[#111418]'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'timeline' ? 'bg-[#111418] text-white font-semibold' : 'text-[#575F6E] hover:text-[#111418]'
              }`}
            >
              Milestones Timeline
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'table' ? 'bg-[#111418] text-white font-semibold' : 'text-[#575F6E] hover:text-[#111418]'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setShowAddCustomModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-[#111418] bg-white border border-[#D1D5DB] hover:border-[#111418] rounded-xl transition-colors shadow-xs"
          >
            + Log External
          </button>

          <button
            onClick={onNavigateToCatalog}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl transition-colors shadow-sm"
          >
            + Add Opportunity
          </button>
        </div>
      </div>

      {/* Search Input and Summary Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#88909E]" />
          <input
            type="text"
            placeholder="Filter tracked applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-[#575F6E] font-mono">
          <span>Total Tracked: <strong className="text-[#111418]">{applications.length}</strong></span>
          <span>·</span>
          <span>Active In Pipeline: <strong className="text-[#1D4ED8]">{applications.filter(a => a.status === 'Applied' || a.status === 'Shortlisted').length}</strong></span>
          <span>·</span>
          <span>Offers / Wins: <strong className="text-emerald-700">{applications.filter(a => a.status === 'Selected' || a.status === 'Completed').length}</strong></span>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {STATUS_COLUMNS.map(col => {
            const colApps = filteredApps.filter(a => a.status === col.key);

            return (
              <div 
                key={col.key}
                className="bg-[#F4F4F1] border border-[#E6E8EB] rounded-2xl p-3 min-w-[240px] space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EB] text-xs font-bold text-[#111418]">
                  <span className="truncate">{col.label}</span>
                  <span className="font-mono text-[11px] text-[#575F6E] bg-white px-2 py-0.5 rounded-full border border-[#E6E8EB]">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 min-h-[120px]">
                  {colApps.map(app => (
                    <div
                      key={app.id}
                      className="bg-white border border-[#E6E8EB] rounded-xl p-3.5 shadow-sm space-y-2.5 text-xs hover:border-[#111418] transition-all"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#88909E]">
                        <span>{app.category}</span>
                        <span className="font-mono">Due: {app.deadline}</span>
                      </div>

                      <h4 className="font-bold text-sm text-[#111418] leading-snug">
                        {app.opportunityTitle}
                      </h4>

                      <p className="text-[11px] text-[#575F6E]">
                        {app.organizer}
                      </p>

                      {/* Interactive Notes */}
                      {editingNotesId === app.id ? (
                        <div className="space-y-1.5 pt-1">
                          <textarea
                            rows={2}
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="w-full p-2 text-xs border border-[#D1D5DB] rounded-lg"
                            placeholder="Add progress note or interview thoughts..."
                          />
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2 py-0.5 text-[10px] text-[#575F6E]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(app.id)}
                              className="px-2 py-0.5 text-[10px] bg-[#111418] text-white rounded font-medium"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => handleStartEditNotes(app)}
                          className="p-2 bg-[#FBFBFA] border border-[#E6E8EB] rounded-lg text-[11px] text-[#575F6E] cursor-pointer hover:bg-white group"
                        >
                          <div className="flex items-center justify-between text-[#88909E] text-[10px] mb-0.5">
                            <span>Stage Notes</span>
                            <Edit3 className="w-3 h-3 group-hover:text-[#111418]" />
                          </div>
                          <p className="line-clamp-2 italic">
                            {app.notes || 'Click to write personal note...'}
                          </p>
                        </div>
                      )}

                      {/* Move Status Dropdown */}
                      <div className="pt-2 border-t border-[#E6E8EB] flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                          className="text-[10px] font-semibold text-[#1D4ED8] bg-transparent border-0 focus:outline-none cursor-pointer"
                        >
                          {STATUS_COLUMNS.map(c => (
                            <option key={c.key} value={c.key}>
                              Move to: {c.key}
                            </option>
                          ))}
                        </select>

                        {app.externalLink && (
                          <a
                            href={app.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#88909E] hover:text-[#111418]"
                            title="Open external link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="h-24 border border-dashed border-[#D1D5DB] rounded-xl flex items-center justify-center text-[11px] text-[#88909E]">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: MILESTONES TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-[#E6E8EB] rounded-2xl flex items-center justify-between shadow-xs">
            <div className="text-xs text-[#575F6E]">
              <span className="font-bold text-[#111418]">Chronological Progression Roadmap: </span>
              Displays your active applications ordered by impending milestone deadlines with historical event logs.
            </div>
          </div>

          <div className="space-y-4">
            {filteredApps
              .slice()
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .map(app => {
                const isSelected = app.status === 'Selected' || app.status === 'Completed';
                const isRejected = app.status === 'Rejected';
                const currentStageIdx = STAGE_ORDER.indexOf(app.status);

                return (
                  <div 
                    key={app.id}
                    className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 transition-all duration-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-[#88909E] font-mono">
                          <span className="font-bold text-[#111418]">{app.category}</span>
                          <span>·</span>
                          <span>Applied {app.appliedDate}</span>
                          <span>·</span>
                          <span className="text-[#1D4ED8] font-bold">Deadline: {app.deadline}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#111418] mt-1">
                          {app.opportunityTitle}
                        </h3>
                        <p className="text-xs text-[#575F6E] mt-0.5 font-medium">
                          Organized by {app.organizer}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg font-mono ${
                          isSelected 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : isRejected 
                            ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {app.status}
                        </span>

                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                          className="px-2.5 py-1 text-xs border border-[#D1D5DB] rounded-lg bg-[#FBFBFA]"
                        >
                          {STATUS_COLUMNS.map(c => (
                            <option key={c.key} value={c.key}>
                              Update: {c.key}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Visual Milestone Progression Track */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1.5 text-[11px] font-mono text-[#88909E]">
                        <span>Stage Progression:</span>
                        <span>{app.status}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {STAGE_ORDER.map((stage, idx) => {
                          const reached = currentStageIdx >= idx;
                          const active = app.status === stage;
                          return (
                            <div 
                              key={stage}
                              className={`h-2 rounded-full transition-all ${
                                reached 
                                  ? active 
                                    ? 'bg-[#1D4ED8]' 
                                    : 'bg-emerald-600' 
                                  : 'bg-[#E6E8EB]'
                              }`}
                              title={stage}
                            />
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#88909E] mt-1">
                        <span>Draft</span>
                        <span>Applied</span>
                        <span>Review</span>
                        <span>Offer</span>
                        <span>Completed</span>
                      </div>
                    </div>

                    {/* History events logs */}
                    {app.history && app.history.length > 0 && (
                      <div className="pt-3 border-t border-[#E6E8EB] space-y-2">
                        <div className="text-[11px] font-bold text-[#111418] uppercase tracking-wider flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-[#1D4ED8]" />
                          <span>Milestone Log</span>
                        </div>
                        <div className="space-y-1.5">
                          {app.history.map((event, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs text-[#575F6E]">
                              <span className="font-mono text-[10px] text-[#88909E] pt-0.5">{event.date}</span>
                              <span className="font-semibold text-[#111418]">{event.status}:</span>
                              <span>{event.note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes preview */}
                    {app.notes && (
                      <div className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl text-xs text-[#575F6E] italic">
                        "{app.notes}"
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIEW 3: TABLE VIEW */}
      {activeTab === 'table' && (
        <div className="bg-white border border-[#E6E8EB] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FBFBFA] border-b border-[#E6E8EB] text-[#88909E] uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Opportunity</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Applied Date</th>
                <th className="py-3 px-4 font-semibold">Deadline</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8EB]">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-[#FBFBFA] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#111418]">
                    {app.opportunityTitle}
                    <span className="block text-[11px] text-[#575F6E] font-normal">{app.organizer}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#575F6E]">{app.category}</td>
                  <td className="py-3.5 px-4 font-mono text-[#575F6E]">{app.appliedDate}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#111418]">{app.deadline}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className="px-2 py-1 text-xs font-semibold rounded-lg border border-[#D1D5DB] bg-white cursor-pointer"
                    >
                      {STATUS_COLUMNS.map(c => (
                        <option key={c.key} value={c.key}>
                          {c.key}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-[#575F6E] max-w-xs truncate">
                    {app.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Custom Opportunity Tracking Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E8EB] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#1D4ED8]" />
                <h3 className="text-sm font-bold text-[#111418]">Track External Opportunity</h3>
              </div>
              <button 
                onClick={() => setShowAddCustomModal(false)}
                className="text-[#88909E] hover:text-[#111418]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#575F6E]">
              Applied to an external internship, corporate contest, or off-campus hackathon? Track its timeline alongside your Alliance Hub commitments.
            </p>

            <form onSubmit={handleCreateCustomApplication} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#111418] block mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Google Summer of Code / Morgan Stanley Internship"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#1D4ED8]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#111418] block mb-1">Company or Institution *</label>
                <input
                  type="text"
                  placeholder="e.g. Google Open Source / DRDO"
                  value={customOrg}
                  onChange={(e) => setCustomOrg(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as OpportunityCategory)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl bg-white"
                  >
                    <option value="Internships">Internships</option>
                    <option value="Hackathons">Hackathons</option>
                    <option value="Research">Research</option>
                    <option value="Technical Competitions">Technical Competitions</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#111418] block mb-1">Next Milestone Date</label>
                  <input
                    type="date"
                    value={customDeadline}
                    onChange={(e) => setCustomDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#111418] block mb-1">Portal / Career Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customLink}
                  onChange={(e) => setCustomLink(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#111418] block mb-1">Stage Reflection Notes</label>
                <textarea
                  rows={2}
                  placeholder="Resume submitted; waiting for Round 1 technical coding assessment..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E8EB]">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-3 py-1.5 text-xs text-[#575F6E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors shadow-xs"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
