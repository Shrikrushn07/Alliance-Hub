import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Briefcase, 
  Send,
  UserPlus,
  Clock,
  Layers,
  HelpCircle,
  UserCheck,
  Zap,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Team, Student, Opportunity, OpenPosition } from '../types';
import { 
  storageService, 
  calculateTeammateCompatibility 
} from '../services/storageService';
import { useToast } from '../components/ui/ToastContext';
import { Mail } from 'lucide-react';

interface TeamsPageProps {
  teams: Team[];
  student: Student;
  allStudents: Student[];
  opportunities: Opportunity[];
  onOpenCreateTeam: () => void;
  onSelectStudent: (student: Student) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  onInviteStudent?: (student: Student) => void;
  onOpenInvitations?: () => void;
  pendingInvitesCount?: number;
  initialFilterOppId?: string;
}

export const TeamsPage: React.FC<TeamsPageProps> = ({
  teams,
  student,
  allStudents,
  opportunities,
  onOpenCreateTeam,
  onSelectStudent,
  onSelectOpportunity,
  onInviteStudent,
  onOpenInvitations,
  pendingInvitesCount = 0,
  initialFilterOppId
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'browse-teams' | 'matchmaker'>('browse-teams');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOppFilter, setSelectedOppFilter] = useState<string>(initialFilterOppId || 'All');
  const [onlyOpenRoles, setOnlyOpenRoles] = useState(true);

  // Matchmaker interactive filters
  const [matchmakerSkillFilter, setMatchmakerSkillFilter] = useState<string>('');
  const [matchmakerDeptFilter, setMatchmakerDeptFilter] = useState<string>('All');

  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = team.name.toLowerCase().includes(q);
        const matchTitle = team.projectTitle.toLowerCase().includes(q);
        const matchDesc = team.description.toLowerCase().includes(q);
        const matchSkills = team.requiredSkills.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchTitle && !matchDesc && !matchSkills) return false;
      }

      if (selectedCategory !== 'All' && team.category !== selectedCategory) {
        return false;
      }

      if (selectedOppFilter !== 'All' && team.targetOpportunityId !== selectedOppFilter) {
        return false;
      }

      if (onlyOpenRoles) {
        const hasOpen = team.openPositions.some(p => p.status === 'Open');
        if (!hasOpen) return false;
      }

      return true;
    });
  }, [teams, searchQuery, selectedCategory, selectedOppFilter, onlyOpenRoles]);

  // Ranked Teammates using transparent scoring
  const rankedStudents = useMemo(() => {
    return allStudents
      .filter(s => s.id !== student.id)
      .map(peer => {
        const compat = calculateTeammateCompatibility(student, peer);
        return { peer, compat };
      })
      .filter(({ peer }) => {
        if (matchmakerSkillFilter) {
          const hasSkill = peer.skills.some(s => s.toLowerCase().includes(matchmakerSkillFilter.toLowerCase()));
          if (!hasSkill) return false;
        }
        if (matchmakerDeptFilter !== 'All') {
          if (!peer.department.toLowerCase().includes(matchmakerDeptFilter.toLowerCase())) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => b.compat.score - a.compat.score);
  }, [allStudents, student, matchmakerSkillFilter, matchmakerDeptFilter]);

  const handleApplyToPosition = (team: Team, pos: OpenPosition) => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#1D4ED8', '#111418']
    });
    showToast(
      'Role Application Sent',
      `Applied for "${pos.title}" on ${team.name}. ${team.leaderName} has been notified.`,
      'success'
    );
  };

  const handleToggleConnect = (peer: Student) => {
    const isNow = storageService.toggleConnect(peer.id);
    if (isNow) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 }
      });
    }
    showToast(
      isNow ? 'Invitation Dispatched' : 'Connection Removed',
      isNow ? `Invited ${peer.name} to join your project squad.` : `Removed from your connections.`,
      'info'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header and Hero Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E6E8EB]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1.5 font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>Intelligent Team Formation & Peer Collaboration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111418] mt-1">
            Build Your Dream Squad
          </h1>
          <p className="text-sm text-[#575F6E] mt-1 max-w-2xl">
            Assemble high-performing teams with complementary technical, design, and strategic business capabilities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenInvitations && (
            <button
              onClick={onOpenInvitations}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#111418] bg-white border border-[#D1D5DB] hover:border-[#111418] rounded-xl transition-all shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Squad Invitations</span>
              {pendingInvitesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white text-[10px] font-bold flex items-center justify-center font-mono">
                  {pendingInvitesCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onOpenCreateTeam}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-all whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Form a New Team</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E8EB] pb-2 text-sm font-medium">
        <button
          onClick={() => setActiveTab('browse-teams')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'browse-teams'
              ? 'bg-[#111418] text-white font-semibold shadow-xs'
              : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
          }`}
        >
          Active Project Squads ({filteredTeams.length})
        </button>
        <button
          onClick={() => setActiveTab('matchmaker')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'matchmaker'
              ? 'bg-[#111418] text-white font-semibold shadow-xs'
              : 'text-[#575F6E] hover:text-[#111418] hover:bg-[#F4F4F1]'
          }`}
        >
          Teammate Matchmaker Engine ({rankedStudents.length})
        </button>
      </div>

      {/* VIEW 1: BROWSE TEAMS */}
      {activeTab === 'browse-teams' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#88909E]" />
              <input
                type="text"
                placeholder="Search teams by project name, tech stack, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 text-xs font-medium bg-white border border-[#D1D5DB] rounded-xl"
            >
              <option value="All">All Categories</option>
              <option value="Hackathons">Hackathons</option>
              <option value="Research">Research</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
              <option value="Technical Competitions">Technical Competitions</option>
              <option value="University Events">University Events</option>
            </select>

            <label className="flex items-center gap-2 text-xs text-[#575F6E] px-2 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={onlyOpenRoles}
                onChange={(e) => setOnlyOpenRoles(e.target.checked)}
                className="rounded border-[#D1D5DB] text-[#1D4ED8]"
              />
              <span>Open positions only</span>
            </label>
          </div>

          {/* Teams Grid */}
          {filteredTeams.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E6E8EB] rounded-2xl space-y-3">
              <Users className="w-8 h-8 text-[#88909E] mx-auto" />
              <h3 className="text-base font-bold text-[#111418]">No teams match this criteria</h3>
              <p className="text-xs text-[#575F6E]">
                Try adjusting your search filters or create your own squad to start recruiting.
              </p>
              <button
                onClick={onOpenCreateTeam}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg"
              >
                + Form Team
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTeams.map(team => {
                const openCount = team.openPositions.filter(p => p.status === 'Open').length;

                return (
                  <div
                    key={team.id}
                    className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top metadata */}
                      <div className="flex items-center justify-between text-xs text-[#575F6E] mb-2">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="font-semibold text-[#111418]">{team.category}</span>
                          <span>·</span>
                          <span>{team.members.length} Members</span>
                        </div>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          openCount > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {openCount > 0 ? `${openCount} Open Positions` : 'Roster Full'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#111418]">
                        {team.name}
                      </h3>
                      <h4 className="text-xs font-semibold text-[#1D4ED8] mt-0.5">
                        {team.projectTitle}
                      </h4>

                      <p className="text-xs text-[#575F6E] mt-3 line-clamp-3 leading-relaxed">
                        {team.description}
                      </p>

                      {/* Target Opportunity */}
                      {team.targetOpportunityTitle && (
                        <div className="mt-3 p-2.5 bg-[#F4F4F1] rounded-xl text-xs flex items-center justify-between">
                          <div className="truncate">
                            <span className="text-[#88909E] block text-[10px] uppercase font-semibold">Target Opportunity:</span>
                            <span className="font-medium text-[#111418] truncate block">
                              {team.targetOpportunityTitle}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Squad Roster: Existing Members */}
                      <div className="mt-4 pt-3 border-t border-[#E6E8EB]">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#88909E] block mb-2">
                          Active Squad Roster
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {team.members.map(member => (
                            <div 
                              key={member.studentId}
                              className="flex items-center gap-1.5 p-1 px-2.5 bg-[#FBFBFA] border border-[#E6E8EB] rounded-lg text-xs"
                              title={`${member.name} (${member.role})`}
                            >
                              <img 
                                src={member.avatar} 
                                alt={member.name} 
                                className="w-5 h-5 rounded-full object-cover" 
                              />
                              <span className="font-medium text-[#111418] truncate max-w-[90px]">
                                {member.name.split(' ')[0]}
                              </span>
                              <span className="text-[#88909E] text-[10px]">({member.role.split(' ')[0]})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Open Positions Slot Visualizer */}
                      {openCount > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#E6E8EB] space-y-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 block">
                            Recruiting Positions
                          </span>
                          <div className="space-y-2">
                            {team.openPositions.map(pos => (
                              <div
                                key={pos.id}
                                className="p-3 bg-[#FBFBFA] border border-dashed border-[#D1D5DB] rounded-xl flex items-center justify-between text-xs hover:border-[#1D4ED8] transition-colors"
                              >
                                <div>
                                  <div className="font-bold text-[#111418]">{pos.title}</div>
                                  <div className="text-[11px] text-[#575F6E]">
                                    Required: {pos.requiredSkills.join(', ')} · ~{pos.commitmentHours}h/wk
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleApplyToPosition(team, pos)}
                                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-xs"
                                >
                                  Join Role
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#E6E8EB] flex items-center justify-between text-xs text-[#88909E]">
                      <span>Leader: {team.leaderName}</span>
                      <span className="font-mono">Created {team.createdDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* VIEW 2: TEAMMATE MATCHMAKER ENGINE */}
      {activeTab === 'matchmaker' && (
        <div className="space-y-6">
          
          {/* Matchmaker Controls & Algorithm Transparency Callout */}
          <div className="p-4 bg-white border border-[#E6E8EB] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#111418] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1D4ED8]" />
                <span>Deterministic Peer Synergy Engine</span>
              </h3>
              <p className="text-xs text-[#575F6E]">
                Matches are calculated based on complementary skill portfolios, shared interests, availability, and cross-department collaboration value.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Filter by skill (e.g. Figma, ROS2, Go)..."
                value={matchmakerSkillFilter}
                onChange={(e) => setMatchmakerSkillFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-[#FBFBFA] border border-[#D1D5DB] rounded-xl w-48"
              />

              <select
                value={matchmakerDeptFilter}
                onChange={(e) => setMatchmakerDeptFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-[#FBFBFA] border border-[#D1D5DB] rounded-xl"
              >
                <option value="All">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Business">Business & Management</option>
                <option value="Design">Product Design</option>
                <option value="Aerospace">Aerospace Engineering</option>
                <option value="Law">School of Law</option>
              </select>
            </div>
          </div>

          {/* Student Match Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankedStudents.map(({ peer, compat }) => {
              const isConnected = storageService.isStudentConnected(peer.id);

              return (
                <div
                  key={peer.id}
                  onClick={() => onSelectStudent(peer)}
                  className="bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={peer.avatar} 
                          alt={peer.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-[#E6E8EB]" 
                        />
                        <div>
                          <h4 className="text-sm font-bold text-[#111418] group-hover:text-[#1D4ED8] transition-colors">
                            {peer.name}
                          </h4>
                          <div className="text-[11px] text-[#575F6E] truncate max-w-[170px]">
                            {peer.department}
                          </div>
                          <div className="text-[10px] text-[#88909E] font-mono">
                            {peer.year} · ~{peer.availabilityHoursPerWeek}h/wk
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                          {compat.score}% Synergy
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#575F6E] line-clamp-2 leading-relaxed">
                      {peer.bio}
                    </p>

                    {/* Transparent Synergy Explanation */}
                    <div className="p-2.5 bg-[#F4F4F1] rounded-xl text-xs space-y-1">
                      <div className="font-semibold text-[#111418] text-[11px]">
                        Synergy Rationale:
                      </div>
                      <p className="text-[#575F6E] text-[11px] leading-normal">
                        {compat.explanation}
                      </p>
                    </div>

                    {/* Complementary Skills Tagged */}
                    <div>
                      <span className="text-[10px] text-[#88909E] uppercase tracking-wider block mb-1">
                        Verified Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {peer.skills.map(s => {
                          const isComplementary = compat.complementarySkills.includes(s);
                          return (
                            <span 
                              key={s}
                              className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                isComplementary 
                                  ? 'bg-blue-50 text-blue-800 border border-blue-100' 
                                  : 'bg-[#FBFBFA] border border-[#E6E8EB] text-[#575F6E]'
                              }`}
                            >
                              {s} {isComplementary && '★'}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E6E8EB] flex items-center justify-between text-xs gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(peer);
                      }}
                      className="text-xs font-semibold text-[#575F6E] hover:text-[#111418] transition-colors"
                    >
                      Dossier
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleConnect(peer);
                        }}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isConnected
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-white border border-[#D1D5DB] text-[#575F6E] hover:text-[#111418]'
                        }`}
                        title={isConnected ? 'Connected' : 'Save Connection'}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>

                      {onInviteStudent ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInviteStudent(peer);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111418] text-white hover:bg-[#1D4ED8] transition-colors shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Invite to Squad</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleConnect(peer);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isConnected
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#111418] text-white hover:bg-[#1D4ED8]'
                          }`}
                        >
                          <span>{isConnected ? 'Invited' : 'Connect'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
