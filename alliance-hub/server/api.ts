import { Router, Request, Response, NextFunction } from 'express';
import { serverDb, UserAccount } from './db';
import { realtimeHub } from './realtime';

export const apiRouter = Router();

// Extend Express Request with UserAccount
export interface AuthenticatedRequest extends Request {
  user?: UserAccount;
}

// Authentication & Session Middleware
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = serverDb.getCurrentUser();
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: No active session' });
  }
};

// Role-Based Authorization Guard Middleware
export const requireRole = (allowedRoles: Array<'student' | 'organizer' | 'faculty' | 'admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      serverDb.logAudit(
        req.user,
        'SECURITY_ACCESS_DENIED',
        'Endpoint',
        req.originalUrl,
        `Attempted unauthorized access to ${req.originalUrl}. Required: ${allowedRoles.join(', ')}. Actual: ${req.user.role}.`
      );

      return res.status(403).json({
        error: 'Forbidden: Insufficient privileges',
        requiredRoles: allowedRoles,
        userRole: req.user.role,
        message: `Your current role (${req.user.role}) does not possess authorization to execute this action.`
      });
    }

    next();
  };
};

apiRouter.use(authenticate);

// ==========================================
// REAL-TIME SSE ENDPOINT
// ==========================================
apiRouter.get('/realtime/events', (req: Request, res: Response) => {
  realtimeHub.registerClient(res);
});

// ==========================================
// AUTHENTICATION & USER MANAGEMENT
// ==========================================
apiRouter.get('/auth/current-user', (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: req.user,
    permissions: getPermissionsForRole(req.user?.role || 'student')
  });
});

apiRouter.post('/auth/switch-user', (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const switched = serverDb.setCurrentUser(userId);
    realtimeHub.broadcast('ROLE_UPDATED', { user: switched });
    res.json({
      success: true,
      user: switched,
      permissions: getPermissionsForRole(switched.role)
    });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

apiRouter.get('/users', requireRole(['admin', 'faculty']), (req: AuthenticatedRequest, res: Response) => {
  res.json({ users: serverDb.getUsers() });
});

apiRouter.put('/users/:id/role', requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { role } = req.body;
  if (!role || !['student', 'organizer', 'faculty', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Valid role is required' });
  }

  try {
    const updated = serverDb.updateUserRole(req.params.id, role, req.user!);
    realtimeHub.broadcast('ROLE_UPDATED', { user: updated });
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

apiRouter.put('/users/:id/status', requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  if (!status || !['Active', 'Suspended', 'Pending Verification'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }

  try {
    const updated = serverDb.updateUserStatus(req.params.id, status, req.user!);
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// ==========================================
// AUDIT LOGS & DEPARTMENTS
// ==========================================
apiRouter.get('/audit-logs', requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  res.json({ auditLogs: serverDb.getAuditLogs() });
});

apiRouter.get('/departments', (req: Request, res: Response) => {
  res.json({ departments: serverDb.getDepartments() });
});

// ==========================================
// NOTIFICATIONS
// ==========================================
apiRouter.get('/notifications', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({ notifications: serverDb.getNotifications(user.id, user.role) });
});

apiRouter.put('/notifications/:id/read', (req: AuthenticatedRequest, res: Response) => {
  serverDb.markNotificationRead(req.params.id);
  res.json({ success: true });
});

// ==========================================
// OPPORTUNITIES (PUBLISHING & VERIFICATION)
// ==========================================
apiRouter.get('/opportunities', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const opps = serverDb.getOpportunities(user.role, user.department);
  res.json({ opportunities: opps });
});

apiRouter.get('/opportunities/:id', (req: Request, res: Response) => {
  const opp = serverDb.getOpportunityById(req.params.id);
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
  res.json({ opportunity: opp });
});

apiRouter.post('/opportunities', requireRole(['organizer', 'faculty', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const oppData = req.body;
  const actor = req.user!;

  if (!oppData.title || !oppData.category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  const created = serverDb.createOpportunity(oppData, actor);

  // Real-time broadcast
  realtimeHub.broadcast('OPPORTUNITY_CREATED', { opportunity: created, actor: actor.name });

  // Add system notification for students if published or admins if pending
  if (created.verified) {
    serverDb.addNotification({
      userId: 'all',
      roleTarget: 'student',
      type: 'opportunity',
      title: 'New Opportunity Published',
      message: `${created.title} has been published by ${created.organizer}.`,
      link: 'opportunities'
    });
  } else {
    serverDb.addNotification({
      userId: 'all',
      roleTarget: 'admin',
      type: 'opportunity',
      title: 'Opportunity Awaiting Verification',
      message: `${created.title} submitted by ${created.organizer} requires administrative accreditation.`,
      link: 'admin'
    });
  }

  res.status(201).json({ success: true, opportunity: created });
});

apiRouter.put('/opportunities/:id/verify', requireRole(['admin', 'faculty']), (req: AuthenticatedRequest, res: Response) => {
  const { verified } = req.body;
  const actor = req.user!;

  try {
    const opp = serverDb.verifyOpportunity(req.params.id, Boolean(verified), actor);
    realtimeHub.broadcast('OPPORTUNITY_VERIFIED', { opportunity: opp, verified: Boolean(verified) });

    if (verified) {
      serverDb.addNotification({
        userId: 'all',
        roleTarget: 'student',
        type: 'opportunity',
        title: 'New Opportunity Accredited',
        message: `${opp.title} was verified and is now open for applications.`,
        link: 'opportunities'
      });
    }

    res.json({ success: true, opportunity: opp });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// ==========================================
// CAMPUS FESTIVALS & ANNOUNCEMENTS
// ==========================================
apiRouter.get('/festivals', (req: AuthenticatedRequest, res: Response) => {
  res.json({ festivals: serverDb.getFestivals(req.user?.role || 'student') });
});

apiRouter.get('/festivals/:id', (req: Request, res: Response) => {
  const fest = serverDb.getFestivalById(req.params.id);
  if (!fest) return res.status(404).json({ error: 'Festival not found' });
  res.json({ festival: fest });
});

apiRouter.post('/festivals', requireRole(['organizer', 'faculty', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const festData = req.body;
  const actor = req.user!;

  const created = serverDb.createFestival(festData, actor);
  realtimeHub.broadcast('FESTIVAL_CREATED', { festival: created });

  res.status(201).json({ success: true, festival: created });
});

apiRouter.put('/festivals/:id/verify', requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const actor = req.user!;

  try {
    const fest = serverDb.verifyFestival(req.params.id, status, actor);
    realtimeHub.broadcast('FESTIVAL_VERIFIED', { festival: fest });

    serverDb.addNotification({
      userId: 'all',
      roleTarget: 'student',
      type: 'event',
      title: 'Official Campus Festival Verified',
      message: `${fest.title} (${fest.startDate} – ${fest.endDate}) is officially published.`,
      link: 'events'
    });

    res.json({ success: true, festival: fest });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

apiRouter.post('/festivals/:id/announcements', requireRole(['organizer', 'faculty', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const { title, description } = req.body;
  const actor = req.user!;

  const ann = serverDb.addFestivalAnnouncement({
    id: `ann-${Date.now()}`,
    festivalId: req.params.id,
    title: title.trim(),
    description: description.trim(),
    publishedAt: new Date().toISOString().split('T')[0],
    priority: 'Normal',
    author: `${actor.name} (${actor.role})`
  }, actor);

  realtimeHub.broadcast('ANNOUNCEMENT_BROADCAST', { announcement: ann });

  serverDb.addNotification({
    userId: 'all',
    roleTarget: 'student',
    type: 'event',
    title: `Bulletin: ${ann.title}`,
    message: ann.description,
    link: 'events'
  });

  res.status(201).json({ success: true, announcement: ann });
});

// ==========================================
// CAMPUS EVENTS & SUB-EVENTS
// ==========================================
apiRouter.get('/events', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({ events: serverDb.getEvents(user.role, user.department) });
});

apiRouter.get('/events/:id', (req: Request, res: Response) => {
  const evt = serverDb.getEventById(req.params.id);
  if (!evt) return res.status(404).json({ error: 'Event not found' });
  res.json({ event: evt });
});

apiRouter.post('/events', requireRole(['organizer', 'faculty', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const evtData = req.body;
  const actor = req.user!;

  const created = serverDb.createEvent(evtData, actor);
  realtimeHub.broadcast('EVENT_CREATED', { event: created });

  res.status(201).json({ success: true, event: created });
});

apiRouter.put('/events/:id/verify', requireRole(['admin', 'faculty']), (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const actor = req.user!;

  try {
    const evt = serverDb.verifyEvent(req.params.id, status, actor);
    realtimeHub.broadcast('EVENT_VERIFIED', { event: evt });
    res.json({ success: true, event: evt });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// ==========================================
// EVENT REGISTRATIONS & PASSES
// ==========================================
apiRouter.get('/registrations', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const regs = user.role === 'student' 
    ? serverDb.getRegistrations(user.id) 
    : serverDb.getRegistrations();
  res.json({ registrations: regs });
});

apiRouter.post('/registrations', (req: AuthenticatedRequest, res: Response) => {
  const { eventId } = req.body;
  const user = req.user!;

  const evt = serverDb.getEventById(eventId);
  if (!evt) return res.status(404).json({ error: 'Event not found' });

  const reg = serverDb.registerForEvent(evt, user);
  realtimeHub.broadcast('EVENT_REGISTERED', { registration: reg, eventId: evt.id });

  res.status(201).json({ success: true, registration: reg });
});

apiRouter.delete('/registrations/:id', (req: AuthenticatedRequest, res: Response) => {
  serverDb.cancelRegistration(req.params.id, req.user!);
  res.json({ success: true });
});

// ==========================================
// APPLICATIONS
// ==========================================
apiRouter.get('/applications', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const apps = user.role === 'student' 
    ? serverDb.getApplications(user.id) 
    : serverDb.getApplications();
  res.json({ applications: apps });
});

apiRouter.post('/applications', (req: AuthenticatedRequest, res: Response) => {
  const appData = req.body;
  const user = req.user!;

  const created = serverDb.createApplication(appData, user);
  realtimeHub.broadcast('APPLICATION_SUBMITTED', { application: created });

  res.status(201).json({ success: true, application: created });
});

apiRouter.put('/applications/:id/status', requireRole(['organizer', 'faculty', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const { status, notes } = req.body;
  const actor = req.user!;

  try {
    const updated = serverDb.updateApplicationStatus(req.params.id, status, notes, actor);
    realtimeHub.broadcast('APPLICATION_STATUS_UPDATED', { application: updated });
    res.json({ success: true, application: updated });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

function getPermissionsForRole(role: string): string[] {
  switch (role) {
    case 'admin':
      return [
        'manage_users', 'assign_roles', 'verify_opportunities', 'verify_festivals',
        'verify_events', 'publish_official_circulars', 'view_all_analytics', 'view_audit_logs',
        'manage_departments'
      ];
    case 'faculty':
      return [
        'publish_department_opportunities', 'verify_department_events', 'view_department_analytics',
        'view_student_participation', 'broadcast_department_bulletins'
      ];
    case 'organizer':
      return [
        'create_opportunities', 'create_festivals', 'create_events', 'manage_own_registrations',
        'review_applicants', 'broadcast_festival_bulletins'
      ];
    default:
      return [
        'browse_published_content', 'save_items', 'apply_opportunities', 'register_events',
        'create_teams', 'join_teams', 'manage_portfolio'
      ];
  }
}
