import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { WorkspaceTopBar } from './components/layout/WorkspaceTopBar';
import { Footer } from './components/layout/Footer';
import { ToastProvider, useToast } from './components/ui/ToastContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { OpportunityDetailsPage } from './pages/OpportunityDetailsPage';
import { TeamsPage } from './pages/TeamsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AccessDeniedPage } from './components/common/AccessDeniedPage';
import { EventsPage } from './pages/EventsPage';
import { FestivalDetailPage } from './components/events/FestivalDetailPage';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationsModal } from './components/common/NotificationsModal';
import { ApplyModal } from './components/opportunities/ApplyModal';
import { CreateTeamModal } from './components/teams/CreateTeamModal';
import { CreateOpportunityModal } from './components/opportunities/CreateOpportunityModal';
import { StudentProfileModal } from './components/profile/StudentProfileModal';
import { MatchExplanationModal } from './components/opportunities/MatchExplanationModal';
import { InviteToTeamModal } from './components/teams/InviteToTeamModal';
import { InvitationsInboxModal } from './components/teams/InvitationsInboxModal';
import { EventRegistrationModal } from './components/events/EventRegistrationModal';
import { MyEventPassesModal } from './components/events/MyEventPassesModal';
import { CreateEventModal } from './components/events/CreateEventModal';
import { 
  Opportunity, 
  Student, 
  Team, 
  Application, 
  TeamInvitation, 
  CampusFestival, 
  CampusEvent, 
  EventRegistration, 
  UserRole 
} from './types';
import { storageService } from './services/storageService';
import { apiService, AuthUser, NotificationItem } from './services/apiService';

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}

function MainAppContent() {
  const { showToast } = useToast();

  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);

  // Navigation UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Domain Entity State from storage & backend
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<Student>(storageService.getCurrentStudent());
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);

  // Campus Events & Festivals State
  const [festivals, setFestivals] = useState<CampusFestival[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<CampusFestival | null>(null);
  const [selectedEventForModal, setSelectedEventForModal] = useState<CampusEvent | null>(null);

  // Selected entities for drill-down views & modals
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [opportunityToApply, setOpportunityToApply] = useState<Opportunity | null>(null);

  // Advanced Interactive Modals
  const [matchExplanationOpp, setMatchExplanationOpp] = useState<Opportunity | null>(null);
  const [studentToInvite, setStudentToInvite] = useState<Student | null>(null);
  const [isInvitationsModalOpen, setIsInvitationsModalOpen] = useState(false);
  const [isMyPassesModalOpen, setIsMyPassesModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  // Modal Visibility
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isCreateOppModalOpen, setIsCreateOppModalOpen] = useState(false);

  // Filter pass-through for teams page
  const [teamOppFilter, setTeamOppFilter] = useState<string | undefined>(undefined);

  // Keyboard shortcut for Command/Global search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load from storage & server
  const reloadData = async () => {
    // Local storage entities
    setOpportunities(storageService.getOpportunities());
    setStudent(storageService.getCurrentStudent());
    setAllStudents(storageService.getAllStudents());
    setTeams(storageService.getTeams());
    setApplications(storageService.getApplications());
    setInvitations(storageService.getInvitations());
    setFestivals(storageService.getFestivals());
    setEvents(storageService.getEvents());
    setEventRegistrations(storageService.getEventRegistrations());

    // Sync with server if online
    try {
      const [backendUser, usersList, backendOpps, backendFestivals, backendEvents, notifs] = await Promise.all([
        apiService.getCurrentUser().catch(() => null),
        apiService.getUsers().catch(() => []),
        apiService.getOpportunities().catch(() => null),
        apiService.getFestivals().catch(() => null),
        apiService.getEvents().catch(() => null),
        apiService.getNotifications().catch(() => [])
      ]);

      if (backendUser && backendUser.user) {
        setCurrentUser(backendUser.user);
        setUserRole(backendUser.user.role);
      }
      if (usersList.length > 0) {
        setAllUsers(usersList);
      }
      if (backendOpps && backendOpps.length > 0) {
        setOpportunities(backendOpps);
      }
      if (backendFestivals && backendFestivals.length > 0) {
        setFestivals(backendFestivals);
      }
      if (backendEvents && backendEvents.length > 0) {
        setEvents(backendEvents);
      }
      if (notifs) {
        setNotifications(notifs);
      }
    } catch (e) {
      console.warn('Backend sync error:', e);
    }
  };

  // Initial load and SSE real-time subscription
  useEffect(() => {
    reloadData();

    // Subscribe to Server-Sent Events (SSE) for instant cross-client updates
    const unsubscribeSSE = apiService.subscribeRealtime((event) => {
      reloadData();
      if (event.type === 'OPPORTUNITY_VERIFIED') {
        showToast('University Accreditation Update', 'A new opportunity has been verified and published.', 'info');
      } else if (event.type === 'EVENT_VERIFIED') {
        showToast('Campus Event Accredited', 'New verified campus event schedule is now live.', 'info');
      } else if (event.type === 'FESTIVAL_ANNOUNCEMENT') {
        showToast('Campus Festival Bulletin', event.payload?.title || 'New festival bulletin broadcasted.', 'info');
      }
    });

    return () => {
      unsubscribeSSE();
    };
  }, []);

  // Compute pending invitation count for bell / badge indicators
  const pendingInvitesCount = invitations.filter(i => i.status === 'Pending').length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Role Switching Handler
  const handleSwitchUser = async (userId: string) => {
    try {
      const switched = await apiService.switchUser(userId);
      if (switched && switched.user) {
        setCurrentUser(switched.user);
        setUserRole(switched.user.role);
        showToast(
          'Persona Switched (RBAC)',
          `Active as ${switched.user.name} (${switched.user.role.toUpperCase()}) — ${switched.user.title || ''}.`,
          'success'
        );
        // Auto-route to respective role's command center
        if (switched.user.role === 'student') setCurrentTab('dashboard');
        else if (switched.user.role === 'organizer') setCurrentTab('organizer');
        else if (switched.user.role === 'faculty') setCurrentTab('faculty');
        else if (switched.user.role === 'admin') setCurrentTab('admin');

        reloadData();
      }
    } catch (err: any) {
      showToast('Switch Error', err.message, 'error');
    }
  };

  // Navigation Handlers
  const handleNavigate = (tab: string, opportunityId?: string) => {
    if (opportunityId) {
      const target = storageService.getOpportunityById(opportunityId);
      if (target) {
        setSelectedOpportunity(target);
        setCurrentTab('opportunity-details');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApply = (opp: Opportunity) => {
    setOpportunityToApply(opp);
    setIsApplyModalOpen(true);
  };

  const handleSelectOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setCurrentTab('opportunity-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTeamsForOpp = (oppId?: string) => {
    setTeamOppFilter(oppId);
    setCurrentTab('teams');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Festival & Event Handlers
  const handleSelectFestival = (festival: CampusFestival) => {
    setSelectedFestival(festival);
    setCurrentTab('festival-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEvent = (event: CampusEvent) => {
    setSelectedEventForModal(event);
  };

  const handleRegisterEvent = (event: CampusEvent) => {
    setSelectedEventForModal(event);
  };

  // RBAC Permission Guard Helper
  const isAuthorized = (tab: string, role: UserRole): boolean => {
    const r = role as string;
    if (r === 'admin') return true; // Administrator has universal access
    if (tab === 'admin') return r === 'admin';
    if (tab === 'faculty') return r === 'faculty' || r === 'admin';
    if (tab === 'organizer') return r === 'organizer' || r === 'admin';
    return true; // All other student tabs and public views are open
  };

  // 1. PUBLIC MARKETING LANDING PAGE VIEW
  if (currentTab === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#111418]">
        <LandingPage
          onNavigate={handleNavigate}
          opportunities={opportunities}
          festivals={festivals}
          events={events}
          student={student}
          currentUser={currentUser}
          allUsers={allUsers}
          userRole={userRole}
          onSwitchUser={handleSwitchUser}
          onOpenApply={handleOpenApply}
        />

        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          opportunity={opportunityToApply}
          student={student}
          onSuccess={reloadData}
        />
      </div>
    );
  }

  // 2. MODERN SAAS WORKSPACE LAYOUT (Linear / Notion / Stripe styled)
  return (
    <div className="min-h-screen flex bg-[#FBFBFA] text-[#111418]">
      
      {/* Modern Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        userRole={userRole}
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenSearch={() => setIsGlobalSearchOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Workspace Command TopBar with Breadcrumbs & Actions */}
        <WorkspaceTopBar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          userRole={userRole}
          currentUser={currentUser}
          unreadCount={unreadNotificationsCount}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenSearch={() => setIsGlobalSearchOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateTeam={() => setIsCreateTeamModalOpen(true)}
          onOpenCreateOpportunity={() => setIsCreateOppModalOpen(true)}
          onOpenCreateEvent={() => setIsCreateEventModalOpen(true)}
        />

        {/* Dynamic Workspace Content with RBAC Protection */}
        <main className="flex-1">
          
          {/* ACCESS DENIED INTERCEPTOR */}
          {!isAuthorized(currentTab, userRole) ? (
            <AccessDeniedPage
              requiredRole={currentTab}
              targetPageName={
                currentTab === 'admin' ? 'University Admin Console' : 
                currentTab === 'faculty' ? 'Faculty & Dept Portal' : 
                'Organizer Studio'
              }
              currentUser={currentUser}
              onReturnToSafeWorkspace={() => {
                if (userRole === 'student') setCurrentTab('dashboard');
                else if (userRole === 'organizer') setCurrentTab('organizer');
                else if (userRole === 'faculty') setCurrentTab('faculty');
                else setCurrentTab('admin');
              }}
              onSwitchRole={(roleId: string) => {
                handleSwitchUser(roleId);
              }}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardPage
                  student={student}
                  opportunities={opportunities}
                  teams={teams}
                  applications={applications}
                  allStudents={allStudents}
                  events={events}
                  festivals={festivals}
                  onNavigate={handleNavigate}
                  onOpenApply={handleOpenApply}
                  onSelectStudent={(s) => setSelectedStudentForModal(s)}
                  onOpenCreateTeam={() => setIsCreateTeamModalOpen(true)}
                  onExplainMatch={(opp) => setMatchExplanationOpp(opp)}
                  onSelectEvent={handleSelectEvent}
                  onSelectFestival={handleSelectFestival}
                />
              )}

              {currentTab === 'opportunities' && (
                <OpportunitiesPage
                  opportunities={opportunities}
                  student={student}
                  onSelectOpportunity={handleSelectOpportunity}
                  onOpenApply={handleOpenApply}
                  onExplainMatch={(opp) => setMatchExplanationOpp(opp)}
                />
              )}

              {currentTab === 'opportunity-details' && selectedOpportunity && (
                <OpportunityDetailsPage
                  opportunity={selectedOpportunity}
                  student={student}
                  teams={teams}
                  onBack={() => handleNavigate('opportunities')}
                  onOpenApply={handleOpenApply}
                  onNavigateToTeams={handleNavigateToTeamsForOpp}
                  onSelectSimilarOpp={handleSelectOpportunity}
                />
              )}

              {/* CAMPUS FESTIVALS & EVENTS DISCOVERY MODULE */}
              {currentTab === 'events' && (
                <EventsPage
                  festivals={festivals}
                  events={events}
                  student={student}
                  onSelectFestival={handleSelectFestival}
                  onSelectEvent={handleSelectEvent}
                  onRegisterEvent={handleRegisterEvent}
                  onOpenMyPasses={() => setIsMyPassesModalOpen(true)}
                  onOpenCreateEvent={() => setIsCreateEventModalOpen(true)}
                  onRefresh={reloadData}
                />
              )}

              {/* MAJOR FESTIVAL DEDICATED HUB PAGE */}
              {currentTab === 'festival-details' && selectedFestival && (
                <FestivalDetailPage
                  festival={selectedFestival}
                  subEvents={events.filter(e => e.festivalId === selectedFestival.id)}
                  student={student}
                  onBack={() => handleNavigate('events')}
                  onSelectSubEvent={handleSelectEvent}
                  onRegisterEvent={handleRegisterEvent}
                  onRefresh={reloadData}
                />
              )}

              {currentTab === 'teams' && (
                <TeamsPage
                  teams={teams}
                  student={student}
                  allStudents={allStudents}
                  opportunities={opportunities}
                  onOpenCreateTeam={() => setIsCreateTeamModalOpen(true)}
                  onSelectStudent={(s) => setSelectedStudentForModal(s)}
                  onSelectOpportunity={handleSelectOpportunity}
                  onInviteStudent={(peer) => setStudentToInvite(peer)}
                  onOpenInvitations={() => setIsInvitationsModalOpen(true)}
                  pendingInvitesCount={pendingInvitesCount}
                  initialFilterOppId={teamOppFilter}
                />
              )}

              {currentTab === 'applications' && (
                <ApplicationsPage
                  applications={applications}
                  onRefresh={reloadData}
                  onNavigateToCatalog={() => handleNavigate('opportunities')}
                />
              )}

              {currentTab === 'portfolio' && (
                <PortfolioPage
                  student={student}
                  onUpdateStudent={(updated) => {
                    setStudent(updated);
                    reloadData();
                  }}
                />
              )}

              {/* ORGANIZER DEDICATED WORKSPACE */}
              {currentTab === 'organizer' && (
                <OrganizerDashboard
                  opportunities={opportunities}
                  festivals={festivals}
                  events={events}
                  allStudents={allStudents}
                  onOpenCreateOpportunity={() => setIsCreateOppModalOpen(true)}
                  onOpenCreateEvent={() => setIsCreateEventModalOpen(true)}
                  onSelectOpportunity={handleSelectOpportunity}
                  onSelectFestival={handleSelectFestival}
                  onRefresh={reloadData}
                />
              )}

              {/* FACULTY & DEPARTMENT COORDINATOR DEDICATED WORKSPACE */}
              {currentTab === 'faculty' && (
                <FacultyDashboard
                  currentUser={currentUser}
                  allStudents={allStudents}
                  opportunities={opportunities}
                  events={events}
                  onOpenCreateOpportunity={() => setIsCreateOppModalOpen(true)}
                  onOpenCreateEvent={() => setIsCreateEventModalOpen(true)}
                  onSelectOpportunity={handleSelectOpportunity}
                  onSelectEvent={handleSelectEvent}
                  onRefresh={reloadData}
                />
              )}

              {/* UNIVERSITY ADMINISTRATOR COMMAND CONSOLE */}
              {currentTab === 'admin' && (
                <AdminDashboard
                  opportunities={opportunities}
                  festivals={festivals}
                  events={events}
                  allStudents={allStudents}
                  onRefresh={reloadData}
                />
              )}
            </>
          )}
        </main>

        {/* Clean Editorial Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* GLOBAL COMMAND SEARCH MODAL (⌘K) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        opportunities={opportunities}
        festivals={festivals}
        events={events}
        students={allStudents}
        teams={teams}
        onSelectOpportunity={handleSelectOpportunity}
        onSelectEvent={handleSelectEvent}
        onSelectFestival={handleSelectFestival}
        onSelectStudent={(peer) => {
          setSelectedStudentForModal(peer);
        }}
        onSelectTeam={() => {
          handleNavigate('teams');
        }}
      />

      {/* NOTIFICATIONS MODAL / DRAWER */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onRefresh={reloadData}
        onNavigate={handleNavigate}
      />

      {/* Interactive Core Modals */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        opportunity={opportunityToApply}
        student={student}
        onSuccess={reloadData}
      />

      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        student={student}
        opportunities={opportunities}
        onSuccess={reloadData}
      />

      <CreateOpportunityModal
        isOpen={isCreateOppModalOpen}
        onClose={() => setIsCreateOppModalOpen(false)}
        onSuccess={reloadData}
      />

      <StudentProfileModal
        isOpen={selectedStudentForModal !== null}
        student={selectedStudentForModal}
        currentStudent={student}
        onClose={() => setSelectedStudentForModal(null)}
        onConnectionChange={reloadData}
        onOpenInviteModal={(peer) => {
          setSelectedStudentForModal(null);
          setStudentToInvite(peer);
        }}
      />

      {/* Match Explanation & Eligibility Audit Modal */}
      <MatchExplanationModal
        isOpen={matchExplanationOpp !== null}
        opportunity={matchExplanationOpp}
        student={student}
        onClose={() => setMatchExplanationOpp(null)}
        onApply={(opp) => {
          setMatchExplanationOpp(null);
          handleOpenApply(opp);
        }}
        onFindTeammates={(oppId) => {
          setMatchExplanationOpp(null);
          handleNavigateToTeamsForOpp(oppId);
        }}
      />

      {/* Invite Teammate to Squad Modal */}
      <InviteToTeamModal
        isOpen={studentToInvite !== null}
        onClose={() => setStudentToInvite(null)}
        targetStudent={studentToInvite}
        teams={teams}
        currentStudent={student}
        onSuccess={reloadData}
      />

      {/* Incoming Invitations Inbox Modal */}
      <InvitationsInboxModal
        isOpen={isInvitationsModalOpen}
        onClose={() => setIsInvitationsModalOpen(false)}
        invitations={invitations}
        onRefresh={reloadData}
      />

      {/* Event Registration & Digital Pass Modal */}
      <EventRegistrationModal
        isOpen={selectedEventForModal !== null}
        onClose={() => setSelectedEventForModal(null)}
        event={selectedEventForModal}
        student={student}
        onSuccess={reloadData}
      />

      {/* My Digital Event Passes Wallet Modal */}
      <MyEventPassesModal
        isOpen={isMyPassesModalOpen}
        onClose={() => setIsMyPassesModalOpen(false)}
        registrations={eventRegistrations}
        onRefresh={reloadData}
      />

      {/* Create Campus Event or Major Festival Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        festivals={festivals}
        onSuccess={reloadData}
      />

    </div>
  );
}
