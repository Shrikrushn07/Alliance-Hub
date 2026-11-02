import { 
  Opportunity, 
  Student, 
  CampusFestival, 
  CampusEvent, 
  EventRegistration, 
  FestivalAnnouncement,
  Application,
  EventVerificationStatus
} from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  universityId: string;
  departmentId: string;
  department: string;
  role: 'student' | 'organizer' | 'faculty' | 'admin';
  status?: 'active' | 'suspended';
  accountStatus: 'Active' | 'Suspended' | 'Pending Verification';
  avatar: string;
  title?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  targetEntity?: string;
  targetId?: string;
  details: any;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  roleTarget?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

class ApiService {
  private eventSource: EventSource | null = null;
  private listeners: Set<(event: any) => void> = new Set();
  private reconnectTimeout: any = null;

  constructor() {
    this.initRealtime();
  }

  // ==========================================
  // REAL-TIME SERVER-SENT EVENTS
  // ==========================================
  private initRealtime() {
    if (typeof window === 'undefined') return;

    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.eventSource = new EventSource('/api/realtime/events');

      this.eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          for (const listener of this.listeners) {
            listener(data);
          }
        } catch {
          // heartbeat or unparseable
        }
      };

      this.eventSource.onerror = () => {
        this.eventSource?.close();
        // Automatic reconnection backoff
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          this.initRealtime();
        }, 5000);
      };
    } catch (err) {
      console.warn('Realtime SSE not established, falling back to polling/local cache:', err);
    }
  }

  public subscribeRealtime(callback: (event: any) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // ==========================================
  // AUTHENTICATION & USER SESSIONS
  // ==========================================
  public async getCurrentUser(): Promise<{ user: AuthUser; permissions: string[] }> {
    const res = await fetch('/api/auth/current-user');
    if (!res.ok) throw new Error('Failed to get current user');
    return res.json();
  }

  public async switchUser(userId: string): Promise<{ success: boolean; user: AuthUser; permissions: string[] }> {
    const res = await fetch('/api/auth/switch-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to switch user');
    }
    return res.json();
  }

  public async getUsers(): Promise<AuthUser[]> {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    return data.users;
  }

  public async updateUserRole(userId: string, role: string): Promise<AuthUser> {
    const res = await fetch(`/api/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update user role');
    }
    const data = await res.json();
    return data.user;
  }

  public async updateUserStatus(userId: string, status: string): Promise<AuthUser> {
    const res = await fetch(`/api/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update user status');
    }
    const data = await res.json();
    return data.user;
  }

  // ==========================================
  // AUDIT LOGS & NOTIFICATIONS
  // ==========================================
  public async getAuditLogs(limit?: number): Promise<AuditLog[]> {
    const url = limit ? `/api/audit-logs?limit=${limit}` : '/api/audit-logs';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    const data = await res.json();
    return data.auditLogs;
  }

  public async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const data = await res.json();
    return data.notifications;
  }

  public async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
  }

  // ==========================================
  // OPPORTUNITIES
  // ==========================================
  public async getOpportunities(): Promise<Opportunity[]> {
    const res = await fetch('/api/opportunities');
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    const data = await res.json();
    return data.opportunities;
  }

  public async createOpportunity(opportunity: Opportunity): Promise<Opportunity> {
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opportunity)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to publish opportunity');
    }
    const data = await res.json();
    return data.opportunity;
  }

  public async verifyOpportunity(oppId: string, verified: boolean): Promise<Opportunity> {
    const res = await fetch(`/api/opportunities/${oppId}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to verify opportunity');
    }
    const data = await res.json();
    return data.opportunity;
  }

  // ==========================================
  // CAMPUS FESTIVALS
  // ==========================================
  public async getFestivals(): Promise<CampusFestival[]> {
    const res = await fetch('/api/festivals');
    if (!res.ok) throw new Error('Failed to fetch festivals');
    const data = await res.json();
    return data.festivals;
  }

  public async createFestival(festival: CampusFestival): Promise<CampusFestival> {
    const res = await fetch('/api/festivals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(festival)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create festival');
    }
    const data = await res.json();
    return data.festival;
  }

  public async verifyFestival(festId: string, status: EventVerificationStatus): Promise<CampusFestival> {
    const res = await fetch(`/api/festivals/${festId}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update festival status');
    }
    const data = await res.json();
    return data.festival;
  }

  public async broadcastFestivalAnnouncement(
    festivalId: string, 
    titleOrObj: string | { title: string; description: string; priority?: string; author?: string }, 
    description?: string
  ): Promise<FestivalAnnouncement> {
    const body = typeof titleOrObj === 'string'
      ? { title: titleOrObj, description: description || '' }
      : titleOrObj;

    const res = await fetch(`/api/festivals/${festivalId}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to broadcast announcement');
    }
    const data = await res.json();
    return data.announcement;
  }

  // ==========================================
  // CAMPUS EVENTS & SUB-EVENTS
  // ==========================================
  public async getEvents(): Promise<CampusEvent[]> {
    const res = await fetch('/api/events');
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();
    return data.events;
  }

  public async createEvent(event: CampusEvent): Promise<CampusEvent> {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create event');
    }
    const data = await res.json();
    return data.event;
  }

  public async verifyEvent(eventId: string, status: EventVerificationStatus): Promise<CampusEvent> {
    const res = await fetch(`/api/events/${eventId}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to verify event');
    }
    const data = await res.json();
    return data.event;
  }

  // ==========================================
  // EVENT REGISTRATIONS
  // ==========================================
  public async getRegistrations(): Promise<EventRegistration[]> {
    const res = await fetch('/api/registrations');
    if (!res.ok) throw new Error('Failed to fetch registrations');
    const data = await res.json();
    return data.registrations;
  }

  public async registerForEvent(eventId: string): Promise<EventRegistration> {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to register for event');
    }
    const data = await res.json();
    return data.registration;
  }

  public async cancelRegistration(registrationId: string): Promise<void> {
    const res = await fetch(`/api/registrations/${registrationId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to cancel registration');
  }

  // ==========================================
  // APPLICATIONS
  // ==========================================
  public async getApplications(): Promise<Application[]> {
    const res = await fetch('/api/applications');
    if (!res.ok) throw new Error('Failed to fetch applications');
    const data = await res.json();
    return data.applications;
  }

  public async createApplication(app: Application): Promise<Application> {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit application');
    }
    const data = await res.json();
    return data.application;
  }

  public async updateApplicationStatus(appId: string, status: string, notes?: string): Promise<Application> {
    const res = await fetch(`/api/applications/${appId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update application status');
    }
    const data = await res.json();
    return data.application;
  }
}

export const apiService = new ApiService();
