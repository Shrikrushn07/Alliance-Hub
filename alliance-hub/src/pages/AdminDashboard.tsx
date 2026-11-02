import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Check, 
  X, 
  Filter, 
  Search, 
  Building2, 
  Calendar, 
  Clock, 
  Activity, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Award,
  ChevronRight,
  UserCog,
  History,
  Lock,
  Layers
} from 'lucide-react';
import { Opportunity, Student, CampusFestival, CampusEvent, UserRole } from '../types';
import { apiService, AuthUser, AuditLog } from '../services/apiService';
import { useToast } from '../components/ui/ToastContext';

interface AdminDashboardProps {
  opportunities: Opportunity[];
  festivals?: CampusFestival[];
  events?: CampusEvent[];
  allStudents: Student[];
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  opportunities,
  festivals = [],
  events = [],
  allStudents,
  onRefresh
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'verification' | 'users' | 'content' | 'audit'>('verification');
  
  // Real backend users & audit logs
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Fetch live backend data for Admin
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [fetchedUsers, fetchedLogs] = await Promise.all([
        apiService.getUsers(),
        apiService.getAuditLogs(100)
      ]);
      setUsers(fetchedUsers);
      setAuditLogs(fetchedLogs);
    } catch (err) {
      console.error('Failed to load admin telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Compute pending verifications from real props
  const pendingOpportunities = opportunities.filter(o => !o.verified);
  const pendingEvents = events.filter(e => e.verificationStatus === 'Pending Verification' || e.verificationStatus === 'Draft');

  // Handle Verify Opportunity
  const handleVerifyOpportunity = async (oppId: string, oppTitle: string, approved: boolean) => {
    setActionInProgress(oppId);
    try {
      await apiService.verifyOpportunity(oppId, approved);
      showToast(
        approved ? 'Opportunity Verified & Accredited' : 'Opportunity Returned',
        `"${oppTitle}" has been ${approved ? 'verified for global broadcast' : 'returned to organizer for revisions'}.`,
        approved ? 'success' : 'info'
      );
      onRefresh();
      fetchAdminData();
    } catch (err: any) {
      showToast('Action Failed', err.message || 'Could not verify opportunity', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle Verify Event
  const handleVerifyEvent = async (eventId: string, eventTitle: string, approved: boolean) => {
    setActionInProgress(eventId);
    try {
      await apiService.verifyEvent(eventId, approved ? 'Verified' : 'Draft');
      showToast(
        approved ? 'Campus Event Accredited' : 'Event Returned to Organizer',
        `"${eventTitle}" has been ${approved ? 'approved for student registrations' : 'returned for curriculum alignment'}.`,
        approved ? 'success' : 'info'
      );
      onRefresh();
      fetchAdminData();
    } catch (err: any) {
      showToast('Action Failed', err.message || 'Could not verify event', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle Update User Role
  const handleUpdateRole = async (userId: string, userName: string, newRole: UserRole) => {
    setActionInProgress(userId);
    try {
      const updated = await apiService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      showToast(
        'RBAC Role Updated',
        `${userName} is now assigned the role of "${newRole.toUpperCase()}".`,
        'success'
      );
      fetchAdminData();
    } catch (err: any) {
      showToast('Permission Update Failed', err.message || 'Failed to update user role', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle Toggle User Account Status
  const handleToggleStatus = async (userId: string, userName: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setActionInProgress(userId);
    try {
      const updated = await apiService.updateUserStatus(userId, newStatus);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      showToast(
        'Account Status Changed',
        `${userName}'s access has been set to ${newStatus.toUpperCase()}.`,
        newStatus === 'active' ? 'success' : 'warning'
      );
      fetchAdminData();
    } catch (err: any) {
      showToast('Update Failed', err.message, 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.department.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6E8EB]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Alliance University Administration & Institutional Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111418] mt-1">
            University Admin Console
          </h1>
          <p className="text-sm text-[#575F6E] mt-1">
            Full-spectrum RBAC authority, campus verification queue, institutional audit telemetry, and cross-departmental oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onRefresh();
              fetchAdminData();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111418] bg-white border border-[#E6E8EB] hover:bg-[#F4F4F1] rounded-xl transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Data</span>
          </button>
          <span className="text-xs font-mono text-[#88909E] bg-[#F4F4F1] border border-[#E6E8EB] px-3 py-2 rounded-xl">
            Dean's Office · AY 2026–27
          </span>
        </div>
      </div>

      {/* High-Level Institutional KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E6E8EB] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-[#575F6E] block mb-1">Total System Users</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-[#111418]">
            {users.length > 0 ? users.length : allStudents.length + 3}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">Students, Faculty & Leads</span>
        </div>

        <div className="bg-white border border-[#E6E8EB] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-[#575F6E] block mb-1">Awaiting Accreditation</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-amber-600">
            {pendingOpportunities.length + pendingEvents.length}
          </span>
          <span className="text-[11px] text-amber-700 block mt-1">
            {pendingOpportunities.length} Opps · {pendingEvents.length} Events
          </span>
        </div>

        <div className="bg-white border border-[#E6E8EB] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-[#575F6E] block mb-1">Active Campus Listings</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-[#1D4ED8]">
            {opportunities.length}
          </span>
          <span className="text-[11px] text-[#88909E] block mt-1">
            {festivals.length} Major Festivals Live
          </span>
        </div>

        <div className="bg-white border border-[#E6E8EB] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-[#575F6E] block mb-1">Total Audit Events</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-[#111418]">
            {auditLogs.length}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">Real-time SSE active</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-[#E6E8EB] gap-6 text-sm">
        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 font-semibold relative flex items-center gap-2 ${
            activeTab === 'verification' ? 'text-[#1D4ED8]' : 'text-[#575F6E] hover:text-[#111418]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Queue</span>
          {(pendingOpportunities.length + pendingEvents.length) > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
              {pendingOpportunities.length + pendingEvents.length}
            </span>
          )}
          {activeTab === 'verification' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D4ED8]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 font-semibold relative flex items-center gap-2 ${
            activeTab === 'users' ? 'text-[#1D4ED8]' : 'text-[#575F6E] hover:text-[#111418]'
          }`}
        >
          <UserCog className="w-4 h-4" />
          <span>User & RBAC Management</span>
          {activeTab === 'users' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D4ED8]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`pb-3 font-semibold relative flex items-center gap-2 ${
            activeTab === 'content' ? 'text-[#1D4ED8]' : 'text-[#575F6E] hover:text-[#111418]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Global Content Directory</span>
          {activeTab === 'content' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D4ED8]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 font-semibold relative flex items-center gap-2 ${
            activeTab === 'audit' ? 'text-[#1D4ED8]' : 'text-[#575F6E] hover:text-[#111418]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security & Audit Trail</span>
          {activeTab === 'audit' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D4ED8]" />
          )}
        </button>
      </div>

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
                  <span>Pending Opportunities Requiring University Accreditation</span>
                </h3>
                <p className="text-xs text-[#575F6E]">
                  Ensure all opportunities submitted by student clubs, faculty, and industry partners align with Alliance University standards.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                {pendingOpportunities.length} Pending
              </span>
            </div>

            {pendingOpportunities.length === 0 ? (
              <div className="p-8 text-center text-xs text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
                All submitted campus opportunities are verified and live in the student catalog.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOpportunities.map(opp => (
                  <div 
                    key={opp.id}
                    className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#88909E] text-[11px]">
                        <span className="font-semibold text-[#111418]">{opp.category}</span>
                        <span>·</span>
                        <span>Deadline: {opp.deadline}</span>
                        <span>·</span>
                        <span className="font-mono text-amber-700 font-semibold">Unverified</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#111418]">{opp.title}</h4>
                      <div className="text-[11px] text-[#575F6E]">
                        Organizer: {opp.organizer} · Department: {opp.department || 'Alliance University'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleVerifyOpportunity(opp.id, opp.title, false)}
                        disabled={actionInProgress === opp.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Return / Reject</span>
                      </button>
                      <button
                        onClick={() => handleVerifyOpportunity(opp.id, opp.title, true)}
                        disabled={actionInProgress === opp.id}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-xs disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accredit & Publish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Events Verification */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1D4ED8]" />
                  <span>Pending Campus Events & Competitions</span>
                </h3>
                <p className="text-xs text-[#575F6E]">
                  Verify venue reservations, attendance caps, and eligibility rules before allowing student registrations.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                {pendingEvents.length} Pending
              </span>
            </div>

            {pendingEvents.length === 0 ? (
              <div className="p-8 text-center text-xs text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
                All scheduled campus events and festival competitions have been vetted and approved.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingEvents.map(evt => (
                  <div 
                    key={evt.id}
                    className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#88909E] text-[11px]">
                        <span className="font-semibold text-[#111418]">{evt.category}</span>
                        <span>·</span>
                        <span>Date: {evt.startDatetime ? evt.startDatetime.split('T')[0] : 'TBD'}</span>
                        <span>·</span>
                        <span>Venue: {evt.venue}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#111418]">{evt.title}</h4>
                      <div className="text-[11px] text-[#575F6E]">
                        Organizer: {evt.organizer} · Festival: {evt.festivalTitle || 'Autonomous Campus Event'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleVerifyEvent(evt.id, evt.title, false)}
                        disabled={actionInProgress === evt.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Return</span>
                      </button>
                      <button
                        onClick={() => handleVerifyEvent(evt.id, evt.title, true)}
                        disabled={actionInProgress === evt.id}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-xs disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Schedule</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: USER & RBAC MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E8EB]">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418] flex items-center gap-2">
                <UserCog className="w-4 h-4 text-[#1D4ED8]" />
                <span>Alliance University User Directory & RBAC Control</span>
              </h3>
              <p className="text-xs text-[#575F6E]">
                Assign university roles (Student, Organizer, Faculty, Administrator) and govern access permissions in real time.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#88909E]" />
                <input
                  type="text"
                  placeholder="Search name, email, department..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#FBFBFA] border border-[#E6E8EB] rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-[#FBFBFA] border border-[#E6E8EB] rounded-lg text-[#111418] focus:outline-none focus:border-[#1D4ED8]"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="organizer">Organizers</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E6E8EB] text-[#88909E] uppercase font-mono tracking-wider">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Email & Dept</th>
                  <th className="py-2.5 px-3">Current Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Role Assignment</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EB]">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#FBFBFA] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-7 h-7 rounded-lg object-cover border border-[#E6E8EB]" 
                        />
                        <div>
                          <span className="font-bold text-[#111418] block">{user.name}</span>
                          <span className="text-[11px] text-[#575F6E]">{user.title}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-[#111418] block">{user.email}</span>
                      <span className="text-[11px] text-[#575F6E]">{user.department}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-mono uppercase tracking-wider text-[10px] font-semibold border ${
                        user.role === 'admin' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        user.role === 'faculty' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                        user.role === 'organizer' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {(() => {
                        const status = user.status || (user.accountStatus === 'Active' ? 'active' : 'suspended');
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            status === 'active' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            {status}
                          </span>
                        );
                      })()}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, user.name, e.target.value as UserRole)}
                        disabled={actionInProgress === user.id}
                        className="text-[11px] font-semibold bg-white border border-[#E6E8EB] rounded-lg px-2 py-1 text-[#111418] focus:outline-none focus:border-[#1D4ED8]"
                      >
                        <option value="student">Student</option>
                        <option value="organizer">Organizer</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {(() => {
                        const status = user.status || (user.accountStatus === 'Active' ? 'active' : 'suspended');
                        return (
                          <button
                            onClick={() => handleToggleStatus(user.id, user.name, status)}
                            disabled={actionInProgress === user.id}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                              status === 'active' 
                                ? 'text-rose-700 hover:bg-rose-50' 
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GLOBAL CONTENT DIRECTORY */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418]">
                  All University Opportunities ({opportunities.length})
                </h3>
                <p className="text-xs text-[#575F6E]">Comprehensive index of hackathons, internships, fellowships, and research grants.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map(opp => (
                <div key={opp.id} className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl flex justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase bg-blue-50 text-[#1D4ED8] px-1.5 py-0.5 rounded font-semibold">
                        {opp.category}
                      </span>
                      {opp.verified ? (
                        <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-0.5 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Accredited
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-700 font-semibold">
                          Unverified
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#111418]">{opp.title}</h4>
                    <p className="text-xs text-[#575F6E] line-clamp-1">{opp.description}</p>
                    <div className="text-[11px] text-[#88909E] pt-1">
                      {opp.organizer} · {opp.totalApplicants || 0} applicants
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end shrink-0">
                    <button
                      onClick={() => handleVerifyOpportunity(opp.id, opp.title, !opp.verified)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        opp.verified 
                          ? 'text-rose-700 bg-rose-50 hover:bg-rose-100' 
                          : 'text-white bg-[#111418] hover:bg-[#1D4ED8]'
                      }`}
                    >
                      {opp.verified ? 'Revoke' : 'Accredit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418] flex items-center gap-2">
                <History className="w-4 h-4 text-[#1D4ED8]" />
                <span>Immutable Security & System Audit Trail</span>
              </h3>
              <p className="text-xs text-[#575F6E]">
                Complete audit logs of publishing actions, role elevations, accreditations, and security access checks.
              </p>
            </div>
            <span className="font-mono text-xs text-[#88909E] bg-[#F4F4F1] px-2.5 py-1 rounded-lg">
              {auditLogs.length} Logged Events
            </span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div 
                key={log.id} 
                className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-blue-50 text-[#1D4ED8]">
                      {log.action}
                    </span>
                    <span className="text-[11px] text-[#111418] font-sans font-bold">
                      {log.actorName} ({log.actorRole})
                    </span>
                  </div>
                  <div className="text-[11px] text-[#575F6E] font-sans">
                    Target: <span className="font-mono font-semibold">{log.targetEntity || log.resourceType || log.resourceId}</span> · {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                  </div>
                </div>

                <div className="text-[11px] text-[#88909E] shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
