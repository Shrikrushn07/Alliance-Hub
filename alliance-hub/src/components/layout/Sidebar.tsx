import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Users, 
  FileText, 
  User, 
  Bell, 
  Settings, 
  PanelLeftClose, 
  PanelLeft, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  ChevronDown, 
  LogOut, 
  X,
  Compass,
  Sparkles,
  Globe
} from 'lucide-react';
import { UserRole } from '../../types';
import { AuthUser } from '../../services/apiService';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  userRole: UserRole;
  currentUser: AuthUser | null;
  allUsers: AuthUser[];
  onSwitchUser: (userId: string) => void;
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  userRole,
  currentUser,
  allUsers,
  onSwitchUser,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenSearch,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Dynamic navigation links by role
  const getNavItems = () => {
    switch (userRole) {
      case 'organizer':
        return [
          { id: 'organizer', label: 'Organizer Studio', icon: Building2 },
          { id: 'opportunities', label: 'Discover Opportunities', icon: Compass },
          { id: 'events', label: 'Campus Events', icon: Calendar },
          { id: 'teams', label: 'Student Directory', icon: Users },
        ];
      case 'faculty':
        return [
          { id: 'faculty', label: 'Faculty Workspace', icon: GraduationCap },
          { id: 'opportunities', label: 'Department Opps', icon: Compass },
          { id: 'events', label: 'Campus Events', icon: Calendar },
          { id: 'teams', label: 'Student Directory', icon: Users },
        ];
      case 'admin':
        return [
          { id: 'admin', label: 'Admin Console', icon: ShieldCheck },
          { id: 'opportunities', label: 'All Opportunities', icon: Compass },
          { id: 'events', label: 'Campus Events', icon: Calendar },
          { id: 'dashboard', label: 'Student View', icon: LayoutDashboard },
        ];
      case 'student':
      default:
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'opportunities', label: 'Discover Opportunities', icon: Compass },
          { id: 'events', label: 'Campus Events', icon: Calendar },
          { id: 'teams', label: 'Find Teammates', icon: Users },
          { id: 'applications', label: 'My Applications', icon: FileText },
          { id: 'portfolio', label: 'My Portfolio', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#E6E8EB] select-none">
      
      {/* 1. Header / Brand Bar */}
      <div className={`p-4 border-b border-[#E6E8EB] flex items-center justify-between ${isCollapsed ? 'justify-center px-2' : ''}`}>
        <button
          onClick={() => {
            onNavigate('dashboard');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none group overflow-hidden"
          title="Alliance Hub"
        >
          <div className="w-8 h-8 rounded-lg bg-[#111418] text-white flex items-center justify-center font-bold text-sm tracking-tight shrink-0 group-hover:bg-[#1D4ED8] transition-colors shadow-xs">
            AH
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-sm font-bold tracking-tight text-[#111418] block leading-none truncate">
                Alliance Hub
              </span>
              <span className="text-[11px] text-[#575F6E] leading-none mt-1 block truncate">
                Alliance University
              </span>
            </div>
          )}
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 text-[#88909E] hover:text-[#111418] hover:bg-[#F4F4F1] rounded-lg transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-[#88909E] hover:text-[#111418] hover:bg-[#F4F4F1] rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Quick Search Trigger */}
      <div className="p-3">
        <button
          onClick={onOpenSearch}
          className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-[#88909E] bg-[#FBFBFA] hover:bg-[#F4F4F1] border border-[#E6E8EB] hover:border-[#D1D5DB] rounded-xl transition-all text-left shadow-2xs ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Search (⌘K)"
        >
          <Sparkles className="w-4 h-4 text-[#1D4ED8] shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 font-medium text-[#575F6E]">Quick Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#88909E] bg-white border border-[#E6E8EB] rounded shadow-2xs">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* 3. Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#88909E] font-semibold ${isCollapsed ? 'sr-only' : ''}`}>
          Workspace
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left group ${
                isActive 
                  ? 'bg-[#111418] text-white shadow-xs' 
                  : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#88909E] group-hover:text-[#111418]'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* System & Utility Navigation */}
        <div className={`pt-4 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#88909E] font-semibold ${isCollapsed ? 'sr-only' : ''}`}>
          Personal
        </div>

        {/* Notifications item */}
        <button
          onClick={() => {
            onOpenNotifications();
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1] transition-colors text-left group ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Notifications"
        >
          <div className="relative">
            <Bell className="w-4 h-4 text-[#88909E] group-hover:text-[#111418]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1D4ED8]" />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span>Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-100 text-[#1D4ED8] font-bold">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Settings item */}
        <button
          onClick={() => {
            onNavigate('portfolio');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1] transition-colors text-left group ${
            currentTab === 'portfolio' ? 'bg-[#F4F4F1] text-[#111418]' : ''
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
          title="Profile & Settings"
        >
          <Settings className="w-4 h-4 text-[#88909E] group-hover:text-[#111418]" />
          {!isCollapsed && <span>Profile & Settings</span>}
        </button>
      </nav>

      {/* 4. Footer User Profile Card with Persona Switcher */}
      <div className="p-3 border-t border-[#E6E8EB] relative bg-[#FBFBFA]">
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className={`w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#E6E8EB] transition-all text-left ${
            isCollapsed ? 'justify-center p-1' : ''
          }`}
          title="Switch role persona"
        >
          {currentUser?.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#E6E8EB]" 
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#111418] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'AU'}
            </div>
          )}

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111418] truncate block">
                  {currentUser?.name || 'User'}
                </span>
                <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold px-1 py-0.2 rounded border ${getRoleBadgeStyle(userRole)}`}>
                  {userRole}
                </span>
              </div>
              <span className="text-[11px] text-[#575F6E] truncate block mt-0.5">
                {currentUser?.title || currentUser?.department}
              </span>
            </div>
          )}

          {!isCollapsed && (
            <ChevronDown className="w-3.5 h-3.5 text-[#88909E] shrink-0" />
          )}
        </button>

        {/* Profile / Switcher Dropdown */}
        {profileDropdownOpen && (
          <div 
            className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-[#E6E8EB] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2"
            onMouseLeave={() => setProfileDropdownOpen(false)}
          >
            <div className="px-3 py-2 border-b border-[#E6E8EB]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#88909E] font-semibold block">
                Switch University Role (RBAC)
              </span>
              <p className="text-[11px] text-[#575F6E] mt-0.5">
                Test dedicated views & server permissions
              </p>
            </div>

            <div className="py-1 space-y-1">
              {allUsers.map(u => {
                const isSelected = currentUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u.id);
                      setProfileDropdownOpen(false);
                      onCloseMobile();
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                      isSelected 
                        ? 'bg-blue-50/70 border border-blue-200' 
                        : 'hover:bg-[#F4F4F1] border border-transparent'
                    }`}
                  >
                    <img 
                      src={u.avatar} 
                      alt={u.name} 
                      className="w-7 h-7 rounded-lg object-cover shrink-0 border border-[#E6E8EB]" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#111418] truncate">
                          {u.name}
                        </span>
                        <span className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded font-semibold border ${getRoleBadgeStyle(u.role)}`}>
                          {u.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#575F6E] truncate block">
                        {u.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#E6E8EB] space-y-1">
              <button
                onClick={() => {
                  onNavigate('landing');
                  setProfileDropdownOpen(false);
                  onCloseMobile();
                }}
                className="w-full text-left p-2 rounded-lg text-xs font-semibold text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1] transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span>Public Landing Page</span>
                </span>
                <span className="text-[10px] font-mono text-[#88909E]">Preview →</span>
              </button>
            </div>

            <div className="pt-1.5 border-t border-[#E6E8EB] flex items-center justify-between px-2 text-[10px] text-[#88909E] font-mono">
              <span>Security State: Enforced</span>
              <span className="text-emerald-700 font-semibold">Active</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:block shrink-0 transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        <div className="sticky top-0 h-screen">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
