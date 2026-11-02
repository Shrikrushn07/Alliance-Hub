import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  Sparkles, 
  Users, 
  Trophy, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Compass, 
  Lock, 
  QrCode, 
  GraduationCap, 
  Building2, 
  ChevronRight, 
  Star, 
  Zap, 
  Check, 
  Menu, 
  X, 
  Code2, 
  Award,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Opportunity, Student, CampusFestival, CampusEvent, UserRole } from '../types';
import { AuthUser } from '../services/apiService';
import { storageService, calculateOpportunityMatch } from '../services/storageService';
import { useToast } from '../components/ui/ToastContext';

interface LandingPageProps {
  onNavigate: (tab: string, opportunityId?: string) => void;
  opportunities: Opportunity[];
  festivals?: CampusFestival[];
  events?: CampusEvent[];
  student: Student;
  currentUser?: AuthUser | null;
  allUsers?: AuthUser[];
  userRole?: UserRole;
  onSwitchUser?: (userId: string) => void;
  onOpenApply?: (opp: Opportunity) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  opportunities,
  festivals = [],
  events = [],
  student,
  currentUser,
  allUsers = [],
  userRole = 'student',
  onSwitchUser,
  onOpenApply
}) => {
  const { showToast } = useToast();

  // Navigation & Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<string>('student');

  // Product Mockup Interactive Tab
  const [activeMockupTab, setActiveMockupTab] = useState<'discovery' | 'teams' | 'festivals' | 'pipeline'>('discovery');

  // Interactive spotlight opportunity
  const spotlightOpp = opportunities[0] || null;
  const spotlightMatch = spotlightOpp ? calculateOpportunityMatch(student, spotlightOpp) : null;

  // Handle CTA Click: Triggers celebratory confetti and opens login or takes to dashboard
  const handleGetStarted = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#1D4ED8', '#111418', '#059669']
    });
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  // Perform Login using existing backend/role accounts
  const handleExecuteLogin = async (targetUserId?: string, targetRole?: string) => {
    const userIdToUse = targetUserId || (
      selectedRoleForLogin === 'organizer' ? 'user-organizer-01' :
      selectedRoleForLogin === 'faculty' ? 'user-faculty-01' :
      selectedRoleForLogin === 'admin' ? 'user-admin-01' :
      'user-student-01'
    );

    const userObj = allUsers.find(u => u.id === userIdToUse);
    const roleToRoute = targetRole || userObj?.role || selectedRoleForLogin;

    try {
      if (onSwitchUser) {
        await onSwitchUser(userIdToUse);
      }
      
      setAuthModalOpen(false);
      showToast(
        'Authentication Successful',
        `Logged in as ${userObj?.name || 'Verified User'} (${roleToRoute.toUpperCase()}). Welcome to Alliance Hub.`,
        'success'
      );

      // Route directly into the role-based workspace
      if (roleToRoute === 'organizer') onNavigate('organizer');
      else if (roleToRoute === 'faculty') onNavigate('faculty');
      else if (roleToRoute === 'admin') onNavigate('admin');
      else onNavigate('dashboard');

    } catch (err: any) {
      // Fallback direct route
      setAuthModalOpen(false);
      onNavigate(roleToRoute === 'student' ? 'dashboard' : roleToRoute);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111418] flex flex-col font-sans selection:bg-[#1D4ED8]/10 selection:text-[#1D4ED8]">
      
      {/* ========================================================= */}
      {/* 1. CLEAN MODERN NAVBAR                                    */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#E6E8EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo & Wordmark */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex items-center gap-3 text-left focus:outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-[#111418] text-white flex items-center justify-center font-extrabold text-sm tracking-tight shadow-sm group-hover:bg-[#1D4ED8] transition-colors relative">
                  <span>AH</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute top-1.5 right-1.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold tracking-tight text-[#111418] leading-none">
                      Alliance Hub
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#1D4ED8] border border-blue-200">
                      Campus Portal
                    </span>
                  </div>
                  <span className="text-[11px] text-[#575F6E] leading-none mt-1 block font-medium">
                    Alliance University · Bengaluru
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button
                onClick={() => onNavigate('opportunities')}
                className="text-[#575F6E] hover:text-[#111418] transition-colors relative py-1 group"
              >
                <span>Explore</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1D4ED8] transition-all group-hover:w-full" />
              </button>

              <button
                onClick={() => onNavigate('events')}
                className="text-[#575F6E] hover:text-[#111418] transition-colors relative py-1 flex items-center gap-1.5 group"
              >
                <span>Campus Events</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-[#F4F4F1] border border-[#E6E8EB] text-[#111418] rounded">
                  Festivals
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1D4ED8] transition-all group-hover:w-full" />
              </button>

              <button
                onClick={() => onNavigate('teams')}
                className="text-[#575F6E] hover:text-[#111418] transition-colors relative py-1 group"
              >
                <span>Team Matchmaker</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1D4ED8] transition-all group-hover:w-full" />
              </button>
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={handleOpenLogin}
                className="px-4 py-2 text-xs font-semibold text-[#111418] hover:text-[#1D4ED8] hover:bg-[#F4F4F1] rounded-xl transition-all"
              >
                Login
              </button>

              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-xs hover:shadow-md active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={handleGetStarted}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#111418] rounded-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#575F6E] hover:text-[#111418] rounded-lg border border-[#E6E8EB] bg-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E6E8EB] bg-white px-4 py-5 space-y-3 shadow-lg">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('opportunities');
              }}
              className="w-full text-left py-2 text-sm font-semibold text-[#111418] flex items-center justify-between"
            >
              <span>Explore Opportunities</span>
              <ChevronRight className="w-4 h-4 text-[#88909E]" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('events');
              }}
              className="w-full text-left py-2 text-sm font-semibold text-[#111418] flex items-center justify-between"
            >
              <span>Campus Events & Festivals</span>
              <ChevronRight className="w-4 h-4 text-[#88909E]" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('teams');
              }}
              className="w-full text-left py-2 text-sm font-semibold text-[#111418] flex items-center justify-between"
            >
              <span>Squad Matchmaker</span>
              <ChevronRight className="w-4 h-4 text-[#88909E]" />
            </button>

            <div className="pt-3 border-t border-[#E6E8EB] flex gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenLogin();
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-center text-[#111418] bg-[#F4F4F1] rounded-xl"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleGetStarted();
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-center text-white bg-[#111418] rounded-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. EYE-CATCHING HERO SECTION                              */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E6E8EB] bg-gradient-to-b from-[#FBFBFA] via-white to-[#FBFBFA]">
        
        {/* Subtle decorative architectural grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Campus Pre-header Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E6E8EB] rounded-full text-xs text-[#575F6E] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
              <span className="font-semibold text-[#111418]">Alliance University</span>
              <span className="text-[#88909E]">·</span>
              <span className="font-mono text-[#1D4ED8]">AY 2026–27 Cycle</span>
            </div>

            {/* Required Primary Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111418] leading-[1.08] text-balance">
              Your Campus. <br className="hidden sm:inline" />
              Your Opportunities. <br className="hidden sm:inline" />
              <span className="text-[#1D4ED8] underline decoration-blue-200 decoration-wavy decoration-2 underline-offset-8">
                Your Future.
              </span>
            </h1>

            {/* Required Short Description */}
            <p className="text-base sm:text-lg text-[#575F6E] leading-relaxed text-balance max-w-2xl mx-auto">
              Discover verified internships, competitive hackathons, vibrant campus events, accredited research opportunities, and driven teammates across Engineering, Business, and Law.
            </p>

            {/* Required Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-sm hover:shadow-lg active:scale-[0.98] group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('opportunities')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-[#111418] bg-white border border-[#D1D5DB] hover:border-[#111418] hover:bg-[#FBFBFA] rounded-xl transition-all shadow-2xs"
              >
                <Compass className="w-4 h-4 text-[#1D4ED8]" />
                <span>Explore Opportunities</span>
              </button>
            </div>

            {/* Quick Interactive Category Tags (Fast Jump) */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#575F6E]">
              <span className="text-[#88909E] font-medium mr-1">Trending:</span>
              <button
                onClick={() => onNavigate('opportunities')}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-[#1D4ED8] hover:border-blue-200 border border-[#E6E8EB] rounded-lg transition-colors font-medium"
              >
                Hackathons (12)
              </button>
              <button
                onClick={() => onNavigate('opportunities')}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-[#1D4ED8] hover:border-blue-200 border border-[#E6E8EB] rounded-lg transition-colors font-medium"
              >
                Industry Internships (18)
              </button>
              <button
                onClick={() => onNavigate('events')}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-[#1D4ED8] hover:border-blue-200 border border-[#E6E8EB] rounded-lg transition-colors font-medium"
              >
                Alliance ONE Festival
              </button>
              <button
                onClick={() => onNavigate('opportunities')}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-[#1D4ED8] hover:border-blue-200 border border-[#E6E8EB] rounded-lg transition-colors font-medium"
              >
                Research Fellowships
              </button>
            </div>

            {/* University Trust Metrics Bar */}
            <div className="pt-8 border-t border-[#E6E8EB] grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto text-left sm:text-center">
              <div>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#111418] block tabular-nums">4,800+</span>
                <span className="text-xs text-[#575F6E]">Active Campus Students</span>
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#111418] block tabular-nums">120+</span>
                <span className="text-xs text-[#575F6E]">Verified Listings</span>
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#1D4ED8] block tabular-nums">₹18.5L+</span>
                <span className="text-xs text-[#575F6E]">Prizes & Research Grants</span>
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-700 block tabular-nums">100%</span>
                <span className="text-xs text-[#575F6E]">University Accredited</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. VISUALLY IMPRESSIVE PRODUCT PREVIEW / MOCKUP           */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 bg-white border-b border-[#E6E8EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D4ED8]">
              Live Ecosystem Experience
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111418] tracking-tight">
              An intelligent command center for student success
            </h2>
            <p className="text-sm text-[#575F6E]">
              Designed with precision for students, student organizers, faculty coordinators, and university administrators.
            </p>
          </div>

          {/* Interactive Mockup Container */}
          <div className="rounded-2xl border border-[#D1D5DB] bg-[#FBFBFA] shadow-2xl overflow-hidden max-w-5xl mx-auto">
            
            {/* macOS Chrome Header Bar */}
            <div className="bg-[#111418] px-4 py-3 flex items-center justify-between text-white border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-xs text-white/50 hidden sm:inline">
                  hub.alliance.edu.in/workspace
                </span>
              </div>

              {/* Mockup Navigation Tabs */}
              <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setActiveMockupTab('discovery')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeMockupTab === 'discovery' 
                      ? 'bg-white text-[#111418] shadow-xs' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Opportunity Match
                </button>
                <button
                  onClick={() => setActiveMockupTab('teams')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeMockupTab === 'teams' 
                      ? 'bg-white text-[#111418] shadow-xs' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Team Squads
                </button>
                <button
                  onClick={() => setActiveMockupTab('festivals')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeMockupTab === 'festivals' 
                      ? 'bg-white text-[#111418] shadow-xs' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Festival Passes
                </button>
                <button
                  onClick={() => setActiveMockupTab('pipeline')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeMockupTab === 'pipeline' 
                      ? 'bg-white text-[#111418] shadow-xs' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Career Tracker
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time SSE Sync</span>
              </div>
            </div>

            {/* Mockup Canvas Screen */}
            <div className="p-6 sm:p-8 bg-[#FBFBFA] min-h-[420px] flex flex-col justify-between">
              
              {/* TAB 1: OPPORTUNITY MATCH PREVIEW */}
              {activeMockupTab === 'discovery' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E8EB]">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#575F6E]">
                        <span className="font-semibold text-[#111418]">Alliance Central Campus</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[#1D4ED8]">Automated Skill Matcher</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#111418] mt-0.5">
                        High-Affinity Opportunities Matched to Shrikrushn Bhise
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg self-start sm:self-auto">
                      96% Lead Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Primary Highlight Card */}
                    <div className="md:col-span-2 bg-white border border-[#E6E8EB] rounded-2xl p-5 shadow-xs space-y-4 hover:border-[#111418] transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px] text-[#575F6E]">
                            <span className="font-bold text-[#1D4ED8] uppercase tracking-wider font-mono">Flagship Hackathon</span>
                            <span>·</span>
                            <span>In-Person</span>
                            <span>·</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> CII Verified
                            </span>
                          </div>
                          <h4 className="text-base font-extrabold text-[#111418]">
                            Alliance National Innovation Hackathon 2026
                          </h4>
                        </div>
                        <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md shrink-0">
                          ₹2,50,000 Pool
                        </span>
                      </div>

                      <p className="text-xs text-[#575F6E] leading-relaxed line-clamp-2">
                        Annual 36-hour cross-campus buildathon uniting Engineering, Business, and Law to develop scalable solutions for smart sustainability and autonomous systems.
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#575F6E]">
                        <span className="font-semibold text-[#111418] mr-1">Matching Skills:</span>
                        <span className="px-2 py-0.5 bg-[#F4F4F1] rounded text-[#111418] font-mono text-[11px]">Python</span>
                        <span className="px-2 py-0.5 bg-[#F4F4F1] rounded text-[#111418] font-mono text-[11px]">React</span>
                        <span className="px-2 py-0.5 bg-[#F4F4F1] rounded text-[#111418] font-mono text-[11px]">Machine Learning</span>
                        <span className="px-2 py-0.5 bg-[#F4F4F1] rounded text-[#111418] font-mono text-[11px]">FastAPI</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-[#E6E8EB]">
                        <div className="text-[11px] text-[#88909E] font-mono">
                          Registration closes April 15, 2026 · 148 Applied
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onNavigate('opportunities')}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Match Sidebar */}
                    <div className="space-y-3">
                      <div className="bg-white border border-[#E6E8EB] rounded-xl p-4 space-y-2">
                        <div className="text-[11px] font-mono font-semibold text-[#1D4ED8]">Research Lab</div>
                        <h5 className="text-xs font-bold text-[#111418]">AI Inference Lab Fellowship</h5>
                        <p className="text-[11px] text-[#575F6E]">Centre for Intelligent Systems · ₹25,000/mo</p>
                        <span className="inline-block text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          92% Match
                        </span>
                      </div>

                      <div className="bg-white border border-[#E6E8EB] rounded-xl p-4 space-y-2">
                        <div className="text-[11px] font-mono font-semibold text-purple-700">Corporate Track</div>
                        <h5 className="text-xs font-bold text-[#111418]">Goldman Sachs Risk Analyst</h5>
                        <p className="text-[11px] text-[#575F6E]">Alliance Placement Cell · Summer 2026</p>
                        <span className="inline-block text-[10px] font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          88% Match
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TEAM SQUADS & SYNERGY PREVIEW */}
              {activeMockupTab === 'teams' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E8EB]">
                    <div>
                      <div className="text-xs text-[#575F6E] flex items-center gap-2">
                        <span className="font-semibold text-[#111418]">Cross-School Squad Formation</span>
                        <span>·</span>
                        <span className="font-mono text-[#1D4ED8]">Engineering + Business + Law</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#111418] mt-0.5">
                        Team Synthetix — Recruiting for Alliance ONE
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg self-start sm:self-auto">
                      94% Synergy Score
                    </span>
                  </div>

                  <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 shadow-xs space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      <div className="p-3.5 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#111418] text-white font-mono text-xs flex items-center justify-center font-bold">
                            SB
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#111418]">Shrikrushn Bhise</div>
                            <div className="text-[10px] text-[#575F6E]">Lead AI Architect</div>
                          </div>
                        </div>
                        <div className="text-[11px] text-[#88909E]">B.Tech CSE & AI · 3rd Year</div>
                      </div>

                      <div className="p-3.5 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#1D4ED8] text-white font-mono text-xs flex items-center justify-center font-bold">
                            AS
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#111418]">Aditi Sharma</div>
                            <div className="text-[10px] text-[#575F6E]">Product & Strategy</div>
                          </div>
                        </div>
                        <div className="text-[11px] text-[#88909E]">Alliance School of Business · 3rd Year</div>
                      </div>

                      <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
                            Open Position
                          </span>
                          <span className="text-[10px] font-semibold text-amber-700">Recruiting</span>
                        </div>
                        <div className="text-xs font-bold text-[#111418]">Embedded Hardware Lead</div>
                        <div className="text-[11px] text-[#575F6E]">IoT prototyping & Raspberry Pi/ESP32</div>
                      </div>

                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-[#575F6E]">
                        Target Project: <strong>Autonomous Edge Surveillance for Smart Agriculture</strong>
                      </div>
                      <button
                        onClick={() => onNavigate('teams')}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors"
                      >
                        Request to Join Squad
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CAMPUS FESTIVALS & DIGITAL PASS PREVIEW */}
              {activeMockupTab === 'festivals' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E8EB]">
                    <div>
                      <div className="text-xs text-[#575F6E] flex items-center gap-2">
                        <span className="font-semibold text-[#111418]">Official University Festival Pass</span>
                        <span>·</span>
                        <span className="font-mono text-[#1D4ED8]">All-Access Credentials</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#111418] mt-0.5">
                        Alliance ONE 2026: Campus Mega Festival
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg self-start sm:self-auto">
                      Pass Verified
                    </span>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
                    <div className="space-y-3 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-[#111418] rounded">
                          Digital Gate Pass
                        </span>
                        <span className="text-xs text-white/70 font-mono">
                          AU-ONE-2026-PASS-0482
                        </span>
                      </div>
                      <h4 className="text-xl font-extrabold">Alliance ONE: Infinite Horizons</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        3-Day University Mega Celebration bringing together technical buildathons, cultural performances, esports battles, and entrepreneurship summits.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                        <div>Dates: April 16–18, 2026</div>
                        <div>Venue: Engineering Concourse</div>
                      </div>
                    </div>

                    {/* Digital QR Code Hologram Box */}
                    <div className="bg-white p-4 rounded-xl text-center shrink-0 shadow-md">
                      <QrCode className="w-24 h-24 text-[#111418] mx-auto" />
                      <div className="text-[10px] font-mono font-bold text-[#111418] mt-1">
                        SHRIKRUSHN BHISE
                      </div>
                      <div className="text-[9px] text-emerald-700 font-semibold font-mono">
                        ● ADMIT ALL ZONES
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CAREER TRACKER PIPELINE PREVIEW */}
              {activeMockupTab === 'pipeline' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E8EB]">
                    <div>
                      <div className="text-xs text-[#575F6E] flex items-center gap-2">
                        <span className="font-semibold text-[#111418]">Opportunity Pipeline</span>
                        <span>·</span>
                        <span className="font-mono text-[#1D4ED8]">Real-Time Review Status</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#111418] mt-0.5">
                        Active Application Tracker
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#111418] bg-[#F4F4F1] px-3 py-1 rounded-lg">
                      6 Total Submissions
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-white border border-[#E6E8EB] rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-[#575F6E] uppercase">Applied</div>
                      <div className="text-lg font-mono font-bold text-[#111418]">3 Active</div>
                      <div className="text-[10px] text-[#88909E]">Under faculty review</div>
                    </div>
                    <div className="p-3.5 bg-white border border-amber-200 bg-amber-50/20 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-amber-800 uppercase">Shortlisted</div>
                      <div className="text-lg font-mono font-bold text-amber-900">2 Interviews</div>
                      <div className="text-[10px] text-amber-700">Interview scheduled Apr 12</div>
                    </div>
                    <div className="p-3.5 bg-white border border-emerald-200 bg-emerald-50/20 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-emerald-800 uppercase">Selected</div>
                      <div className="text-lg font-mono font-bold text-emerald-900">1 Offer</div>
                      <div className="text-[10px] text-emerald-700">Offer letter signed</div>
                    </div>
                    <div className="p-3.5 bg-white border border-[#E6E8EB] rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-[#575F6E] uppercase">Saved</div>
                      <div className="text-lg font-mono font-bold text-[#111418]">4 Bookmarked</div>
                      <div className="text-[10px] text-[#88909E]">Drafts in progress</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Interactive Jump Prompt */}
              <div className="pt-6 border-t border-[#E6E8EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-[#575F6E]">
                  Ready to test the live platform with your student or faculty profile?
                </span>
                <button
                  onClick={handleGetStarted}
                  className="font-bold text-[#1D4ED8] hover:underline flex items-center gap-1"
                >
                  <span>Launch Live Platform</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. COMPACT SECTION HIGHLIGHTING KEY FEATURES              */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 bg-[#FBFBFA] border-b border-[#E6E8EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D4ED8]">
              Purpose-Built Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111418] tracking-tight">
              Engineered exclusively for Alliance University
            </h2>
            <p className="text-sm text-[#575F6E] leading-relaxed">
              Every feature solves real campus challenges: connecting cross-school builders, accelerating corporate hiring, and verifying authentic student achievements.
            </p>
          </div>

          {/* 6 High-Craft Feature Cards (Anti-AI Slop, Zero-Pill) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 shadow-xs transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#111418]">
                Intelligent Opportunity Discovery
              </h3>
              <p className="text-xs text-[#575F6E] leading-relaxed">
                Algorithmic matching scores every hackathon, corporate internship, and lab grant against your verified skills, academic year, and career aspirations.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#1D4ED8] font-semibold">
                Match Percentage · Skill Gap Analysis
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 shadow-xs transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#111418]">
                Cross-Disciplinary Team Squads
              </h3>
              <p className="text-xs text-[#575F6E] leading-relaxed">
                Form high-performing competition teams pairing coders from Engineering, strategists from Business, and policy drafters from Law with calculated synergy scores.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-semibold">
                Teammate Matchmaker · Role Invites
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 shadow-xs transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#111418]">
                Campus Festivals & Digital Passes
              </h3>
              <p className="text-xs text-[#575F6E] leading-relaxed">
                Dedicated hubs for flagship celebrations like Alliance ONE and ALF. Access day-by-day sub-event schedules, fast registration, and verified QR gate passes.
              </p>
              <div className="pt-2 text-[11px] font-mono text-purple-700 font-semibold">
                Live Passes · Alliance ONE · ALF
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 shadow-xs transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#111418]">
                Application Journey & Pipeline
              </h3>
              <p className="text-xs text-[#575F6E] leading-relaxed">
                Track every submission with a dedicated Kanban board and milestone timeline. Keep private reflection notes, interview preparation reminders, and feedback logs.
              </p>
              <div className="pt-2 text-[11px] font-mono text-amber-800 font-semibold">
                Kanban Board · Milestone Timelines
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 shadow-xs transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#111418] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#111418]">
                Verified Proof-of-Work Portfolio
              </h3>
              <p className="text-xs text-[#575F6E] leading-relaxed">
                Build an institutional portfolio linking verified campus projects, hackathon trophies, research publications, and GitHub repositories with shareable URLs.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#111418] font-semibold">
                Institutional Accreditations · Shareable
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 shadow-xs transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#111418]">
                Role-Based Campus Publishing
              </h3>
              <p className="text-xs text-[#575F6E] leading-relaxed">
                Granular workspaces for student club leads to publish events, faculty to endorse listings, and university deans to review institutional audit logs.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#1D4ED8] font-semibold">
                Real RBAC · Server Authorization
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. ACADEMIC SCHOOLS & MULTIDISCIPLINARY COLLABORATION     */}
      {/* ========================================================= */}
      <section className="py-16 md:py-20 bg-white border-b border-[#E6E8EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111418] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-xs font-mono text-blue-300">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>University Cross-Campus Integration</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Breaking down silos between schools.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Alliance Hub empowers engineers to build with business strategists, legal scholars, and creative designers. We turn multidisciplinary coursework into competitive hackathon podiums.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-4 text-xs font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Alliance College of Engineering (ACED)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Alliance School of Business (ASB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Alliance School of Law (ASL)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>School of Liberal Arts & Humanities</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-2xl w-full max-w-sm space-y-4">
                  <div className="text-xs font-mono text-blue-300 uppercase tracking-wider font-semibold">
                    Campus Fast Access
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white/5 rounded-lg flex items-center justify-between">
                      <span>CII Venture Incubation Grants</span>
                      <span className="font-mono text-emerald-400 font-bold">Active</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-lg flex items-center justify-between">
                      <span>Alliance ONE Overnight Build</span>
                      <span className="font-mono text-blue-300 font-bold">Registration Open</span>
                    </div>
                  </div>
                  <button
                    onClick={handleGetStarted}
                    className="w-full py-2.5 text-xs font-bold text-center text-[#111418] bg-white hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    Enter Student Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CLEAN FOOTER                                           */}
      {/* ========================================================= */}
      <footer className="bg-[#F4F4F1] border-t border-[#E6E8EB] text-[#575F6E] py-12 text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Wordmark & Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#111418] text-white flex items-center justify-center font-bold text-xs">
                  AH
                </div>
                <span className="font-bold text-[#111418] tracking-tight">Alliance Hub</span>
              </div>
              <p className="text-xs text-[#575F6E] leading-relaxed max-w-xs">
                The centralized digital ecosystem for opportunity discovery, student team formation, and verified portfolios at Alliance University.
              </p>
              <p className="text-[11px] text-[#88909E] leading-normal">
                Chikkahagade Cross, Chandapura - Anekal Main Road, Bengaluru, Karnataka 562106
              </p>
            </div>

            {/* Col 2: Opportunities */}
            <div>
              <h4 className="text-xs font-bold text-[#111418] uppercase tracking-wider mb-3">
                Explore Opportunities
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('opportunities')} className="hover:text-[#111418] transition-colors">
                    Hackathons & Competitions
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('opportunities')} className="hover:text-[#111418] transition-colors">
                    Corporate Internships
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('opportunities')} className="hover:text-[#111418] transition-colors">
                    Research Fellowships
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('opportunities')} className="hover:text-[#111418] transition-colors">
                    Venture Studio Grants (CII)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Collaboration & Campus */}
            <div>
              <h4 className="text-xs font-bold text-[#111418] uppercase tracking-wider mb-3">
                Campus Collaboration
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('events')} className="hover:text-[#111418] text-[#1D4ED8] font-semibold transition-colors">
                    ★ Alliance ONE & ALF Festivals
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('teams')} className="hover:text-[#111418] transition-colors">
                    Squad Teammate Matchmaker
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('portfolio')} className="hover:text-[#111418] transition-colors">
                    Verified Student Portfolios
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('applications')} className="hover:text-[#111418] transition-colors">
                    Application Journey Tracker
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Role Portals */}
            <div>
              <h4 className="text-xs font-bold text-[#111418] uppercase tracking-wider mb-3">
                Institutional Portals
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => handleExecuteLogin('user-student-01', 'student')} className="hover:text-[#111418] transition-colors">
                    Student Workspace
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExecuteLogin('user-organizer-01', 'organizer')} className="hover:text-[#111418] transition-colors">
                    Club Organizer Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExecuteLogin('user-faculty-01', 'faculty')} className="hover:text-[#111418] transition-colors">
                    Faculty Coordinator Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExecuteLogin('user-admin-01', 'admin')} className="hover:text-[#111418] transition-colors">
                    University Admin Console
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-[#E6E8EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#88909E]">
            <div>
              © 2026 Alliance University · Alliance Hub Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Campus Code of Conduct</span>
              <span>·</span>
              <span className="font-mono text-emerald-700 font-semibold">● System Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 7. UNIVERSITY AUTHENTICATION / LOGIN ROLE MODAL           */}
      {/* ========================================================= */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl border border-[#E6E8EB] shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-8 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#88909E] hover:text-[#111418] hover:bg-[#F4F4F1] rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#111418] text-white font-bold text-xs flex items-center justify-center">
                  AH
                </div>
                <span className="text-xs font-mono font-bold text-[#1D4ED8] uppercase tracking-wider">
                  Alliance University Single Sign-On
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#111418]">
                {authMode === 'login' ? 'Sign In to Alliance Hub' : 'Get Started with Alliance Hub'}
              </h3>
              <p className="text-xs text-[#575F6E] leading-relaxed">
                Select your verified university persona to enter your scoped dashboard.
              </p>
            </div>

            {/* 4 Role Persona Cards for 1-Click Seamless Authentication */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#88909E]">
                Select Campus Persona (RBAC):
              </div>

              {/* Student Persona */}
              <button
                onClick={() => handleExecuteLogin('user-student-01', 'student')}
                className="w-full text-left p-3 rounded-xl border border-[#E6E8EB] hover:border-[#1D4ED8] hover:bg-blue-50/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-mono text-xs">
                    SB
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111418] group-hover:text-[#1D4ED8]">
                      Shrikrushn Bhise
                    </div>
                    <div className="text-[11px] text-[#575F6E]">
                      Student · B.Tech CSE & AI
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Student Workspace →
                </span>
              </button>

              {/* Organizer Persona */}
              <button
                onClick={() => handleExecuteLogin('user-organizer-01', 'organizer')}
                className="w-full text-left p-3 rounded-xl border border-[#E6E8EB] hover:border-[#1D4ED8] hover:bg-blue-50/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1D4ED8] flex items-center justify-center font-bold font-mono text-xs">
                    AS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111418] group-hover:text-[#1D4ED8]">
                      Aditi Sharma
                    </div>
                    <div className="text-[11px] text-[#575F6E]">
                      Organizer · E-Cell & Festivals
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  Organizer Studio →
                </span>
              </button>

              {/* Faculty Persona */}
              <button
                onClick={() => handleExecuteLogin('user-faculty-01', 'faculty')}
                className="w-full text-left p-3 rounded-xl border border-[#E6E8EB] hover:border-[#1D4ED8] hover:bg-blue-50/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold font-mono text-xs">
                    MS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111418] group-hover:text-[#1D4ED8]">
                      Dr. Maya Sengupta
                    </div>
                    <div className="text-[11px] text-[#575F6E]">
                      Faculty Coordinator · Liberal Arts
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                  Faculty Portal →
                </span>
              </button>

              {/* Admin Persona */}
              <button
                onClick={() => handleExecuteLogin('user-admin-01', 'admin')}
                className="w-full text-left p-3 rounded-xl border border-[#E6E8EB] hover:border-[#1D4ED8] hover:bg-blue-50/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-mono text-xs">
                    RR
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111418] group-hover:text-[#1D4ED8]">
                      Prof. Rajeshwara Rao
                    </div>
                    <div className="text-[11px] text-[#575F6E]">
                      Dean of Academic Affairs · Admin
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                  Admin Console →
                </span>
              </button>
            </div>

            {/* Quick One-Click Entry */}
            <div className="pt-2 border-t border-[#E6E8EB] space-y-2">
              <button
                onClick={() => handleExecuteLogin('user-student-01', 'student')}
                className="w-full py-3 text-xs font-bold text-center text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-xs"
              >
                Continue as Student (Instant Access)
              </button>
              <p className="text-[11px] text-center text-[#88909E]">
                Protected by Alliance University Zero-Trust Role Authorization
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
