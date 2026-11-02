import fs from 'fs';
import path from 'path';
import { 
  Opportunity, 
  Student, 
  Team, 
  Application, 
  TeamInvitation, 
  CampusFestival, 
  CampusEvent, 
  EventRegistration, 
  FestivalAnnouncement,
  UserRole,
  EventVerificationStatus
} from '../src/types';
import { 
  CURRENT_STUDENT, 
  MOCK_OPPORTUNITIES, 
  MOCK_STUDENTS, 
  MOCK_TEAMS, 
  MOCK_APPLICATIONS, 
  MOCK_INVITATIONS 
} from '../src/data/mockData';
import { 
  INITIAL_FESTIVALS, 
  INITIAL_CAMPUS_EVENTS, 
  INITIAL_EVENT_REGISTRATIONS 
} from '../src/data/mockEventsData';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  universityId: string;
  departmentId: string;
  department: string;
  role: 'student' | 'organizer' | 'faculty' | 'admin';
  accountStatus: 'Active' | 'Suspended' | 'Pending Verification';
  avatar: string;
  title?: string;
  createdAt: string;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  facultyCoordinatorId: string;
  facultyCoordinatorName: string;
  activeOpportunitiesCount: number;
  activeEventsCount: number;
}

export interface AuditLogRecord {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  timestamp: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  roleTarget?: 'student' | 'organizer' | 'faculty' | 'admin' | 'all';
  type: 'opportunity' | 'event' | 'application' | 'team' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface DatabaseSchema {
  users: UserAccount[];
  departments: DepartmentRecord[];
  opportunities: Opportunity[];
  festivals: CampusFestival[];
  events: CampusEvent[];
  applications: Application[];
  registrations: EventRegistration[];
  teams: Team[];
  invitations: TeamInvitation[];
  notifications: NotificationRecord[];
  auditLogs: AuditLogRecord[];
  currentUserId: string;
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'alliance_hub_database.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(DB_FILE_PATH))) {
  fs.mkdirSync(path.dirname(DB_FILE_PATH), { recursive: true });
}

export const SEED_USERS: UserAccount[] = [
  {
    id: 'user-student-01',
    name: 'Shrikrushn Bhise',
    email: 'shrikrushn.btech23@alliance.edu.in',
    universityId: 'AU-2023-BTECH-0482',
    departmentId: 'dept-cse',
    department: 'Computer Science & Engineering',
    role: 'student',
    accountStatus: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    title: 'B.Tech CSE Student & Full-Stack Specialist',
    createdAt: '2023-08-15'
  },
  {
    id: 'user-organizer-01',
    name: 'Aditi Sharma',
    email: 'aditi.ecell@alliance.edu.in',
    universityId: 'AU-2022-BBA-0194',
    departmentId: 'dept-business',
    department: 'Alliance School of Business',
    role: 'organizer',
    accountStatus: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    title: 'Lead Convener · E-Cell Alliance & Cultural Syndicate',
    createdAt: '2022-09-01'
  },
  {
    id: 'user-faculty-01',
    name: 'Dr. Maya Sengupta',
    email: 'maya.sengupta@alliance.edu.in',
    universityId: 'AU-FAC-2019-032',
    departmentId: 'dept-humanities',
    department: 'School of Liberal Arts & Humanities',
    role: 'faculty',
    accountStatus: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580894732454-defa563b7696?auto=format&fit=crop&w=256&q=80',
    title: 'Associate Professor & Student Development Chair',
    createdAt: '2019-06-10'
  },
  {
    id: 'user-admin-01',
    name: 'Prof. Rajeshwara Rao',
    email: 'rajeshwara.rao@alliance.edu.in',
    universityId: 'AU-ADM-2015-001',
    departmentId: 'dept-admin',
    department: 'Office of the Vice Chancellor & Dean of Academic Affairs',
    role: 'admin',
    accountStatus: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    title: 'Dean of Academic Affairs & Platform Controller',
    createdAt: '2015-04-01'
  }
];

export const SEED_DEPARTMENTS: DepartmentRecord[] = [
  {
    id: 'dept-cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    facultyCoordinatorId: 'user-faculty-01',
    facultyCoordinatorName: 'Dr. K.S. Murthy',
    activeOpportunitiesCount: 8,
    activeEventsCount: 6
  },
  {
    id: 'dept-business',
    name: 'Alliance School of Business',
    code: 'ASOB',
    facultyCoordinatorId: 'user-faculty-01',
    facultyCoordinatorName: 'Prof. Ananya Roy',
    activeOpportunitiesCount: 5,
    activeEventsCount: 4
  },
  {
    id: 'dept-law',
    name: 'Alliance School of Law',
    code: 'ASOL',
    facultyCoordinatorId: 'user-faculty-01',
    facultyCoordinatorName: 'Dr. Vikramaditya Prasad',
    activeOpportunitiesCount: 3,
    activeEventsCount: 2
  },
  {
    id: 'dept-humanities',
    name: 'School of Liberal Arts & Humanities',
    code: 'SLAH',
    facultyCoordinatorId: 'user-faculty-01',
    facultyCoordinatorName: 'Dr. Maya Sengupta',
    activeOpportunitiesCount: 4,
    activeEventsCount: 5
  },
  {
    id: 'dept-aero',
    name: 'Department of Aerospace Engineering',
    code: 'AERO',
    facultyCoordinatorId: 'user-faculty-01',
    facultyCoordinatorName: 'Dr. Sharan Kumar',
    activeOpportunitiesCount: 3,
    activeEventsCount: 2
  }
];

export const SEED_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-1',
    userId: 'user-student-01',
    roleTarget: 'student',
    type: 'opportunity',
    title: 'New Research Fellowship Published',
    message: 'Autonomous Rover Perception Fellowship is now open for CSE/AERO applicants.',
    read: false,
    link: 'opportunities',
    createdAt: '2026-04-01T10:00:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-student-01',
    roleTarget: 'student',
    type: 'event',
    title: 'Alliance ONE 2026 Registrations Open',
    message: 'Digital passes for Midnight Hack-a-Sprint and Battle of Bands are live.',
    read: false,
    link: 'events',
    createdAt: '2026-04-02T14:30:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-organizer-01',
    roleTarget: 'organizer',
    type: 'application',
    title: 'New Applicant for PulseMesh',
    message: 'Shrikrushn Bhise applied for Frontend & Systems Specialist on PulseMesh Squad.',
    read: true,
    link: 'organizer',
    createdAt: '2026-04-03T16:00:00Z'
  }
];

export const SEED_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'audit-1',
    actorId: 'user-admin-01',
    actorName: 'Prof. Rajeshwara Rao',
    actorRole: 'admin',
    action: 'VERIFY_FESTIVAL',
    resourceType: 'CampusFestival',
    resourceId: 'fest-alliance-one',
    details: 'Verified and published official festival calendar for Alliance ONE 2026.',
    timestamp: '2026-04-01T09:15:00Z'
  },
  {
    id: 'audit-2',
    actorId: 'user-admin-01',
    actorName: 'Prof. Rajeshwara Rao',
    actorRole: 'admin',
    action: 'VERIFY_OPPORTUNITY',
    resourceType: 'Opportunity',
    resourceId: 'opp-1',
    details: 'Verified Alliance National Innovation Hackathon 2026 under CED accreditation.',
    timestamp: '2026-04-02T11:20:00Z'
  },
  {
    id: 'audit-3',
    actorId: 'user-organizer-01',
    actorName: 'Aditi Sharma',
    actorRole: 'organizer',
    action: 'CREATE_SUB_EVENT',
    resourceType: 'CampusEvent',
    resourceId: 'evt-one-hackasprint',
    details: 'Submitted Midnight Hack-a-Sprint under Alliance ONE 2026 umbrella.',
    timestamp: '2026-04-03T15:45:00Z'
  }
];

class DatabaseEngine {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading database file, initializing seeds:', err);
    }

    const initialData: DatabaseSchema = {
      users: SEED_USERS,
      departments: SEED_DEPARTMENTS,
      opportunities: MOCK_OPPORTUNITIES,
      festivals: INITIAL_FESTIVALS,
      events: INITIAL_CAMPUS_EVENTS,
      applications: MOCK_APPLICATIONS,
      registrations: INITIAL_EVENT_REGISTRATIONS,
      teams: MOCK_TEAMS,
      invitations: MOCK_INVITATIONS,
      notifications: SEED_NOTIFICATIONS,
      auditLogs: SEED_AUDIT_LOGS,
      currentUserId: 'user-student-01'
    };

    this.saveDatabase(initialData);
    return initialData;
  }

  private saveDatabase(dataToSave?: DatabaseSchema): void {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Current authenticated user session
  public getCurrentUser(): UserAccount {
    const user = this.data.users.find(u => u.id === this.data.currentUserId);
    return user || this.data.users[0];
  }

  public setCurrentUser(userId: string): UserAccount {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    this.data.currentUserId = user.id;
    this.saveDatabase();
    return user;
  }

  public getUsers(): UserAccount[] {
    return this.data.users;
  }

  public getUserById(id: string): UserAccount | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public updateUserRole(userId: string, newRole: 'student' | 'organizer' | 'faculty' | 'admin', actor: UserAccount): UserAccount {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const oldRole = user.role;
    user.role = newRole;

    this.logAudit(
      actor,
      'ROLE_ASSIGNMENT',
      'User',
      user.id,
      `Promoted/changed role for ${user.name} (${user.email}) from ${oldRole} to ${newRole}.`
    );

    this.saveDatabase();
    return user;
  }

  public updateUserStatus(userId: string, status: 'Active' | 'Suspended' | 'Pending Verification', actor: UserAccount): UserAccount {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    user.accountStatus = status;
    this.logAudit(
      actor,
      'ACCOUNT_STATUS_CHANGE',
      'User',
      user.id,
      `Changed account status for ${user.name} to ${status}.`
    );

    this.saveDatabase();
    return user;
  }

  // Audit Logs
  public getAuditLogs(): AuditLogRecord[] {
    return this.data.auditLogs;
  }

  public logAudit(actor: UserAccount, action: string, resourceType: string, resourceId: string, details: string): AuditLogRecord {
    const log: AuditLogRecord = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action,
      resourceType,
      resourceId,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    this.saveDatabase();
    return log;
  }

  // Notifications
  public getNotifications(userId: string, userRole: string): NotificationRecord[] {
    return this.data.notifications.filter(n => 
      n.userId === userId || n.roleTarget === userRole || n.roleTarget === 'all'
    );
  }

  public addNotification(notif: Omit<NotificationRecord, 'id' | 'createdAt' | 'read'>): NotificationRecord {
    const newNotif: NotificationRecord = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.unshift(newNotif);
    this.saveDatabase();
    return newNotif;
  }

  public markNotificationRead(notifId: string): void {
    const notif = this.data.notifications.find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      this.saveDatabase();
    }
  }

  // Opportunities
  public getOpportunities(role: string, department?: string): Opportunity[] {
    if (role === 'student') {
      // Students only see verified and published opportunities
      return this.data.opportunities.filter(o => o.verified !== false);
    }
    if (role === 'faculty' && department) {
      return this.data.opportunities.filter(o => 
        o.department.toLowerCase().includes(department.toLowerCase()) || 
        o.department === 'Cross-Disciplinary'
      );
    }
    // Admin and Organizer see all listings
    return this.data.opportunities;
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    return this.data.opportunities.find(o => o.id === id);
  }

  public createOpportunity(opp: Opportunity, actor: UserAccount): Opportunity {
    // If published by admin or authorized faculty, can auto-verify; if by student club/organizer, sets to pending verification
    const isVerified = actor.role === 'admin';
    const newOpp: Opportunity = {
      ...opp,
      verified: isVerified,
      totalApplicants: 0
    };
    this.data.opportunities.unshift(newOpp);

    this.logAudit(
      actor,
      'CREATE_OPPORTUNITY',
      'Opportunity',
      newOpp.id,
      `Published "${newOpp.title}" under ${newOpp.category} (Verified: ${isVerified}).`
    );

    this.saveDatabase();
    return newOpp;
  }

  public verifyOpportunity(oppId: string, verified: boolean, actor: UserAccount): Opportunity {
    const opp = this.data.opportunities.find(o => o.id === oppId);
    if (!opp) throw new Error('Opportunity not found');

    opp.verified = verified;
    this.logAudit(
      actor,
      verified ? 'VERIFY_OPPORTUNITY' : 'REJECT_OPPORTUNITY',
      'Opportunity',
      opp.id,
      `${verified ? 'Approved and accredited' : 'Rejected'} opportunity: "${opp.title}".`
    );

    this.saveDatabase();
    return opp;
  }

  // Campus Festivals
  public getFestivals(role: string): CampusFestival[] {
    if (role === 'student') {
      return this.data.festivals.filter(f => f.publicationStatus === 'Published');
    }
    return this.data.festivals;
  }

  public getFestivalById(id: string): CampusFestival | undefined {
    return this.data.festivals.find(f => f.id === id);
  }

  public createFestival(fest: CampusFestival, actor: UserAccount): CampusFestival {
    const isVerified = actor.role === 'admin';
    const newFest: CampusFestival = {
      ...fest,
      verificationStatus: isVerified ? 'Verified' : 'Pending Verification',
      publicationStatus: isVerified ? 'Published' : 'Draft'
    };
    this.data.festivals.unshift(newFest);

    this.logAudit(
      actor,
      'CREATE_FESTIVAL',
      'CampusFestival',
      newFest.id,
      `Created major festival "${newFest.title}" (${newFest.startDate} – ${newFest.endDate}).`
    );

    this.saveDatabase();
    return newFest;
  }

  public verifyFestival(festId: string, status: EventVerificationStatus, actor: UserAccount): CampusFestival {
    const fest = this.data.festivals.find(f => f.id === festId);
    if (!fest) throw new Error('Festival not found');

    fest.verificationStatus = status;
    if (status === 'Verified') {
      fest.publicationStatus = 'Published';
    }

    this.logAudit(
      actor,
      'UPDATE_FESTIVAL_STATUS',
      'CampusFestival',
      fest.id,
      `Updated festival verification to ${status} for "${fest.title}".`
    );

    this.saveDatabase();
    return fest;
  }

  public addFestivalAnnouncement(ann: FestivalAnnouncement, actor: UserAccount): FestivalAnnouncement {
    const fest = this.data.festivals.find(f => f.id === ann.festivalId);
    if (fest) {
      fest.announcements = [ann, ...(fest.announcements || [])];
      this.logAudit(
        actor,
        'POST_ANNOUNCEMENT',
        'FestivalAnnouncement',
        ann.id,
        `Broadcast announcement "${ann.title}" for festival ${fest.title}.`
      );
      this.saveDatabase();
    }
    return ann;
  }

  // Campus Events / Sub-Events
  public getEvents(role: string, department?: string): CampusEvent[] {
    if (role === 'student') {
      return this.data.events.filter(e => e.publicationStatus === 'Published');
    }
    if (role === 'faculty' && department) {
      return this.data.events.filter(e => 
        !e.organizerDepartment || 
        e.organizerDepartment.toLowerCase().includes(department.toLowerCase())
      );
    }
    return this.data.events;
  }

  public getEventById(id: string): CampusEvent | undefined {
    return this.data.events.find(e => e.id === id);
  }

  public createEvent(evt: CampusEvent, actor: UserAccount): CampusEvent {
    const isVerified = actor.role === 'admin';
    const newEvent: CampusEvent = {
      ...evt,
      verificationStatus: isVerified ? 'Verified' : 'Pending Verification',
      publicationStatus: isVerified ? 'Published' : 'Draft',
      totalRegistrations: 0
    };
    this.data.events.unshift(newEvent);

    this.logAudit(
      actor,
      'CREATE_EVENT',
      'CampusEvent',
      newEvent.id,
      `Created event "${newEvent.title}" under category ${newEvent.category}.`
    );

    this.saveDatabase();
    return newEvent;
  }

  public verifyEvent(eventId: string, status: EventVerificationStatus, actor: UserAccount): CampusEvent {
    const evt = this.data.events.find(e => e.id === eventId);
    if (!evt) throw new Error('Event not found');

    evt.verificationStatus = status;
    if (status === 'Verified') {
      evt.publicationStatus = 'Published';
    }

    this.logAudit(
      actor,
      'UPDATE_EVENT_STATUS',
      'CampusEvent',
      evt.id,
      `Updated event status to ${status} for "${evt.title}".`
    );

    this.saveDatabase();
    return evt;
  }

  // Event Registrations
  public getRegistrations(userId?: string): EventRegistration[] {
    if (userId) {
      return this.data.registrations.filter(r => r.studentId === userId);
    }
    return this.data.registrations;
  }

  public registerForEvent(event: CampusEvent, student: UserAccount): EventRegistration {
    const existing = this.data.registrations.find(r => r.eventId === event.id && r.studentId === student.id);
    if (existing && existing.registrationStatus === 'Confirmed') {
      return existing;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      eventId: event.id,
      eventTitle: event.title,
      festivalId: event.festivalId,
      festivalTitle: event.festivalTitle,
      category: event.category,
      startDatetime: event.startDatetime,
      venue: event.venue,
      registrationStatus: 'Confirmed',
      registeredAt: new Date().toISOString(),
      ticketCode: `AL-FEST-2026-${randomSuffix}`
    };

    this.data.registrations.unshift(newReg);

    // Update event registration count
    const targetEvt = this.data.events.find(e => e.id === event.id);
    if (targetEvt) {
      targetEvt.totalRegistrations = (targetEvt.totalRegistrations || 0) + 1;
    }

    this.logAudit(
      student,
      'EVENT_REGISTRATION',
      'EventRegistration',
      newReg.id,
      `Registered for event "${event.title}" (Ticket: ${newReg.ticketCode}).`
    );

    this.saveDatabase();
    return newReg;
  }

  public cancelRegistration(registrationId: string, actor: UserAccount): void {
    const reg = this.data.registrations.find(r => r.id === registrationId);
    if (reg) {
      reg.registrationStatus = 'Cancelled';
      this.logAudit(
        actor,
        'CANCEL_REGISTRATION',
        'EventRegistration',
        reg.id,
        `Cancelled registration for "${reg.eventTitle}".`
      );
      this.saveDatabase();
    }
  }

  // Applications
  public getApplications(userId?: string): Application[] {
    if (userId) {
      return this.data.applications;
    }
    return this.data.applications;
  }

  public createApplication(app: Application, actor: UserAccount): Application {
    this.data.applications.unshift(app);
    this.logAudit(
      actor,
      'SUBMIT_APPLICATION',
      'Application',
      app.id,
      `Applied to opportunity: "${app.opportunityTitle}".`
    );
    this.saveDatabase();
    return app;
  }

  public updateApplicationStatus(appId: string, status: any, notes?: string, actor?: UserAccount): Application {
    const app = this.data.applications.find(a => a.id === appId);
    if (!app) throw new Error('Application not found');

    app.status = status;
    if (notes) app.notes = notes;
    if (!app.history) app.history = [];
    app.history.unshift({
      status,
      date: new Date().toISOString().split('T')[0],
      note: notes || `Moved to ${status}`
    });

    if (actor) {
      this.logAudit(
        actor,
        'UPDATE_APPLICATION_STATUS',
        'Application',
        app.id,
        `Updated status to ${status} for "${app.opportunityTitle}".`
      );
    }

    this.saveDatabase();
    return app;
  }

  // Departments
  public getDepartments(): DepartmentRecord[] {
    return this.data.departments;
  }
}

export const serverDb = new DatabaseEngine();
