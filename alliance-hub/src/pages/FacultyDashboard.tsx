import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Bell, 
  Award,
  Layers,
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { Opportunity, CampusEvent, CampusFestival, Student } from '../types';
import { AuthUser } from '../services/apiService';
import { useToast } from '../components/ui/ToastContext';

interface FacultyDashboardProps {
  currentUser?: AuthUser | null;
  opportunities: Opportunity[];
  events: CampusEvent[];
  allStudents: Student[];
  onOpenCreateOpportunity?: () => void;
  onOpenCreateEvent?: () => void;
  onSelectOpportunity?: (opp: Opportunity) => void;
  onSelectEvent?: (event: CampusEvent) => void;
  onRefresh: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  currentUser,
  opportunities,
  events,
  allStudents,
  onOpenCreateOpportunity,
  onOpenCreateEvent,
  onSelectOpportunity,
  onSelectEvent,
  onRefresh
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'opportunities' | 'events' | 'students' | 'announcements'>('opportunities');
  const [circularTitle, setCircularTitle] = useState('');
  const [circularBody, setCircularBody] = useState('');
  const [circularPriority, setCircularPriority] = useState<'Normal' | 'Urgent'>('Normal');

  // Scoped Department Data
  const facultyDept = currentUser?.department || 'School of Liberal Arts & Humanities';

  const departmentOpportunities = useMemo(() => {
    return opportunities.filter(o => 
      o.department.toLowerCase().includes(facultyDept.toLowerCase()) || 
      facultyDept.toLowerCase().includes(o.department.toLowerCase()) ||
      o.department === 'Cross-Disciplinary'
    );
  }, [opportunities, facultyDept]);

  const departmentEvents = useMemo(() => {
    return events.filter(e => 
      !e.organizerDepartment || 
      e.organizerDepartment.toLowerCase().includes(facultyDept.toLowerCase()) ||
      facultyDept.toLowerCase().includes(e.organizerDepartment.toLowerCase())
    );
  }, [events, facultyDept]);

  const departmentStudents = useMemo(() => {
    return allStudents.filter(s => 
      s.department.toLowerCase().includes(facultyDept.toLowerCase()) ||
      facultyDept.toLowerCase().includes(s.department.toLowerCase())
    );
  }, [allStudents, facultyDept]);

  const handlePublishCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circularTitle.trim() || !circularBody.trim()) return;

    showToast(
      'Department Circular Broadcasted',
      `"${circularTitle}" sent to all students enrolled in ${facultyDept}.`,
      'success'
    );
    setCircularTitle('');
    setCircularBody('');
  };

  const handleEndorseCredit = (studentName: string) => {
    showToast(
      'Academic Credit Endorsed',
      `Issued 2.0 Elective Research Credits for ${studentName}.`,
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E6E8EB]">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#1D4ED8]" />
            <span>Faculty Academic Directorate · {facultyDept}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111418] mt-1">
            Faculty & Department Workspace
          </h1>
          <p className="text-sm text-[#575F6E] mt-1 max-w-2xl">
            Welcome, <strong>{currentUser?.name || 'Dr. Maya Sengupta'}</strong> ({currentUser?.title || 'Faculty Coordinator & Department Head'}). Supervise student participation, publish accredited department opportunities, and coordinate academic credits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCreateOpportunity}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Department Opportunity</span>
          </button>
          <button
            onClick={onOpenCreateEvent}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#111418] bg-white border border-[#D1D5DB] hover:border-[#111418] rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Department Event</span>
          </button>
        </div>
      </div>

      {/* Faculty KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E6E8EB] p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-[#575F6E] block font-medium">Department Opportunities</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-[#111418]">
            {departmentOpportunities.length}
          </span>
          <span className="text-[11px] text-[#88909E] block">Active fellowships & research grants</span>
        </div>

        <div className="bg-white border border-[#E6E8EB] p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-[#575F6E] block font-medium">Department Events & Labs</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-[#1D4ED8]">
            {departmentEvents.length}
          </span>
          <span className="text-[11px] text-[#88909E] block">Symposiums, clinics & guest lectures</span>
        </div>

        <div className="bg-white border border-[#E6E8EB] p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-[#575F6E] block font-medium">Enrolled Department Peers</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {departmentStudents.length * 45}+
          </span>
          <span className="text-[11px] text-[#88909E] block">Tracked across 4 academic cohorts</span>
        </div>

        <div className="bg-white border border-[#E6E8EB] p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-[#575F6E] block font-medium">Department Jurisdiction</span>
          <div className="text-xs font-bold text-[#111418] flex items-center gap-1.5 truncate pt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{facultyDept}</span>
          </div>
          <span className="text-[11px] text-[#88909E] block">Authorized Department Coordinator</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E8EB] pb-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'opportunities'
              ? 'bg-[#111418] text-white shadow-xs'
              : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
          }`}
        >
          Department Opportunities ({departmentOpportunities.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'events'
              ? 'bg-[#111418] text-white shadow-xs'
              : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
          }`}
        >
          Department Events & Workshops ({departmentEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'students'
              ? 'bg-[#111418] text-white shadow-xs'
              : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
          }`}
        >
          Student Participation & Credits
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'announcements'
              ? 'bg-[#111418] text-white shadow-xs'
              : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
          }`}
        >
          Department Bulletins
        </button>
      </div>

      {/* VIEW 1: DEPARTMENT OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#575F6E]">
              Initiatives accredited or hosted under <strong>{facultyDept}</strong>.
            </p>
            <button
              onClick={onOpenCreateOpportunity}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline"
            >
              + Create New Department Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentOpportunities.map(opp => (
              <div
                key={opp.id}
                onClick={() => onSelectOpportunity?.(opp)}
                className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-5 cursor-pointer transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-[#575F6E]">
                  <span className="font-semibold text-[#111418]">{opp.category}</span>
                  <span className="font-mono text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                    {opp.verified ? 'Faculty Accredited' : 'Pending Verification'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#111418]">
                  {opp.title}
                </h4>

                <p className="text-xs text-[#575F6E] line-clamp-2">
                  {opp.description}
                </p>

                <div className="pt-2 border-t border-[#E6E8EB] flex items-center justify-between text-xs text-[#88909E]">
                  <span>Deadline: {opp.deadline}</span>
                  <span>{opp.totalApplicants || 0} Applicants</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: DEPARTMENT EVENTS & WORKSHOPS */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#575F6E]">
              Academic symposiums, clinics, and workshops organized by <strong>{facultyDept}</strong>.
            </p>
            <button
              onClick={onOpenCreateEvent}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline"
            >
              + Host Department Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentEvents.map(evt => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent?.(evt)}
                className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-5 cursor-pointer transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F4F4F1] font-semibold text-[#111418]">
                    {evt.category}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono font-semibold">
                    {evt.totalRegistrations || 0} Registered
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#111418]">
                  {evt.title}
                </h4>

                <div className="text-xs text-[#575F6E] space-y-1 pt-1 border-t border-[#E6E8EB]">
                  <div className="truncate">Venue: {evt.venue}</div>
                  <div className="font-mono text-[11px] text-[#88909E]">
                    Schedule: {evt.startDatetime.replace('T', ' · ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: STUDENT PARTICIPATION & CREDITS */}
      {activeTab === 'students' && (
        <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418]">
                Student Experiential Learning & Credit Endorsement
              </h3>
              <p className="text-xs text-[#575F6E] mt-0.5">
                Review verified student project portfolios and issue official departmental elective credits.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {allStudents.map(student => (
              <div
                key={student.id}
                className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    className="w-12 h-12 rounded-xl object-cover border border-[#E6E8EB]" 
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#111418]">{student.name}</h4>
                    <div className="text-[#575F6E]">{student.department} · {student.year}</div>
                    <div className="text-[11px] text-[#88909E] pt-0.5">
                      {student.projects.length} Published Projects · {student.skills.slice(0, 4).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleEndorseCredit(student.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111418] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Endorse 2.0 Academic Credits</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: DEPARTMENT BULLETINS */}
      {activeTab === 'announcements' && (
        <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4 shadow-xs max-w-2xl">
          <div className="pb-3 border-b border-[#E6E8EB]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#1D4ED8]" />
              <span>Broadcast Official Department Circular</span>
            </h3>
            <p className="text-xs text-[#575F6E] mt-0.5">
              Distribute urgent notices, lab exam schedules, or symposium announcements to students in {facultyDept}.
            </p>
          </div>

          <form onSubmit={handlePublishCircular} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#111418] block mb-1">Circular Headline *</label>
              <input
                type="text"
                placeholder="e.g. End-Term Capstone Project Showcase Guidelines"
                value={circularTitle}
                onChange={(e) => setCircularTitle(e.target.value)}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#1D4ED8]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-[#111418] block mb-1">Circular Body *</label>
              <textarea
                rows={4}
                placeholder="Official instructions, committee dates, deadlines, and submission email..."
                value={circularBody}
                onChange={(e) => setCircularBody(e.target.value)}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#1D4ED8]"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[#575F6E]">Priority:</span>
                <select
                  value={circularPriority}
                  onChange={(e) => setCircularPriority(e.target.value as any)}
                  className="px-2.5 py-1 text-xs border border-[#D1D5DB] rounded-lg bg-white"
                >
                  <option value="Normal">Normal Notice</option>
                  <option value="Urgent">Urgent Circular (Alert Student Bell)</option>
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast to Students</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
