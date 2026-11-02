import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  PlusCircle, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../../types';
import { AuthUser } from '../../services/apiService';

interface WorkspaceTopBarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  userRole: UserRole;
  currentUser: AuthUser | null;
  unreadCount?: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenMobileSidebar: () => void;
  onOpenCreateTeam: () => void;
  onOpenCreateOpportunity: () => void;
  onOpenCreateEvent?: () => void;
}

export const WorkspaceTopBar: React.FC<WorkspaceTopBarProps> = ({
  currentTab,
  onNavigate,
  userRole,
  currentUser,
  unreadCount = 0,
  onOpenNotifications,
  onOpenSearch,
  onOpenMobileSidebar,
  onOpenCreateTeam,
  onOpenCreateOpportunity,
  onOpenCreateEvent
}) => {
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Student Overview';
      case 'opportunities': return 'Discover Opportunities';
      case 'opportunity-details': return 'Opportunity Dossier';
      case 'events': return 'Campus Events & Festivals';
      case 'festival-details': return 'Festival Pavilion';
      case 'teams': return 'Teammates & Squads';
      case 'applications': return 'Application Tracker';
      case 'portfolio': return 'Student Portfolio';
      case 'organizer': return 'Organizer Publishing Studio';
      case 'faculty': return 'Faculty & Department Portal';
      case 'admin': return 'University Admin Console';
      default: return 'Alliance Hub';
    }
  };

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
    <header className="sticky top-0 z-30 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#E6E8EB] h-14">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Mobile trigger & Breadcrumb Trail */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1] rounded-lg"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#575F6E] truncate">
            <span className="font-semibold text-[#111418] hidden sm:inline">Alliance Hub</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#88909E] shrink-0 hidden sm:inline" />
            <span className="font-medium text-[#111418] truncate">
              {getTabLabel(currentTab)}
            </span>
          </nav>
        </div>

        {/* Center/Right: Universal Search Bar Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#88909E] bg-white border border-[#E6E8EB] hover:border-[#D1D5DB] rounded-xl transition-all shadow-2xs"
            title="Search catalog (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#88909E]" />
            <span className="hidden md:inline font-medium text-[#575F6E]">Search opportunities, events, squads...</span>
            <span className="md:hidden font-medium text-[#575F6E]">Search...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.2 text-[10px] font-mono text-[#88909E] bg-[#FBFBFA] border border-[#E6E8EB] rounded">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-[#575F6E] hover:text-[#111418] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-[#E6E8EB]"
            title="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1D4ED8]" />
            )}
          </button>

          {/* Primary Action Button tailored to role */}
          {userRole === 'student' ? (
            <button
              onClick={onOpenCreateTeam}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors shadow-2xs shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Launch Squad</span>
            </button>
          ) : userRole === 'organizer' ? (
            <button
              onClick={onOpenCreateOpportunity}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl transition-colors shadow-2xs shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Opportunity</span>
            </button>
          ) : userRole === 'faculty' ? (
            <button
              onClick={() => onNavigate('faculty')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#6B21A8] hover:bg-[#581C87] rounded-xl transition-colors shadow-2xs shrink-0"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Dept Circular</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('admin')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors shadow-2xs shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Queue</span>
            </button>
          )}

          {/* Role badge */}
          <span className={`hidden md:inline text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-1 rounded-lg border ${getRoleBadgeStyle(userRole)}`}>
            {userRole}
          </span>
        </div>

      </div>
    </header>
  );
};
