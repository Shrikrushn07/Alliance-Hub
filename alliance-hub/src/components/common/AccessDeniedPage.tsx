import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { AuthUser } from '../../services/apiService';

interface AccessDeniedPageProps {
  currentUser?: AuthUser | null;
  requiredRole: string;
  targetPageName?: string;
  onReturnToSafeWorkspace: () => void;
  onSwitchRole?: (roleId: string) => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  currentUser,
  requiredRole,
  targetPageName = 'Privileged Administrative Console',
  onReturnToSafeWorkspace,
  onSwitchRole
}) => {
  const userName = currentUser?.name || 'Authenticated User';
  const currentRole = currentUser?.role || 'student';
  const universityId = currentUser?.universityId || 'AU2024-STD-0842';
  const department = currentUser?.department || 'Alliance University';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
          HTTP 403 Forbidden · Security Access Policy Violation
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111418]">
          Restricted University Jurisdiction
        </h1>
        <p className="text-sm text-[#575F6E] max-w-lg mx-auto leading-relaxed">
          You are authenticated as <strong>{userName}</strong> with role{' '}
          <span className="font-mono font-semibold uppercase text-[#111418] bg-[#F4F4F1] px-2 py-0.5 rounded">
            {currentRole}
          </span>. Access to the <em>{targetPageName}</em> requires privileged{' '}
          <span className="font-mono font-semibold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            {requiredRole}
          </span> credentials.
        </p>
      </div>

      {/* Security Details Card */}
      <div className="p-4 bg-[#FBFBFA] border border-[#E6E8EB] rounded-2xl text-left text-xs space-y-2 text-[#575F6E]">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#88909E] pb-2 border-b border-[#E6E8EB]">
          <span>Security Audit Logged:</span>
          <span>{new Date().toISOString()}</span>
        </div>
        <div>
          <span className="font-semibold text-[#111418]">Actor University ID:</span> {universityId}
        </div>
        <div>
          <span className="font-semibold text-[#111418]">Department:</span> {department}
        </div>
        <div>
          <span className="font-semibold text-[#111418]">Policy:</span> RBAC Server-Side Route Guard Policy 4.2
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onReturnToSafeWorkspace}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#111418] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to My Authorized Workspace</span>
        </button>

        {onSwitchRole && (
          <div className="flex items-center gap-1.5 text-xs text-[#575F6E]">
            <span>Or test as:</span>
            <button
              onClick={() => onSwitchRole('user-admin-01')}
              className="font-semibold text-[#1D4ED8] hover:underline"
            >
              Administrator
            </button>
            <span>·</span>
            <button
              onClick={() => onSwitchRole('user-faculty-01')}
              className="font-semibold text-[#1D4ED8] hover:underline"
            >
              Faculty
            </button>
            <span>·</span>
            <button
              onClick={() => onSwitchRole('user-organizer-01')}
              className="font-semibold text-[#1D4ED8] hover:underline"
            >
              Organizer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
