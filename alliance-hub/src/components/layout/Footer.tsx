import React from 'react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#E6E8EB] bg-[#F4F4F1] text-[#575F6E] py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#111418] text-white flex items-center justify-center font-bold text-xs">
                AH
              </span>
              <span className="font-bold text-[#111418] tracking-tight">Alliance Hub</span>
            </div>
            <p className="text-xs text-[#575F6E] leading-relaxed max-w-xs">
              The centralized campus ecosystem for opportunity discovery, student team formation, and verified portfolios at Alliance University.
            </p>
            <p className="text-xs text-[#88909E]">
              Chikkahagade Cross, Chandapura - Anekal Main Road, Bengaluru, Karnataka 562106
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#111418] uppercase tracking-wider mb-3">
              Explore Ecosystem
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('events')} className="text-[#1D4ED8] font-semibold hover:underline transition-colors">
                  ★ Campus Festivals (Alliance ONE & ALF)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('opportunities')} className="hover:text-[#111418] transition-colors">
                  Hackathons & Competitions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('opportunities')} className="hover:text-[#111418] transition-colors">
                  Industry Internships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('opportunities')} className="hover:text-[#111418] transition-colors">
                  Research Fellowships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('opportunities')} className="hover:text-[#111418] transition-colors">
                  Startup Grants & E-Cell
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#111418] uppercase tracking-wider mb-3">
              Collaboration & Growth
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('teams')} className="hover:text-[#111418] transition-colors">
                  Teammate Matchmaker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('teams')} className="hover:text-[#111418] transition-colors">
                  Open Project Positions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-[#111418] transition-colors">
                  Verified Student Profiles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('applications')} className="hover:text-[#111418] transition-colors">
                  Application Tracker
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#111418] uppercase tracking-wider mb-3">
              University Academic Units
            </h4>
            <p className="text-xs text-[#575F6E] leading-relaxed mb-2">
              Alliance College of Engineering & Design · Alliance School of Business · Alliance School of Law · School of Liberal Arts.
            </p>
            <div className="pt-2 text-xs text-[#88909E]">
              Autonomous Student Initiative supported by Centre for Innovation & Incubation (CII).
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#E6E8EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#88909E]">
          <div>
            © {new Date().getFullYear()} Alliance Hub. Exclusively for Alliance University Students and Faculty.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#111418] cursor-pointer">Honor Code</span>
            <span>·</span>
            <span className="hover:text-[#111418] cursor-pointer">Verification Guidelines</span>
            <span>·</span>
            <span className="hover:text-[#111418] cursor-pointer">Support: hub@alliance.edu.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
