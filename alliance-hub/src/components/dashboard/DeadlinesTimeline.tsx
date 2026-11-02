import React from 'react';
import { Clock, Calendar, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { Opportunity } from '../../types';

interface DeadlinesTimelineProps {
  opportunities: Opportunity[];
  onSelectOpp: (opp: Opportunity) => void;
}

export const DeadlinesTimeline: React.FC<DeadlinesTimelineProps> = ({
  opportunities,
  onSelectOpp
}) => {
  // Sort opportunities by deadline
  const sorted = [...opportunities].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const urgent = sorted.slice(0, 5);

  return (
    <div className="bg-white border border-[#E6E8EB] rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111418]">
            Upcoming Application Milestones
          </h3>
        </div>
        <span className="text-xs font-mono text-[#88909E]">Chronological Horizon</span>
      </div>

      <div className="relative overflow-x-auto pb-2">
        <div className="flex items-stretch gap-4 min-w-[700px]">
          {urgent.map((opp, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={opp.id}
                onClick={() => onSelectOpp(opp)}
                className={`flex-1 p-3.5 rounded-xl border text-xs cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                  isFirst
                    ? 'border-amber-400 bg-amber-50/40 hover:bg-amber-50/80 shadow-xs'
                    : 'border-[#E6E8EB] bg-[#FBFBFA] hover:border-[#111418] hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className={`font-mono font-bold ${isFirst ? 'text-amber-800' : 'text-[#1D4ED8]'}`}>
                      {opp.deadline}
                    </span>
                    {isFirst && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                        Closing Soon
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-[#111418] line-clamp-2 leading-snug">
                    {opp.title}
                  </h4>

                  <span className="text-[11px] text-[#575F6E] mt-1 block truncate">
                    {opp.organizer}
                  </span>
                </div>

                <div className="pt-2 mt-2 border-t border-[#E6E8EB]/60 flex items-center justify-between text-[11px] text-[#88909E]">
                  <span>{opp.category}</span>
                  <ArrowRight className="w-3 h-3 text-[#575F6E]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
