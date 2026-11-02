import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { CampusFestival } from '../../types';

interface FestivalCardProps {
  festival: CampusFestival;
  subEventCount?: number;
  onSelect: (festival: CampusFestival) => void;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  subEventCount = 0,
  onSelect
}) => {
  return (
    <div 
      onClick={() => onSelect(festival)}
      className="group relative bg-white border border-[#E6E8EB] hover:border-[#111418] rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
    >
      {/* Visual Masthead Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img 
          src={festival.heroImage} 
          alt={festival.title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111418] via-black/40 to-transparent" />
        
        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-white/95 text-[#111418] rounded-lg shadow-sm">
            Major Festival
          </span>
          {festival.verificationStatus === 'Verified' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-[#1D4ED8] text-white rounded-lg shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Festival</span>
            </span>
          )}
        </div>

        {/* Floating Bottom Information */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-[11px] font-mono text-white/80 uppercase tracking-wider mb-0.5">
            {festival.startDate} — {festival.endDate}
          </div>
          <h3 className="text-xl font-extrabold tracking-tight text-white leading-snug group-hover:text-blue-200 transition-colors">
            {festival.title}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {festival.theme && (
            <div className="text-xs font-semibold text-[#1D4ED8] font-mono">
              Theme: "{festival.theme}"
            </div>
          )}

          <p className="text-xs text-[#575F6E] line-clamp-2 leading-relaxed">
            {festival.description}
          </p>

          {/* Metadata Grid */}
          <div className="pt-3 border-t border-[#E6E8EB] space-y-1.5 text-xs text-[#575F6E]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#88909E] shrink-0" />
              <span className="truncate">{festival.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#88909E] shrink-0" />
              <span>Organized by <strong className="text-[#111418]">{festival.organizer}</strong></span>
            </div>
          </div>

          {/* Participating Clubs */}
          {festival.participatingClubs && festival.participatingClubs.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1">
              {festival.participatingClubs.slice(0, 3).map((club, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] px-2 py-0.5 bg-[#F4F4F1] border border-[#E6E8EB] text-[#575F6E] rounded font-medium"
                >
                  {club}
                </span>
              ))}
              {festival.participatingClubs.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 text-[#88909E]">
                  +{festival.participatingClubs.length - 3} clubs
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer strip with sub-events count and Action */}
        <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111418] font-mono">
            <Layers className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>{subEventCount} Sub-Events & Competitions</span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1D4ED8] group-hover:translate-x-1 transition-transform">
            <span>Explore Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
