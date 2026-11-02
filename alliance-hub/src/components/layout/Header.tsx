import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  Building2,
  GraduationCap,
  Sparkles,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../../types';
import { AuthUser } from '../../services/apiService';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser?: AuthUser | null;
  onSwitchUser?: (userId: string) => void;
  allUsers?: AuthUser[];
  onOpenCreateTeam: () => void;
  onOpenCreateOpportunity: () => void;
  onOpenInvitations?: () => void;
  pendingInvitesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  currentUser,
  onSwitchUser,
  allUsers = [],
  onOpenCreateTeam,
  onOpenCreateOpportunity,
  onOpenInvitations,
  pendingInvitesCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Dynamic navigation links strictly tailored by active user role
  const getNavLinks = () => {
    switch (userRole) {
      case 'organizer':
        return [
          { id: 'organizer', label: 'Organizer Studio' },
          { id: 'opportunities', label: 'Campus Catalog' },
          { id: 'events', label: 'Festivals & Events' },
          { id: 'teams', label: 'Student Directory' }
        ];
      case 'faculty':
        return [
          { id: 'faculty', label: 'Faculty & Dept Portal' },
          { id: 'opportunities', label: 'Opportunities' },
          { id: 'events', label: 'Campus Events' },
          { id: 'teams', label: 'Student Directory' }
        ];
      case 'admin':
        return [
          { id: 'admin', label: 'Admin Console' },
          { id: 'opportunities', label: 'All Opportunities' },
          { id: 'events', label: 'Campus Events' },
          { id: 'dashboard', label: 'Student Perspective' }
        ];
      case 'student':
      default:
        return [
          { id: 'dashboard', label: 'Workspace' },
          { id: 'opportunities', label: 'Opportunities' },
          { id: 'events', label: 'Campus Events' },
          { id: 'teams', label: 'Teams & Teammates' },
          { id: 'applications', label: 'Tracker' },
          { id: 'portfolio', label: 'My Portfolio' }
        ];
    }
  };

  const navLinks = getNavLinks();

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'faculty':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'organizer':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'student':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#E6E8EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentTab('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#111418] text-white flex items-center justify-center font-bold text-sm tracking-tight group-hover:bg-[#1D4ED8] transition-colors">
                AH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-[#111418] block leading-none">
                    Alliance Hub
                  </span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border ${getRoleBadgeStyle(userRole)}`}>
                    {userRole}
                  </span>
                </div>
                <span className="text-[11px] text-[#575F6E] leading-none mt-1 block">
                  Alliance University
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Role-Tailored Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive 
                      ? 'text-[#111418] font-bold' 
                      : 'text-[#575F6E] hover:text-[#111418]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#1D4ED8]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions + User Profile & Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Student-specific invitations bell */}
            {userRole === 'student' && onOpenInvitations && (
              <button
                onClick={onOpenInvitations}
                className="relative p-2 text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1] rounded-lg transition-colors"
                title="Squad invitations"
                aria-label="View squad invitations"
              >
                <Users className="w-4 h-4" />
                {pendingInvitesCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1D4ED8]" />
                )}
              </button>
            )}

            {/* Primary Action Button tailored to role */}
            {userRole === 'student' ? (
              <button
                onClick={onOpenCreateTeam}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Team</span>
              </button>
            ) : userRole === 'organizer' ? (
              <button
                onClick={onOpenCreateOpportunity}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Opportunity</span>
              </button>
            ) : userRole === 'faculty' ? (
              <button
                onClick={() => setCurrentTab('faculty')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6B21A8] hover:bg-[#581C87] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Dept Workspace</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('admin')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Role & Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 text-left bg-white border border-[#E6E8EB] hover:border-[#D1D5DB] rounded-xl transition-all shadow-xs"
                title="Switch University Persona"
              >
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-lg object-cover border border-[#E6E8EB]" 
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#111418] text-white flex items-center justify-center text-xs font-bold font-mono">
                    {currentUser?.name?.slice(0, 2).toUpperCase() || 'AU'}
                  </div>
                )}
                
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-[#111418] leading-tight flex items-center gap-1">
                    <span>{currentUser?.name || 'User'}</span>
                  </div>
                  <div className="text-[10px] text-[#575F6E] leading-none capitalize">
                    {currentUser?.role || userRole} · {currentUser?.department?.split(' ')[0] || 'Alliance'}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-[#88909E]" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white border border-[#E6E8EB] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-[#E6E8EB]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#88909E] font-semibold">
                      Switch Active Persona (RBAC)
                    </div>
                    <p className="text-[11px] text-[#575F6E] mt-0.5">
                      Verify complete permissions and scoped views across all 4 roles.
                    </p>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {allUsers.length > 0 ? (
                      allUsers.map((u) => {
                        const isCurrent = currentUser?.id === u.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              if (onSwitchUser) onSwitchUser(u.id);
                              setUserRole(u.role);
                              // Auto navigate to home tab of switched role
                              if (u.role === 'student') setCurrentTab('dashboard');
                              else if (u.role === 'organizer') setCurrentTab('organizer');
                              else if (u.role === 'faculty') setCurrentTab('faculty');
                              else if (u.role === 'admin') setCurrentTab('admin');
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                              isCurrent 
                                ? 'bg-blue-50/70 border border-blue-200' 
                                : 'hover:bg-[#F4F4F1] border border-transparent'
                            }`}
                          >
                            <img 
                              src={u.avatar} 
                              alt={u.name} 
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#E6E8EB]" 
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#111418] truncate">
                                  {u.name}
                                </span>
                                <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded font-semibold ${getRoleBadgeStyle(u.role)}`}>
                                  {u.role}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#575F6E] truncate block">
                                {u.title}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      // Fallback quick buttons if user list hasn't loaded
                      <>
                        <button
                          onClick={() => {
                            setUserRole('student');
                            setCurrentTab('dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-[#F4F4F1] rounded-lg"
                        >
                          Student View
                        </button>
                        <button
                          onClick={() => {
                            setUserRole('organizer');
                            setCurrentTab('organizer');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-[#F4F4F1] rounded-lg"
                        >
                          Organizer View
                        </button>
                        <button
                          onClick={() => {
                            setUserRole('faculty');
                            setCurrentTab('faculty');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-[#F4F4F1] rounded-lg"
                        >
                          Faculty View
                        </button>
                        <button
                          onClick={() => {
                            setUserRole('admin');
                            setCurrentTab('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-[#F4F4F1] rounded-lg"
                        >
                          Admin Console
                        </button>
                      </>
                    )}
                  </div>

                  <div className="px-3 py-1.5 border-t border-[#E6E8EB] bg-[#FBFBFA] rounded-b-xl flex items-center justify-between text-[11px] text-[#88909E]">
                    <span>Real-time RBAC Engine</span>
                    <span className="font-mono text-[10px] text-emerald-700 font-semibold">Live SSE</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#575F6E] hover:text-[#111418]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E6E8EB] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === link.id
                  ? 'bg-[#F4F4F1] text-[#111418] font-semibold'
                  : 'text-[#575F6E] hover:bg-[#F4F4F1]'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <div className="pt-2 border-t border-[#E6E8EB] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#88909E] block mb-1">Select Persona</span>
            <div className="grid grid-cols-2 gap-2">
              {allUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    if (onSwitchUser) onSwitchUser(u.id);
                    setUserRole(u.role);
                    if (u.role === 'student') setCurrentTab('dashboard');
                    else if (u.role === 'organizer') setCurrentTab('organizer');
                    else if (u.role === 'faculty') setCurrentTab('faculty');
                    else if (u.role === 'admin') setCurrentTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 text-xs rounded-lg text-left border ${
                    currentUser?.id === u.id 
                      ? 'bg-blue-50 border-blue-300 font-semibold text-[#1D4ED8]' 
                      : 'bg-[#F4F4F1] border-transparent text-[#575F6E]'
                  }`}
                >
                  <div className="font-bold truncate">{u.name}</div>
                  <div className="text-[10px] uppercase font-mono">{u.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
