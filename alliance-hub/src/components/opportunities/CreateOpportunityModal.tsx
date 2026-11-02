import React, { useState } from 'react';
import { X, Check, Plus, Trash2, Calendar, MapPin, Award } from 'lucide-react';
import { Opportunity, OpportunityCategory, OpportunityMode } from '../../types';
import { ALL_SKILLS_LIST } from '../../data/mockData';
import { storageService } from '../../services/storageService';
import { apiService } from '../../services/apiService';
import { useToast } from '../ui/ToastContext';

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateOpportunityModal: React.FC<CreateOpportunityModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('Centre for Innovation & Incubation (CII)');
  const [organizerType, setOrganizerType] = useState<Opportunity['organizerType']>('University Department');
  const [category, setCategory] = useState<OpportunityCategory>('Hackathons');
  const [mode, setMode] = useState<OpportunityMode>('Hybrid');
  const [location, setLocation] = useState('Alliance Central Campus, Bengaluru');
  const [department, setDepartment] = useState('Cross-Disciplinary');
  const [deadline, setDeadline] = useState('2026-12-15');
  const [eventDate, setEventDate] = useState('2026-12-20 — 2026-12-22');
  const [stipendOrPrize, setStipendOrPrize] = useState('₹1,50,000 Prize Pool');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('Open to all Alliance University undergraduate and postgraduate students.');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['Python', 'React']);
  const [skillInput, setSkillInput] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [openSpots, setOpenSpots] = useState(50);

  if (!isOpen) return null;

  const handleAddSkill = (skill: string) => {
    if (!requiredSkills.includes(skill)) {
      setRequiredSkills([...requiredSkills, skill]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Missing Fields', 'Please fill in the title and description.', 'warning');
      return;
    }

    const newOpp: Opportunity = {
      id: `opp-custom-${Date.now()}`,
      title: title.trim(),
      organizer: organizer.trim(),
      organizerType,
      verified: true, // auto-verified in prototype
      category,
      mode,
      location: location.trim(),
      department,
      deadline,
      eventDate,
      stipendOrPrize,
      description: description.trim(),
      responsibilities: [
        'Engage actively in project milestones or competitive phases',
        'Demonstrate ethical compliance with academic integrity standards',
        'Present project artifacts during final jury evaluation'
      ],
      eligibility,
      requiredSkills,
      preferredSkills: ['Git', 'FastAPI'],
      externalUrl: externalUrl || 'https://alliance.edu.in',
      totalApplicants: 1,
      openSpots,
      featured: true,
      learningRoadmap: [
        {
          skill: requiredSkills[0] || 'Core Foundation',
          resourceName: 'Alliance Faculty Recommended Lab Guide',
          resourceType: 'University Repository',
          url: 'https://alliance.edu.in/resources',
          estimatedHours: 6
        }
      ]
    };

    storageService.addOpportunity(newOpp);
    apiService.createOpportunity(newOpp).catch(err => console.warn('Backend sync:', err));
    showToast(
      'Opportunity Published',
      `"${title}" is now live for all Alliance University students to discover and apply.`,
      'success'
    );
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in duration-200"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-[#E6E8EB] bg-[#FBFBFA] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider">
              Organizer Publishing Studio
            </span>
            <h3 className="text-base font-bold text-[#111418]">
              Post a New Campus Opportunity
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#88909E] hover:text-[#111418] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Opportunity Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Alliance Aerospace Winter Hackathon 2026"
                className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-xl"
              >
                <option value="Hackathons">Hackathons</option>
                <option value="Internships">Internships</option>
                <option value="Technical Competitions">Technical Competitions</option>
                <option value="Workshops">Workshops</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
                <option value="Research">Research Fellowships</option>
                <option value="Certifications">Certifications</option>
                <option value="University Events">University Events</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as OpportunityMode)}
                className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-xl"
              >
                <option value="In-Person">In-Person</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Virtual">Virtual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Organizing Entity
              </label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Department or Club Name"
                className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Stipend or Prize Pool
              </label>
              <input
                type="text"
                value={stipendOrPrize}
                onChange={(e) => setStipendOrPrize(e.target.value)}
                placeholder="e.g. ₹2,00,000 or ₹25,000/mo"
                className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Capacity / Open Spots
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={openSpots}
                onChange={(e) => setOpenSpots(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Detailed Description & Objectives *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive summary of what students will accomplish..."
                className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Eligibility Criteria
              </label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#D1D5DB] rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1">
                Required Technical & Soft Skills
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter skill and press add..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (skillInput.trim()) handleAddSkill(skillInput.trim());
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-[#D1D5DB] rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (skillInput.trim()) handleAddSkill(skillInput.trim());
                  }}
                  className="px-3 py-1.5 bg-[#111418] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8]"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {requiredSkills.map(s => (
                  <span 
                    key={s} 
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-[#F4F4F1] border border-[#E6E8EB] rounded-md"
                  >
                    {s}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(s)} 
                      className="text-[#88909E] hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#575F6E] hover:text-[#111418]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Publish Opportunity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
