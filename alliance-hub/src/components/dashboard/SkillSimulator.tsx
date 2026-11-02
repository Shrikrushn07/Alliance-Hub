import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Opportunity, Student } from '../../types';
import { calculateOpportunityMatch } from '../../services/storageService';

interface SkillSimulatorProps {
  student: Student;
  opportunities: Opportunity[];
  onSelectOpp: (opp: Opportunity) => void;
}

export const SkillSimulator: React.FC<SkillSimulatorProps> = ({
  student,
  opportunities,
  onSelectOpp
}) => {
  // Let student choose an opportunity to simulate
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunities[0]?.id || '');
  // Simulated acquired skills
  const [simulatedSkills, setSimulatedSkills] = useState<string[]>([]);

  const targetOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0];

  if (!targetOpp) return null;

  // Create simulated student copy
  const simulatedStudent: Student = {
    ...student,
    skills: [...student.skills, ...simulatedSkills]
  };

  const initialMatch = calculateOpportunityMatch(student, targetOpp);
  const simulatedMatch = calculateOpportunityMatch(simulatedStudent, targetOpp);

  const missingSkills = initialMatch.missingSkills;

  const toggleSimulatedSkill = (skill: string) => {
    if (simulatedSkills.includes(skill)) {
      setSimulatedSkills(simulatedSkills.filter(s => s !== skill));
    } else {
      const next = [...simulatedSkills, skill];
      setSimulatedSkills(next);

      // Recalculate
      const testStudent: Student = {
        ...student,
        skills: [...student.skills, ...next]
      };
      const newScore = calculateOpportunityMatch(testStudent, targetOpp).score;
      if (newScore >= 90) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#1D4ED8', '#059669', '#111418']
        });
      }
    }
  };

  return (
    <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E8EB]">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Skill Gap Simulator</span>
          </div>
          <h3 className="text-base font-bold text-[#111418] mt-0.5">
            Simulate Your Match Trajectory
          </h3>
          <p className="text-xs text-[#575F6E]">
            Test how acquiring key missing competencies impacts your eligibility for high-tier campus roles.
          </p>
        </div>

        {/* Opportunity Picker */}
        <select
          value={selectedOppId}
          onChange={(e) => {
            setSelectedOppId(e.target.value);
            setSimulatedSkills([]);
          }}
          className="px-3 py-1.5 text-xs font-semibold bg-[#F4F4F1] border border-[#E6E8EB] rounded-lg max-w-xs truncate"
        >
          {opportunities.slice(0, 8).map(opp => (
            <option key={opp.id} value={opp.id}>
              {opp.title}
            </option>
          ))}
        </select>
      </div>

      {/* Simulator Comparison Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Score delta showcase */}
        <div className="md:col-span-5 bg-[#FBFBFA] border border-[#E6E8EB] rounded-xl p-4 text-center space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#88909E]">
            Match Probability
          </span>

          <div className="flex items-center justify-center gap-3">
            <div className="text-left">
              <span className="text-[10px] text-[#88909E] block">Baseline</span>
              <span className="text-2xl font-mono font-bold text-[#575F6E] tabular-nums">
                {initialMatch.score}%
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-[#88909E]" />

            <div className="text-left">
              <span className="text-[10px] text-[#1D4ED8] font-semibold block">Simulated</span>
              <span className="text-3xl font-mono font-extrabold text-[#1D4ED8] tabular-nums">
                {simulatedMatch.score}%
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="w-full h-2 bg-[#E6E8EB] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1D4ED8] rounded-full transition-all duration-300"
                style={{ width: `${simulatedMatch.score}%` }}
              />
            </div>
          </div>

          <span className="text-[11px] text-emerald-700 font-semibold block">
            {simulatedMatch.score > initialMatch.score 
              ? `+${simulatedMatch.score - initialMatch.score}% readiness gain achieved`
              : 'Toggle skills below to simulate readiness boost'}
          </span>
        </div>

        {/* Missing Skills Toggles & Actionable Roadmaps */}
        <div className="md:col-span-7 space-y-3">
          <div className="text-xs font-semibold text-[#111418]">
            Click to simulate mastering missing skills:
          </div>

          {missingSkills.length === 0 ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>You already hold 100% of the verified prerequisite competencies for this role!</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map(skill => {
                const isToggled = simulatedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSimulatedSkill(skill)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isToggled
                        ? 'bg-[#1D4ED8] text-white shadow-sm ring-2 ring-[#1D4ED8]/30 font-bold'
                        : 'bg-white border border-[#D1D5DB] text-[#575F6E] hover:border-[#111418] hover:text-[#111418]'
                    }`}
                  >
                    <span>{isToggled ? '✓ Simulated' : '+ Test'} {skill}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Actionable Learning Route */}
          {targetOpp.learningRoadmap && targetOpp.learningRoadmap.length > 0 && (
            <div className="pt-2 text-xs space-y-1.5">
              <span className="text-[#88909E] text-[11px] block font-medium">
                Recommended Alliance University preparation lab:
              </span>
              <a
                href={targetOpp.learningRoadmap[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:underline"
              >
                <span>{targetOpp.learningRoadmap[0].resourceName} (~{targetOpp.learningRoadmap[0].estimatedHours}h)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
