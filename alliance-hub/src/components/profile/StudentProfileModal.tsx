import React from 'react';
import { X, Check, ExternalLink, Github, Linkedin, Award, FolderGit2, Sparkles, UserPlus } from 'lucide-react';
import { Student } from '../../types';
import { storageService, calculateTeammateCompatibility } from '../../services/storageService';
import { useToast } from '../ui/ToastContext';

interface StudentProfileModalProps {
  student: Student | null;
  currentStudent: Student;
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange?: () => void;
  onOpenInviteModal?: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  currentStudent,
  isOpen,
  onClose,
  onConnectionChange,
  onOpenInviteModal
}) => {
  const { showToast } = useToast();

  if (!isOpen || !student) return null;

  const isCurrent = student.id === currentStudent.id;
  const isConnected = storageService.isStudentConnected(student.id);
  const compat = calculateTeammateCompatibility(currentStudent, student);

  const handleToggleConnect = () => {
    const connectedNow = storageService.toggleConnect(student.id);
    showToast(
      connectedNow ? 'Connection Request Sent' : 'Connection Removed',
      connectedNow 
        ? `Connected with ${student.name}.` 
        : `Removed ${student.name} from connections.`,
      'info'
    );
    if (onConnectionChange) onConnectionChange();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in duration-200"
        role="dialog"
      >
        {/* Header banner */}
        <div className="h-24 bg-gradient-to-r from-[#111418] via-[#1D4ED8]/80 to-[#111418] relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <img 
              src={student.avatar} 
              alt={student.name} 
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
            />
            {!isCurrent && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleConnect}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isConnected 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white border border-[#D1D5DB] text-[#575F6E] hover:text-[#111418]'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </>
                  )}
                </button>

                {onOpenInviteModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenInviteModal(student);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors shadow-xs"
                  >
                    <span>Invite to Squad</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#111418]">{student.name}</h2>
              {student.verifiedStudent && (
                <span className="text-[11px] font-medium text-[#1D4ED8] bg-[#1D4ED8]/10 px-2 py-0.5 rounded-full">
                  Verified Alliance Student
                </span>
              )}
            </div>
            <div className="text-xs text-[#575F6E] mt-0.5">
              {student.degree} · {student.year} · {student.campus}
            </div>
            {student.suggestedRole && (
              <div className="text-xs font-semibold text-[#1D4ED8] mt-1 font-mono">
                Suggested Role: {student.suggestedRole}
              </div>
            )}
          </div>

          <p className="text-xs text-[#575F6E] mt-3 leading-relaxed">
            {student.bio}
          </p>

          {/* Compatibility Breakdown (if viewing another student) */}
          {!isCurrent && (
            <div className="my-4 p-3.5 bg-[#F4F4F1] border border-[#E6E8EB] rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#111418]">Team Compatibility Score</span>
                <span className="font-mono font-bold text-[#1D4ED8]">{compat.score}% Synergy</span>
              </div>
              <p className="text-[#575F6E] text-[11px]">
                {compat.explanation}
              </p>
              {compat.complementarySkills.length > 0 && (
                <div className="text-[11px] pt-1 border-t border-[#E6E8EB] flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#88909E]">Complementary Skills:</span>
                  {compat.complementarySkills.slice(0, 4).map(s => (
                    <span key={s} className="font-medium text-[#111418]">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-[#111418] uppercase tracking-wider mb-2">
              Verified Technical Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map(s => (
                <span 
                  key={s}
                  className="px-2.5 py-1 text-xs font-medium bg-[#FBFBFA] border border-[#E6E8EB] rounded-md text-[#111418]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Projects */}
          {student.projects && student.projects.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-[#111418] uppercase tracking-wider mb-2">
                Featured Projects
              </h4>
              <div className="space-y-2">
                {student.projects.map(proj => (
                  <div 
                    key={proj.id}
                    className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111418]">{proj.title}</span>
                      <span className="text-[#88909E]">{proj.role}</span>
                    </div>
                    <p className="text-[#575F6E] text-[11px] leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1 text-[10px] text-[#88909E]">
                      {proj.techStack.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internship & Research Experience */}
          {student.experiences && student.experiences.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-[#111418] uppercase tracking-wider mb-2">
                Internships & Lab Fellowships
              </h4>
              <div className="space-y-2">
                {student.experiences.map(exp => (
                  <div 
                    key={exp.id}
                    className="p-3 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111418]">{exp.role}</span>
                      <span className="text-[11px] font-mono text-[#88909E]">{exp.period}</span>
                    </div>
                    <div className="text-[11px] text-[#1D4ED8] font-medium">{exp.companyOrLab}</div>
                    <p className="text-[#575F6E] text-[11px] leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {student.achievements && student.achievements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-[#111418] uppercase tracking-wider mb-1.5">
                Honors & Certifications
              </h4>
              <ul className="space-y-1 text-xs text-[#575F6E]">
                {student.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#1D4ED8] mt-0.5">•</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="mt-5 pt-3 border-t border-[#E6E8EB] flex items-center justify-between text-xs text-[#575F6E]">
            <div className="flex items-center gap-3">
              {student.githubUrl && (
                <a 
                  href={student.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#111418]"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {student.linkedinUrl && (
                <a 
                  href={student.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#111418]"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
            <span className="text-[11px] text-[#88909E]">
              Available: ~{student.availabilityHoursPerWeek} hrs/wk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
