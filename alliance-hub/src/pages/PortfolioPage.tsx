import React, { useState } from 'react';
import { 
  Award, 
  Briefcase, 
  CheckCircle2, 
  ExternalLink, 
  FolderGit2, 
  Github, 
  Globe, 
  Linkedin, 
  Plus, 
  Share2, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Code2,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  Check,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, StudentExperience } from '../types';
import { ALL_SKILLS_LIST } from '../data/mockData';
import { storageService } from '../services/storageService';
import { useToast } from '../components/ui/ToastContext';

interface PortfolioPageProps {
  student: Student;
  onUpdateStudent: (updated: Student) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  student,
  onUpdateStudent
}) => {
  const { showToast } = useToast();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(student.bio);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Add Project modal state
  const [showAddProject, setShowAddProject] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projRole, setProjRole] = useState('Lead Architect');
  const [projStack, setProjStack] = useState('React, TypeScript, FastAPI');
  const [projLink, setProjLink] = useState('');

  // Add Experience modal state
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('May 2025 – Jul 2025');
  const [expDesc, setExpDesc] = useState('');

  // Add Achievement
  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [achievementInput, setAchievementInput] = useState('');

  // Public Preview Modal
  const [showPublicModal, setShowPublicModal] = useState(false);

  // Profile Completeness checklist calculation
  const checklist = React.useMemo(() => {
    return [
      {
        id: 'bio',
        label: 'Detailed Bio Statement',
        completed: Boolean(student.bio && student.bio.length > 30),
        hint: 'Write at least 30 characters about your career interests.'
      },
      {
        id: 'skills',
        label: '6+ Verified Skills',
        completed: student.skills.length >= 6,
        hint: `Currently ${student.skills.length}/6 added.`
      },
      {
        id: 'projects',
        label: '2+ Featured Projects',
        completed: student.projects.length >= 2,
        hint: `Currently ${student.projects.length}/2 showcased.`
      },
      {
        id: 'experience',
        label: 'Internship / Lab Experience',
        completed: Boolean(student.experiences && student.experiences.length > 0),
        hint: 'Log corporate internships, labs, or student clubs.'
      },
      {
        id: 'links',
        label: 'External Repositories & Profiles',
        completed: Boolean(student.githubUrl || student.portfolioUrl),
        hint: 'Link GitHub or personal website.'
      }
    ];
  }, [student]);

  const completeness = React.useMemo(() => {
    const doneCount = checklist.filter(c => c.completed).length;
    return Math.round((doneCount / checklist.length) * 100);
  }, [checklist]);

  const handleSaveBio = () => {
    const updated: Student = { ...student, bio: bioInput };
    storageService.updateStudentProfile(updated);
    onUpdateStudent(updated);
    setIsEditingBio(false);
    showToast('Profile Updated', 'Bio statement updated successfully.', 'success');
  };

  const handleAddSkill = (skillName: string) => {
    if (!skillName.trim() || student.skills.includes(skillName.trim())) return;
    const updated: Student = {
      ...student,
      skills: [...student.skills, skillName.trim()]
    };
    storageService.updateStudentProfile(updated);
    onUpdateStudent(updated);
    setNewSkillInput('');
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.7 }
    });
    showToast('Skill Added', `Added "${skillName}" to verified portfolio.`, 'success');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated: Student = {
      ...student,
      skills: student.skills.filter(s => s !== skillToRemove)
    };
    storageService.updateStudentProfile(updated);
    onUpdateStudent(updated);
    showToast('Skill Removed', `Removed "${skillToRemove}".`, 'info');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const newProj = {
      id: `proj-${Date.now()}`,
      title: projTitle.trim(),
      description: projDesc.trim(),
      techStack: projStack.split(',').map(s => s.trim()).filter(Boolean),
      link: projLink.trim() || undefined,
      role: projRole.trim()
    };

    const updated: Student = {
      ...student,
      projects: [newProj, ...student.projects]
    };

    storageService.updateStudentProfile(updated);
    onUpdateStudent(updated);
    setShowAddProject(false);
    setProjTitle('');
    setProjDesc('');
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#1D4ED8', '#111418']
    });
    showToast('Project Published', `"${newProj.title}" added to your portfolio.`, 'success');
  };

  const handleRemoveProject = (projId: string) => {
    const updated: Student = {
      ...student,
      projects: student.projects.filter(p => p.id !== projId)
    };
    storageService.updateStudentProfile(updated);
    onUpdateStudent(updated);
    showToast('Project Removed', 'Removed project from portfolio.', 'info');
  };

  const handleCreateExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole.trim() || !expCompany.trim()) return;

    const newExp: StudentExperience = {
      id: `exp-${Date.now()}`,
      role: expRole.trim(),
      companyOrLab: expCompany.trim(),
      period: expPeriod.trim(),
      description: expDesc.trim()
    };

    const currentExps = student.experiences || [];
    const updated: Student = {
      ...student,
      experiences: [newExp, ...currentExps]
    };

    storageService.updateStudentProfile(updated);
    onUpdateStudent(updated);
    setShowAddExperience(false);
    setExpRole('');
    setExpCompany('');
    setExpDesc('');
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#1D4ED8', '#111418']
    });
    showToast('Experience Added', `Recorded "${newExp.role}" at ${newExp.companyOrLab}.`, 'success');
  };

  const handleRemoveExperience = (expId: string) => {
    const updated: Student = {
      ...student,
      experiences: (student.experiences || []).filter(e => e.id !== expId)
    };
    storageService.updateStudentProfile(updated);
    onUpdateStudent(updated);
    showToast('Experience Removed', 'Removed experience record.', 'info');
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementInput.trim()) return;

    const updated: Student = {
      ...student,
      achievements: [achievementInput.trim(), ...student.achievements]
    };
    storageService.updateStudentProfile(updated);
    onUpdateStudent(updated);
    setShowAddAchievement(false);
    setAchievementInput('');
    showToast('Honor Recorded', 'Campus achievement added to profile.', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Editorial Profile Header */}
      <div className="bg-white border border-[#E6E8EB] rounded-3xl overflow-hidden shadow-sm">
        
        {/* Cover Canvas with University Heraldry Style */}
        <div className="h-36 bg-gradient-to-r from-[#111418] via-[#1D4ED8] to-[#111418] px-6 sm:px-8 flex items-center justify-between">
          <div className="text-white/80 text-xs font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="uppercase tracking-wider">Alliance University Verified Digital Passport</span>
          </div>

          <button
            onClick={() => setShowPublicModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white/95 hover:bg-white text-[#111418] rounded-xl shadow transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Portfolio Link</span>
          </button>
        </div>

        {/* Profile Details Strip */}
        <div className="px-6 sm:px-8 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
              />
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#111418]">
                    {student.name}
                  </h1>
                  <span className="text-[11px] font-semibold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Student
                  </span>
                </div>
                <p className="text-xs text-[#575F6E] mt-0.5 font-medium">
                  {student.degree} · {student.year} · {student.campus}
                </p>
              </div>
            </div>

            {/* Profile Completeness Ring */}
            <div className="bg-[#F4F4F1] border border-[#E6E8EB] p-3 rounded-2xl flex items-center gap-3 self-start sm:self-auto">
              <div className="w-10 h-10 rounded-full border-2 border-[#1D4ED8] flex items-center justify-center font-mono text-xs font-bold text-[#111418]">
                {completeness}%
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[#111418] block leading-tight">Profile Strength</span>
                <span className="text-[#88909E] text-[11px]">{checklist.filter(c => c.completed).length} of {checklist.length} milestones complete</span>
              </div>
            </div>
          </div>

          {/* Interactive Profile Completeness Checklist Dropdown/Card */}
          <div className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-2xl mb-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#111418]">
              <span>Profile Readiness Checklist</span>
              <span className="text-[11px] font-mono text-[#1D4ED8]">{completeness}% Complete</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
              {checklist.map(item => (
                <div 
                  key={item.id}
                  className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                    item.completed 
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                      : 'bg-white border-[#E6E8EB] text-[#575F6E]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                    {item.completed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-400 shrink-0" />
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="text-[10px] text-[#88909E] mt-1">
                    {item.completed ? 'Completed' : item.hint}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio statement */}
          <div className="mt-4 pt-4 border-t border-[#E6E8EB]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                Professional Bio & Focus
              </span>
              <button
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="text-xs text-[#1D4ED8] hover:text-[#1E40AF] font-semibold inline-flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditingBio ? 'Cancel' : 'Edit Bio'}</span>
              </button>
            </div>

            {isEditingBio ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-3 text-xs bg-[#FBFBFA] border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                <button
                  onClick={handleSaveBio}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-[#575F6E] leading-relaxed">
                {student.bio}
              </p>
            )}
          </div>

          {/* Social links */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#575F6E]">
            {student.githubUrl && (
              <a href={student.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#111418]">
                <Github className="w-4 h-4" />
                <span>{student.githubUrl.replace('https://', '')}</span>
              </a>
            )}
            {student.linkedinUrl && (
              <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#111418]">
                <Linkedin className="w-4 h-4" />
                <span>{student.linkedinUrl.replace('https://', '')}</span>
              </a>
            )}
            {student.portfolioUrl && (
              <a href={student.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#111418]">
                <Globe className="w-4 h-4" />
                <span>{student.portfolioUrl.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Skills vs Projects vs Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Skills & Certifications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Verified Skills Arsenal */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                  Verified Skills Arsenal
                </h3>
                <span className="text-[11px] text-[#88909E]">Used to compute compatibility</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#1D4ED8]">
                {student.skills.length} Skills
              </span>
            </div>

            {/* Add skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Docker, PyTorch)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(newSkillInput);
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs border border-[#D1D5DB] rounded-lg"
              />
              <button
                onClick={() => handleAddSkill(newSkillInput)}
                className="px-3.5 py-1.5 bg-[#111418] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors"
              >
                Add
              </button>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map(s => (
                <span 
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[#FBFBFA] border border-[#E6E8EB] rounded-md text-[#111418]"
                >
                  {s}
                  <button
                    onClick={() => handleRemoveSkill(s)}
                    className="text-[#88909E] hover:text-rose-600 ml-0.5"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Suggestions */}
            <div className="pt-2 border-t border-[#E6E8EB]">
              <span className="text-[10px] text-[#88909E] block mb-1">Add trending:</span>
              <div className="flex flex-wrap gap-1">
                {ALL_SKILLS_LIST.filter(s => !student.skills.includes(s)).slice(0, 6).map(s => (
                  <button
                    key={s}
                    onClick={() => handleAddSkill(s)}
                    className="text-[10px] px-1.5 py-0.5 border border-[#E6E8EB] rounded bg-white text-[#575F6E] hover:bg-[#F4F4F1]"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Honors & Hackathon Achievements */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                Honors & Certifications
              </h3>
              <button
                onClick={() => setShowAddAchievement(!showAddAchievement)}
                className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
              >
                + Add Honor
              </button>
            </div>

            {showAddAchievement && (
              <form onSubmit={handleAddAchievement} className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl space-y-2">
                <input
                  type="text"
                  placeholder="e.g. Finalist — Smart India Hackathon 2025"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#D1D5DB] rounded-lg"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAchievement(false)}
                    className="px-2 py-1 text-xs text-[#575F6E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs bg-[#111418] text-white rounded font-medium"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            <ul className="space-y-2.5 text-xs text-[#575F6E]">
              {student.achievements.map((ach, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>

            {student.certifications && student.certifications.length > 0 && (
              <div className="pt-3 border-t border-[#E6E8EB] space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-[#88909E]">
                  Verified Credentials:
                </span>
                {student.certifications.map((cert, idx) => (
                  <div key={idx} className="text-xs text-[#111418] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Projects & Experiences Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Internships & Lab Experience Timeline */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                  Internships & Lab Fellowships
                </h3>
                <span className="text-[11px] text-[#88909E]">Industry & university research experience</span>
              </div>
              <button
                onClick={() => setShowAddExperience(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors shadow-xs"
              >
                + Add Experience
              </button>
            </div>

            {/* Add Experience Modal/Form */}
            {showAddExperience && (
              <form onSubmit={handleCreateExperience} className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl space-y-3 text-xs">
                <div className="font-bold text-[#111418]">Log New Work Experience</div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Role (e.g. AI Research Fellow)"
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Company/Lab (e.g. Alliance Space Labs)"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Period (e.g. Jun 2025 – Present)"
                  value={expPeriod}
                  onChange={(e) => setExpPeriod(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
                  required
                />
                <textarea
                  rows={2}
                  placeholder="Key contributions, projects delivered, or papers authored..."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
                  required
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddExperience(false)}
                    className="px-3 py-1 text-xs text-[#575F6E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs bg-[#1D4ED8] text-white rounded font-semibold"
                  >
                    Save Experience
                  </button>
                </div>
              </form>
            )}

            {/* Experience list */}
            <div className="space-y-3">
              {(student.experiences || []).map(exp => (
                <div 
                  key={exp.id}
                  className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl transition-all space-y-1.5 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#111418]">{exp.role}</h4>
                      <div className="text-xs font-semibold text-[#1D4ED8]">{exp.companyOrLab}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#88909E]">{exp.period}</span>
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="p-1 text-[#88909E] hover:text-rose-600"
                        title="Remove experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[#575F6E] leading-relaxed pt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects Showcase */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111418]">
                  Featured Projects & Repositories
                </h3>
                <span className="text-[11px] text-[#88909E]">Demonstrating technical execution</span>
              </div>
              <button
                onClick={() => setShowAddProject(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-colors shadow-xs"
              >
                + Add Project
              </button>
            </div>

            {/* Add project form modal */}
            {showAddProject && (
              <form onSubmit={handleCreateProject} className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl space-y-3 text-xs">
                <div className="font-bold text-[#111418]">New Project Showcase</div>
                <input
                  type="text"
                  placeholder="Project Title (e.g. PulseMesh Autonomous Node)"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Your Role (e.g. Lead Developer, ML Researcher)"
                  value={projRole}
                  onChange={(e) => setProjRole(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
                />
                <textarea
                  rows={2}
                  placeholder="Project description, architecture, and measurable outcomes..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Tech stack (comma-separated: React, Python, Docker)"
                  value={projStack}
                  onChange={(e) => setProjStack(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
                />
                <input
                  type="url"
                  placeholder="Repository or live demo URL"
                  value={projLink}
                  onChange={(e) => setProjLink(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className="px-3 py-1 text-xs text-[#575F6E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs bg-[#1D4ED8] text-white rounded font-semibold"
                  >
                    Publish Project
                  </button>
                </div>
              </form>
            )}

            {/* Projects list */}
            <div className="space-y-4">
              {student.projects.map(proj => (
                <div 
                  key={proj.id}
                  className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] hover:border-[#111418] rounded-xl transition-all space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#111418]">{proj.title}</h4>
                      <span className="text-[11px] text-[#1D4ED8] font-medium">{proj.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-[#88909E] hover:text-[#111418]"
                          title="Open repo/demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="p-1 text-[#88909E] hover:text-rose-600"
                        title="Remove project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[#575F6E] leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.techStack.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-white border border-[#E6E8EB] rounded font-medium text-[#575F6E]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Public Portfolio Preview Modal */}
      {showPublicModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E8EB] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
                Public Shareable Link
              </span>
              <button onClick={() => setShowPublicModal(false)} className="text-[#88909E] hover:text-[#111418]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#575F6E]">
              Anyone with this link can view your verified Alliance University academic, code, and hackathon portfolio.
            </p>

            <div className="p-3 bg-[#F4F4F1] border border-[#E6E8EB] rounded-xl flex items-center justify-between font-mono text-xs text-[#111418] break-all">
              <span>https://hub.alliance.edu.in/p/shrikrushn-bhise</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('https://hub.alliance.edu.in/p/shrikrushn-bhise');
                  showToast('URL Copied', 'Portfolio link copied to clipboard.', 'success');
                  setShowPublicModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
