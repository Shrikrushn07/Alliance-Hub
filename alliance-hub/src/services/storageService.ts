import { 
  Opportunity, 
  Student, 
  Team, 
  Application, 
  ApplicationStatus,
  TeamInvitation,
  MatchAnalysis,
  CampusFestival,
  CampusEvent,
  EventRegistration,
  FestivalAnnouncement,
  EventVerificationStatus
} from '../types';
import { 
  CURRENT_STUDENT, 
  MOCK_OPPORTUNITIES, 
  MOCK_STUDENTS, 
  MOCK_TEAMS, 
  MOCK_APPLICATIONS,
  MOCK_INVITATIONS 
} from '../data/mockData';
import {
  INITIAL_FESTIVALS,
  INITIAL_CAMPUS_EVENTS,
  INITIAL_EVENT_REGISTRATIONS
} from '../data/mockEventsData';

const STORAGE_KEYS = {
  SAVED_OPPORTUNITIES: 'alliance_saved_opportunities',
  APPLICATIONS: 'alliance_applications',
  TEAMS: 'alliance_teams',
  STUDENT_PROFILE: 'alliance_current_student',
  PUBLISHED_OPPORTUNITIES: 'alliance_published_opportunities',
  CONNECTIONS: 'alliance_connected_students',
  INVITATIONS: 'alliance_team_invitations',
  FESTIVALS: 'alliance_campus_festivals',
  CAMPUS_EVENTS: 'alliance_campus_events',
  EVENT_REGISTRATIONS: 'alliance_event_registrations',
  SAVED_EVENTS: 'alliance_saved_events'
};

export const storageService = {
  // Opportunities
  getOpportunities(): Opportunity[] {
    const publishedRaw = localStorage.getItem(STORAGE_KEYS.PUBLISHED_OPPORTUNITIES);
    const published: Opportunity[] = publishedRaw ? JSON.parse(publishedRaw) : [];
    return [...MOCK_OPPORTUNITIES, ...published];
  },

  getOpportunityById(id: string): Opportunity | undefined {
    return this.getOpportunities().find(o => o.id === id);
  },

  addOpportunity(opportunity: Opportunity): void {
    const existingRaw = localStorage.getItem(STORAGE_KEYS.PUBLISHED_OPPORTUNITIES);
    const existing: Opportunity[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(opportunity);
    localStorage.setItem(STORAGE_KEYS.PUBLISHED_OPPORTUNITIES, JSON.stringify(existing));
  },

  // Saved Opportunities
  getSavedOpportunityIds(): string[] {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_OPPORTUNITIES);
    if (!saved) {
      const initial = ['opp-2', 'opp-4'];
      localStorage.setItem(STORAGE_KEYS.SAVED_OPPORTUNITIES, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(saved);
  },

  toggleSaveOpportunity(id: string): boolean {
    const saved = this.getSavedOpportunityIds();
    const index = saved.indexOf(id);
    let isSavedNow = false;
    if (index > -1) {
      saved.splice(index, 1);
      isSavedNow = false;
    } else {
      saved.push(id);
      isSavedNow = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_OPPORTUNITIES, JSON.stringify(saved));
    return isSavedNow;
  },

  isOpportunitySaved(id: string): boolean {
    return this.getSavedOpportunityIds().includes(id);
  },

  // Applications
  getApplications(): Application[] {
    const apps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!apps) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(MOCK_APPLICATIONS));
      return MOCK_APPLICATIONS;
    }
    return JSON.parse(apps);
  },

  updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string): void {
    const apps = this.getApplications();
    const updated = apps.map(app => {
      if (app.id === id) {
        const history = app.history || [];
        history.push({
          status,
          date: new Date().toISOString().split('T')[0],
          note: notes || `Moved to ${status}`
        });

        return {
          ...app,
          status,
          notes: notes !== undefined ? notes : app.notes,
          history
        };
      }
      return app;
    });
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
  },

  applyToOpportunity(opportunity: Opportunity, notes?: string): Application {
    const apps = this.getApplications();
    const existing = apps.find(a => a.opportunityId === opportunity.id);
    const today = new Date().toISOString().split('T')[0];

    if (existing) {
      existing.status = 'Applied';
      if (notes) existing.notes = notes;
      existing.history = existing.history || [];
      existing.history.push({
        status: 'Applied',
        date: today,
        note: notes || 'Updated submission via Alliance Hub.'
      });
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      return existing;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      organizer: opportunity.organizer,
      category: opportunity.category,
      appliedDate: today,
      deadline: opportunity.deadline,
      status: 'Applied',
      notes: notes || 'Direct submission through Alliance Hub portal.',
      externalLink: opportunity.externalUrl,
      history: [
        {
          status: 'Applied',
          date: today,
          note: notes || 'Submitted initial application packet'
        }
      ]
    };

    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    return newApp;
  },

  // Teams
  getTeams(): Team[] {
    const teams = localStorage.getItem(STORAGE_KEYS.TEAMS);
    if (!teams) {
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(MOCK_TEAMS));
      return MOCK_TEAMS;
    }
    return JSON.parse(teams);
  },

  createTeam(team: Team): void {
    const teams = this.getTeams();
    teams.unshift(team);
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  },

  // Team Invitations
  getInvitations(): TeamInvitation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(MOCK_INVITATIONS));
      return MOCK_INVITATIONS;
    }
    return JSON.parse(raw);
  },

  sendInvitation(invitation: Omit<TeamInvitation, 'id' | 'date' | 'status'>): TeamInvitation {
    const invs = this.getInvitations();
    const newInv: TeamInvitation = {
      ...invitation,
      id: `inv-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    invs.unshift(newInv);
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invs));
    return newInv;
  },

  respondToInvitation(invitationId: string, response: 'Accepted' | 'Declined'): void {
    const invs = this.getInvitations();
    const target = invs.find(i => i.id === invitationId);
    if (!target) return;

    target.status = response;
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invs));

    // If accepted, add current student to the team roster
    if (response === 'Accepted') {
      const student = this.getCurrentStudent();
      const teams = this.getTeams();
      const team = teams.find(t => t.id === target.teamId);
      if (team) {
        const isAlreadyMember = team.members.some(m => m.studentId === student.id);
        if (!isAlreadyMember) {
          team.members.push({
            studentId: student.id,
            name: student.name,
            role: target.roleName,
            avatar: student.avatar,
            department: student.department
          });

          // Mark corresponding position filled if found
          const matchingPos = team.openPositions.find(p => p.title.toLowerCase() === target.roleName.toLowerCase() && p.status === 'Open');
          if (matchingPos) {
            matchingPos.status = 'Filled';
          }
          localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
        }
      }
    }
  },

  // Students & Profile
  getCurrentStudent(): Student {
    const student = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
    if (!student) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(CURRENT_STUDENT));
      return CURRENT_STUDENT;
    }
    return JSON.parse(student);
  },

  updateStudentProfile(updated: Student): void {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(updated));
  },

  getAllStudents(): Student[] {
    const current = this.getCurrentStudent();
    const others = MOCK_STUDENTS.filter(s => s.id !== current.id);
    return [current, ...others];
  },

  // Connections
  getConnections(): string[] {
    const conns = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
    return conns ? JSON.parse(conns) : ['student-4'];
  },

  toggleConnect(studentId: string): boolean {
    const conns = this.getConnections();
    const idx = conns.indexOf(studentId);
    let isConnected = false;
    if (idx > -1) {
      conns.splice(idx, 1);
      isConnected = false;
    } else {
      conns.push(studentId);
      isConnected = true;
    }
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(conns));
    return isConnected;
  },

  isStudentConnected(studentId: string): boolean {
    return this.getConnections().includes(studentId);
  },

  // Campus Festivals
  getFestivals(): CampusFestival[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FESTIVALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(INITIAL_FESTIVALS));
      return INITIAL_FESTIVALS;
    }
    return JSON.parse(raw);
  },

  getFestivalBySlug(slug: string): CampusFestival | undefined {
    return this.getFestivals().find(f => f.slug === slug);
  },

  getFestivalById(id: string): CampusFestival | undefined {
    return this.getFestivals().find(f => f.id === id);
  },

  addFestival(festival: CampusFestival): void {
    const festivals = this.getFestivals();
    festivals.unshift(festival);
    localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(festivals));
  },

  updateFestival(updated: CampusFestival): void {
    const festivals = this.getFestivals();
    const idx = festivals.findIndex(f => f.id === updated.id);
    if (idx > -1) {
      festivals[idx] = updated;
      localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(festivals));
    }
  },

  addFestivalAnnouncement(announcement: FestivalAnnouncement): void {
    const festivals = this.getFestivals();
    const fest = festivals.find(f => f.id === announcement.festivalId);
    if (fest) {
      fest.announcements = [announcement, ...(fest.announcements || [])];
      localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(festivals));
    }
  },

  // Campus Events & Sub-Events
  getEvents(): CampusEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPUS_EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CAMPUS_EVENTS, JSON.stringify(INITIAL_CAMPUS_EVENTS));
      return INITIAL_CAMPUS_EVENTS;
    }
    return JSON.parse(raw);
  },

  getEventById(id: string): CampusEvent | undefined {
    return this.getEvents().find(e => e.id === id);
  },

  getEventsByFestivalId(festivalId: string): CampusEvent[] {
    return this.getEvents().filter(e => e.festivalId === festivalId);
  },

  addEvent(event: CampusEvent): void {
    const events = this.getEvents();
    events.unshift(event);
    localStorage.setItem(STORAGE_KEYS.CAMPUS_EVENTS, JSON.stringify(events));
  },

  updateEvent(updated: CampusEvent): void {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === updated.id);
    if (idx > -1) {
      events[idx] = updated;
      localStorage.setItem(STORAGE_KEYS.CAMPUS_EVENTS, JSON.stringify(events));
    }
  },

  updateEventVerification(eventId: string, status: EventVerificationStatus): void {
    const events = this.getEvents();
    const target = events.find(e => e.id === eventId);
    if (target) {
      target.verificationStatus = status;
      if (status === 'Verified') {
        target.publicationStatus = 'Published';
      }
      localStorage.setItem(STORAGE_KEYS.CAMPUS_EVENTS, JSON.stringify(events));
    }
  },

  // Event Registrations & Digital Passes
  getEventRegistrations(): EventRegistration[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENT_REGISTRATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENT_REGISTRATIONS, JSON.stringify(INITIAL_EVENT_REGISTRATIONS));
      return INITIAL_EVENT_REGISTRATIONS;
    }
    return JSON.parse(raw);
  },

  registerForEvent(event: CampusEvent, student: Student): EventRegistration {
    const regs = this.getEventRegistrations();
    const existing = regs.find(r => r.eventId === event.id && r.studentId === student.id);
    if (existing) {
      return existing;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email || `${student.name.toLowerCase().replace(/\s+/g, '.')}@alliance.edu.in`,
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

    regs.unshift(newReg);
    localStorage.setItem(STORAGE_KEYS.EVENT_REGISTRATIONS, JSON.stringify(regs));

    // Update event registration count
    const events = this.getEvents();
    const targetEvt = events.find(e => e.id === event.id);
    if (targetEvt) {
      targetEvt.totalRegistrations = (targetEvt.totalRegistrations || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.CAMPUS_EVENTS, JSON.stringify(events));
    }

    return newReg;
  },

  cancelEventRegistration(registrationId: string): void {
    const regs = this.getEventRegistrations();
    const target = regs.find(r => r.id === registrationId);
    if (!target) return;

    target.registrationStatus = 'Cancelled';
    localStorage.setItem(STORAGE_KEYS.EVENT_REGISTRATIONS, JSON.stringify(regs));
  },

  isRegisteredForEvent(eventId: string): boolean {
    const student = this.getCurrentStudent();
    const regs = this.getEventRegistrations();
    return regs.some(r => r.eventId === eventId && r.studentId === student.id && r.registrationStatus === 'Confirmed');
  },

  // Saved Events Bookmarks
  getSavedEventIds(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_EVENTS);
    if (!raw) {
      const initial = ['evt-one-soundclash', 'evt-quantum-workshop'];
      localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  },

  toggleSaveEvent(eventId: string): boolean {
    const saved = this.getSavedEventIds();
    const idx = saved.indexOf(eventId);
    let isSaved = false;
    if (idx > -1) {
      saved.splice(idx, 1);
      isSaved = false;
    } else {
      saved.push(eventId);
      isSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(saved));
    return isSaved;
  },

  isEventSaved(eventId: string): boolean {
    return this.getSavedEventIds().includes(eventId);
  }
};

/**
 * Enhanced deterministic calculation for opportunity matching with mandatory eligibility audit
 */
export function calculateOpportunityMatch(
  student: Student,
  opportunity: Opportunity
): MatchAnalysis {
  const studentSkillSet = new Set(student.skills.map(s => s.toLowerCase().trim()));
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];
  const recommendedSkills: string[] = [];

  // Check required skills
  for (const skill of opportunity.requiredSkills) {
    if (studentSkillSet.has(skill.toLowerCase().trim())) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // Check preferred skills
  let preferredMatchCount = 0;
  if (opportunity.preferredSkills && opportunity.preferredSkills.length > 0) {
    for (const pref of opportunity.preferredSkills) {
      if (studentSkillSet.has(pref.toLowerCase().trim())) {
        preferredMatchCount++;
      } else {
        recommendedSkills.push(pref);
      }
    }
  }

  // Mandatory Academic Eligibility Evaluation
  let eligibilityMet = true;
  let eligibilityReason = 'Meets verified enrollment and department criteria.';

  if (opportunity.eligibleDepartments && opportunity.eligibleDepartments.length > 0) {
    const isAllDept = opportunity.eligibleDepartments.includes('All Departments') || opportunity.department === 'Cross-Disciplinary';
    if (!isAllDept) {
      const deptMatches = opportunity.eligibleDepartments.some(
        d => student.department.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(student.department.toLowerCase())
      );
      if (!deptMatches) {
        eligibilityMet = false;
        eligibilityReason = `Department restriction: Restricted to ${opportunity.eligibleDepartments.join(', ')}.`;
      }
    }
  }

  if (opportunity.eligibleYears && opportunity.eligibleYears.length > 0) {
    const yearMatches = opportunity.eligibleYears.includes(student.year);
    if (!yearMatches) {
      eligibilityMet = false;
      eligibilityReason = `Academic cohort restriction: Open to ${opportunity.eligibleYears.join(', ')} (You are ${student.year}).`;
    }
  }

  // If mandatory eligibility fails, score is heavily reduced to prevent false matches
  if (!eligibilityMet) {
    return {
      score: 22,
      matchingSkills,
      missingSkills,
      recommendedSkills,
      eligibilityMet: false,
      eligibilityReason,
      explanation: `Ineligible for Official Entry: ${eligibilityReason} You may still participate as an external research collaborator or audit observer.`,
      suggestedNextAction: {
        label: 'View Alternative Events',
        type: 'learn',
        detail: 'Explore cross-disciplinary open hackathons with no department constraints.'
      }
    };
  }

  // Core required skills ratio (75% weight)
  const reqTotal = opportunity.requiredSkills.length || 1;
  const reqMatchRatio = matchingSkills.length / reqTotal;

  // Preferred skills bonus (up to 15% weight)
  const prefRatio = opportunity.preferredSkills && opportunity.preferredSkills.length > 0
    ? (preferredMatchCount / opportunity.preferredSkills.length)
    : 0.6;

  // Experience level bonus (10% weight)
  const expBonus = student.experienceLevel === 'Advanced' ? 10 : student.experienceLevel === 'Intermediate' ? 7 : 4;

  const rawScore = Math.round(reqMatchRatio * 75 + prefRatio * 15 + expBonus);
  const score = Math.min(99, Math.max(18, rawScore));

  // Build authentic explanation
  let explanation = '';
  let suggestedAction: MatchAnalysis['suggestedNextAction'] = {
    label: 'Apply for Opportunity',
    type: 'apply',
    detail: 'Your verified skills align directly with the core requirements. Submit before deadline.'
  };

  if (matchingSkills.length === opportunity.requiredSkills.length) {
    explanation = `100% Core Prerequisite Match: Your verified competencies in ${matchingSkills.join(', ')} cover all technical requirements.`;
    if (recommendedSkills.length > 0) {
      explanation += ` Learning ${recommendedSkills[0]} will further strengthen your application score.`;
    }
    suggestedAction = {
      label: 'Submit Application Now',
      type: 'apply',
      detail: `All prerequisite skills satisfied. Registration closes on ${opportunity.deadline}.`
    };
  } else if (matchingSkills.length > 0) {
    explanation = `Strong Technical Alignment: You match on ${matchingSkills.join(', ')}.`;
    if (missingSkills.length > 0) {
      explanation += ` ${missingSkills[0]} is a recommended skill to bridge.`;
      suggestedAction = {
        label: `Prepare ${missingSkills[0]}`,
        type: 'learn',
        detail: opportunity.learningRoadmap?.[0]?.resourceName || `Complete a weekend lab on ${missingSkills[0]} before submitting.`
      };
    }
  } else {
    explanation = `High Growth Learning Opportunity: Requires competencies in ${missingSkills.slice(0, 3).join(', ')} which are outside your current profile.`;
    suggestedAction = {
      label: 'Find Teammates with Gaps',
      type: 'team',
      detail: `Form a team with a student who specializes in ${missingSkills[0] || 'the core tech stack'}.`
    };
  }

  return {
    score,
    matchingSkills,
    missingSkills,
    recommendedSkills,
    eligibilityMet: true,
    eligibilityReason: 'Verified Alliance University Student Enrollment.',
    explanation,
    suggestedNextAction: suggestedAction
  };
}

/**
 * Transparent teammate compatibility calculation
 */
export function calculateTeammateCompatibility(
  studentA: Student,
  studentB: Student,
  targetSkills?: string[]
): {
  score: number;
  sharedSkills: string[];
  complementarySkills: string[];
  sharedInterests: string[];
  suggestedRole: string;
  explanation: string;
} {
  const setA = new Set(studentA.skills.map(s => s.toLowerCase().trim()));
  const setB = new Set(studentB.skills.map(s => s.toLowerCase().trim()));

  const sharedSkills: string[] = [];
  const complementarySkills: string[] = [];

  studentB.skills.forEach(skill => {
    if (setA.has(skill.toLowerCase().trim())) {
      sharedSkills.push(skill);
    } else {
      complementarySkills.push(skill);
    }
  });

  const intA = new Set(studentA.interests.map(i => i.toLowerCase().trim()));
  const sharedInterests = studentB.interests.filter(i => intA.has(i.toLowerCase().trim()));

  let calculatedScore = 55;
  if (complementarySkills.length > 0) {
    calculatedScore += Math.min(25, complementarySkills.length * 6);
  }
  if (sharedSkills.length > 0) {
    calculatedScore += Math.min(10, sharedSkills.length * 3);
  }
  if (sharedInterests.length > 0) {
    calculatedScore += Math.min(10, sharedInterests.length * 4);
  }
  if (studentA.department !== studentB.department) {
    calculatedScore += 6;
  }

  const score = Math.min(98, Math.max(45, calculatedScore));

  let explanation = '';
  if (studentA.department !== studentB.department) {
    explanation = `Cross-Disciplinary Synergy: ${studentB.name} (${studentB.department}) brings complementary expertise in ${complementarySkills.slice(0, 3).join(', ')}.`;
  } else {
    explanation = `Technical Synergy: High alignment with shared interest in ${sharedInterests[0] || 'emerging technology'} and ${complementarySkills.length} complementary skills.`;
  }

  return {
    score,
    sharedSkills,
    complementarySkills,
    sharedInterests,
    suggestedRole: studentB.suggestedRole || 'Technical Specialist',
    explanation
  };
}
