export type OpportunityCategory = 
  | 'Hackathons'
  | 'Internships'
  | 'Technical Competitions'
  | 'Workshops'
  | 'Entrepreneurship'
  | 'Research'
  | 'Certifications'
  | 'University Events';

export type OpportunityMode = 'In-Person' | 'Virtual' | 'Hybrid';

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  organizerType: 'University Department' | 'Student Club' | 'Industry Partner' | 'Research Lab';
  verified: boolean;
  category: OpportunityCategory;
  mode: OpportunityMode;
  location: string;
  department: string;
  deadline: string; // YYYY-MM-DD
  eventDate?: string;
  stipendOrPrize?: string;
  description: string;
  responsibilities?: string[];
  eligibility: string;
  eligibleDepartments?: string[];
  eligibleYears?: string[];
  requiredSkills: string[];
  preferredSkills?: string[];
  externalUrl?: string;
  featured?: boolean;
  totalApplicants?: number;
  openSpots?: number;
  contactEmail?: string;
  learningRoadmap?: {
    skill: string;
    resourceName: string;
    resourceType: 'Interactive Lab' | 'Documentation' | 'Video Masterclass' | 'University Repository';
    url: string;
    estimatedHours: number;
  }[];
}

export interface StudentExperience {
  id: string;
  role: string;
  companyOrLab: string;
  location?: string;
  period: string;
  description: string;
  skills?: string[];
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  department: string;
  degree: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgraduate';
  campus: string;
  bio: string;
  skills: string[];
  interests: string[];
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availabilityHoursPerWeek: number;
  suggestedRole?: string;
  achievements: string[];
  experiences?: StudentExperience[];
  projects: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    link?: string;
    role: string;
  }[];
  certifications?: string[];
  verifiedStudent: boolean;
}

export interface TeamMember {
  studentId: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
}

export interface OpenPosition {
  id: string;
  title: string;
  requiredSkills: string[];
  commitmentHours: number;
  status: 'Open' | 'Filled';
}

export interface Team {
  id: string;
  name: string;
  projectTitle: string;
  category: OpportunityCategory;
  targetOpportunityId?: string;
  targetOpportunityTitle?: string;
  description: string;
  leaderId: string;
  leaderName: string;
  members: TeamMember[];
  openPositions: OpenPosition[];
  requiredSkills: string[];
  createdDate: string;
  status: 'Recruiting' | 'Full' | 'In Progress' | 'Completed';
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  projectTitle: string;
  inviterId: string;
  inviterName: string;
  inviterAvatar: string;
  inviteeId: string;
  roleName: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  message?: string;
}

export type ApplicationStatus = 'Saved' | 'Applied' | 'Shortlisted' | 'Selected' | 'Rejected' | 'Completed';

export interface ApplicationHistoryEvent {
  status: ApplicationStatus;
  date: string;
  note?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organizer: string;
  category: OpportunityCategory;
  appliedDate: string;
  deadline: string;
  status: ApplicationStatus;
  notes?: string;
  externalLink?: string;
  history?: ApplicationHistoryEvent[];
}

export interface MatchAnalysis {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendedSkills: string[];
  eligibilityMet: boolean;
  eligibilityReason: string;
  explanation: string;
  suggestedNextAction: {
    label: string;
    type: 'apply' | 'learn' | 'team';
    detail: string;
  };
}

export type UserRole = 'student' | 'organizer' | 'faculty' | 'admin';

export type EventCategory = 
  | 'Major Festival'
  | 'Cultural'
  | 'Technical'
  | 'Sports'
  | 'Entrepreneurship'
  | 'Department Fest'
  | 'Workshop & Masterclass'
  | 'Conference & Symposium';

export type EventVerificationStatus = 
  | 'Draft'
  | 'Pending Verification'
  | 'Verified'
  | 'Published'
  | 'Completed'
  | 'Cancelled';

export interface FestivalAnnouncement {
  id: string;
  festivalId: string;
  title: string;
  description: string;
  publishedAt: string;
  priority: 'High' | 'Normal';
  author: string;
}

export interface CampusFestival {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  theme?: string;
  heroImage: string;
  organizer: string;
  organizerDepartment: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  venue: string;
  verificationStatus: EventVerificationStatus;
  publicationStatus: 'Draft' | 'Published' | 'Archived';
  featured: boolean;
  expectedAttendees?: number;
  participatingClubs?: string[];
  scheduleHighlights?: {
    day: string;
    title: string;
    time: string;
    description: string;
    venue: string;
  }[];
  announcements?: FestivalAnnouncement[];
}

export interface CampusEvent {
  id: string;
  festivalId?: string; // Optional link to parent CampusFestival
  festivalTitle?: string;
  title: string;
  description: string;
  category: EventCategory;
  startDatetime: string; // ISO format e.g. "2026-04-10T10:00:00"
  endDatetime: string;
  venue: string;
  eligibility: string;
  organizer: string;
  organizerDepartment?: string;
  verificationStatus: EventVerificationStatus;
  publicationStatus: 'Draft' | 'Published' | 'Archived';
  registrationType: 'in-app' | 'external';
  registrationUrl?: string;
  registrationDeadline: string; // YYYY-MM-DD
  prizePool?: string;
  openSpots?: number;
  totalRegistrations?: number;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
  rulesOrGuidelines?: string[];
}

export interface EventRegistration {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  eventId: string;
  eventTitle: string;
  festivalId?: string;
  festivalTitle?: string;
  category: EventCategory;
  startDatetime: string;
  venue: string;
  registrationStatus: 'Confirmed' | 'Waitlisted' | 'Cancelled';
  registeredAt: string;
  ticketCode: string;
}
