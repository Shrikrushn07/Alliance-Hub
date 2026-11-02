import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Plus, Trash2, Users, Target } from 'lucide-react';
import { Opportunity, Student, Team, OpenPosition, OpportunityCategory } from '../../types';
import { ALL_SKILLS_LIST } from '../../data/mockData';
import { storageService } from '../../services/storageService';
import { useToast } from '../ui/ToastContext';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: Student;
  opportunities: Opportunity[];
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  student,
  opportunities
}) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [targetOppId, setTargetOppId] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('Hackathons');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'React']);
  const [skillInput, setSkillInput] = useState('');

  // Open Positions
  const [positions, setPositions] = useState<Array<{ title: string; requiredSkills: string[]; commitmentHours: number }>>([
    { title: 'Frontend Developer', requiredSkills: ['React', 'TypeScript'], commitmentHours: 10 }
  ]);
  const [posTitle, setPosTitle] = useState('');
  const [posSkills, setPosSkills] = useState('');
  const [posHours, setPosHours] = useState(10);

  // Availability & Preferences
  const [preferredMeetingMode, setPreferredMeetingMode] = useState<'Hybrid' | 'In-Person' | 'Remote'>('Hybrid');
  const [seekingDepartments, setSeekingDepartments] = useState<string[]>(['Engineering', 'Design', 'Business']);

  if (!isOpen) return null;

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleAddPosition = () => {
    if (!posTitle.trim()) return;
    const splitted = posSkills.split(',').map(s => s.trim()).filter(Boolean);
    setPositions([
      ...positions,
      {
        title: posTitle.trim(),
        requiredSkills: splitted.length > 0 ? splitted : ['General Collaboration'],
        commitmentHours: posHours
      }
    ]);
    setPosTitle('');
    setPosSkills('');
  };

  const handleRemovePosition = (index: number) => {
    setPositions(positions.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !projectTitle) return;

    const targetOpp = opportunities.find(o => o.id === targetOppId);

    const formattedPositions: OpenPosition[] = positions.map((p, idx) => ({
      id: `pos-${Date.now()}-${idx}`,
      title: p.title,
      requiredSkills: p.requiredSkills,
      commitmentHours: p.commitmentHours,
      status: 'Open'
    }));

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamName,
      projectTitle,
      category,
      targetOpportunityId: targetOpp?.id,
      targetOpportunityTitle: targetOpp?.title,
      description,
      leaderId: student.id,
      leaderName: student.name,
      members: [
        {
          studentId: student.id,
          name: student.name,
          role: 'Team Lead',
          avatar: student.avatar,
          department: student.department
        }
      ],
      openPositions: formattedPositions,
      requiredSkills: selectedSkills,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Recruiting'
    };

    storageService.createTeam(newTeam);
    showToast(
      'Team Formed Successfully',
      `"${teamName}" is now active in Team Discovery and recruiting members.`,
      'success'
    );
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in duration-200"
        role="dialog"
      >
        {/* Step Indicator Header */}
        <div className="px-6 py-4 border-b border-[#E6E8EB] bg-[#FBFBFA] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider">
                Step {step} of 6
              </span>
              <span className="text-xs text-[#88909E]">·</span>
              <span className="text-xs text-[#575F6E]">Team Formation Studio</span>
            </div>
            <h3 className="text-base font-bold text-[#111418] mt-0.5">
              {step === 1 && '1. Team Name & Target Opportunity'}
              {step === 2 && '2. Project Vision & Description'}
              {step === 3 && '3. Required Skill Arsenal'}
              {step === 4 && '4. Define Open Positions'}
              {step === 5 && '5. Collaboration Preferences'}
              {step === 6 && '6. Review & Launch Team'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#88909E] hover:text-[#111418] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="h-1 bg-[#F4F4F1] w-full">
          <div 
            className="h-1 bg-[#1D4ED8] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Team NeuroMatrix, Apex Innovators"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
                  Opportunity Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  <option value="Hackathons">Hackathons</option>
                  <option value="Technical Competitions">Technical Competitions</option>
                  <option value="Research">Research Fellowships</option>
                  <option value="Entrepreneurship">Entrepreneurship & Startups</option>
                  <option value="Workshops">Workshops & Sprints</option>
                  <option value="University Events">University Events</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
                  Link with an Alliance Opportunity (Optional)
                </label>
                <select
                  value={targetOppId}
                  onChange={(e) => {
                    setTargetOppId(e.target.value);
                    const selected = opportunities.find(o => o.id === e.target.value);
                    if (selected) {
                      setCategory(selected.category);
                    }
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  <option value="">Independent Campus Project (No specific event)</option>
                  {opportunities.map(opp => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} ({opp.category})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#88909E] mt-1">
                  Connecting your team to an official event helps prospective members discover you faster.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Real-Time IoT Campus Energy Management Dashboard"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
                  Project Vision & Problem Statement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the solution your team is building, why it matters, and what you aim to achieve..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
                  Project Tech Stack & Required Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type or pick a skill (e.g. React, PyTorch, ROS2)..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (skillInput.trim()) handleAddSkill(skillInput.trim());
                      }
                    }}
                    className="flex-1 px-3.5 py-1.5 text-sm bg-white border border-[#D1D5DB] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (skillInput.trim()) handleAddSkill(skillInput.trim());
                    }}
                    className="px-3 py-1.5 bg-[#111418] text-white text-xs font-medium rounded-lg hover:bg-[#1D4ED8]"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedSkills.map(skill => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[#F4F4F1] border border-[#E6E8EB] rounded-md text-[#111418]"
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-[#88909E] hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E6E8EB]">
                  <span className="text-xs text-[#88909E] block mb-1.5">Suggested popular skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {ALL_SKILLS_LIST.slice(0, 10).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="text-[11px] px-2 py-0.5 border border-[#E6E8EB] bg-white hover:bg-[#F4F4F1] text-[#575F6E] rounded"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider">
                Positions You Need To Fill
              </label>

              {/* Added positions list */}
              <div className="space-y-2">
                {positions.map((pos, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#111418]">{pos.title}</div>
                      <div className="text-xs text-[#575F6E]">
                        Skills: {pos.requiredSkills.join(', ')} · {pos.commitmentHours} hrs/week
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePosition(idx)}
                      className="text-[#88909E] hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add position form */}
              <div className="p-3 bg-white border border-[#E6E8EB] rounded-xl space-y-2.5">
                <span className="text-xs font-semibold text-[#111418]">Add an Open Role</span>
                <input
                  type="text"
                  placeholder="Role Title (e.g., ML Inference Engineer, UI Designer)"
                  value={posTitle}
                  onChange={(e) => setPosTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Key skills separated by comma (e.g. PyTorch, Docker)"
                  value={posSkills}
                  onChange={(e) => setPosSkills(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#575F6E]">Hours/wk:</span>
                    <input
                      type="number"
                      min={4}
                      max={40}
                      value={posHours}
                      onChange={(e) => setPosHours(Number(e.target.value))}
                      className="w-16 px-2 py-1 text-xs border border-[#D1D5DB] rounded"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPosition}
                    className="px-3 py-1 text-xs font-medium text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg"
                  >
                    + Add Role
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
                  Collaboration Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Hybrid', 'In-Person', 'Remote'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPreferredMeetingMode(mode)}
                      className={`py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                        preferredMeetingMode === mode
                          ? 'border-[#1D4ED8] bg-[#1D4ED8]/5 text-[#1D4ED8] font-bold'
                          : 'border-[#E6E8EB] bg-white text-[#575F6E] hover:border-[#D1D5DB]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
                  Target Student Backgrounds
                </label>
                <div className="space-y-1.5 text-xs text-[#575F6E]">
                  {['Alliance College of Engineering (B.Tech)', 'Alliance School of Business (BBA / MBA)', 'Alliance School of Law', 'School of Liberal Arts & Design'].map(dept => (
                    <label key={dept} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={true} 
                        className="rounded border-[#D1D5DB] text-[#1D4ED8]" 
                      />
                      <span>{dept}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#F4F4F1] border border-[#E6E8EB] rounded-xl space-y-2">
                <div>
                  <span className="text-[#88909E] uppercase tracking-wider font-semibold block text-[10px]">
                    Team & Project
                  </span>
                  <div className="text-sm font-bold text-[#111418]">{teamName || 'Untitled Team'}</div>
                  <div className="text-[#575F6E]">{projectTitle}</div>
                </div>

                <div className="pt-2 border-t border-[#E6E8EB]">
                  <span className="text-[#88909E] uppercase tracking-wider font-semibold block text-[10px]">
                    Leader & Base
                  </span>
                  <div className="text-[#111418] font-medium">
                    {student.name} ({student.department})
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E6E8EB]">
                  <span className="text-[#88909E] uppercase tracking-wider font-semibold block text-[10px]">
                    Open Roles ({positions.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {positions.map(p => (
                      <span key={p.title} className="px-2 py-0.5 bg-white border border-[#E6E8EB] rounded font-medium">
                        {p.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#88909E] text-center">
                Ready to publish. Students matching your required skills will see your team in their recommendation feed.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-[#E6E8EB] bg-[#FBFBFA] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#575F6E] hover:text-[#111418]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#575F6E] hover:text-[#111418]"
            >
              Cancel
            </button>
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !teamName.trim()) {
                  showToast('Team Name Required', 'Please provide a name for your team.', 'warning');
                  return;
                }
                if (step === 2 && !projectTitle.trim()) {
                  showToast('Project Title Required', 'Please summarize what your team is building.', 'warning');
                  return;
                }
                setStep(step + 1);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-lg transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Publish Team</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
