import React from 'react';
import { 
  Bell, 
  X, 
  Check, 
  ExternalLink, 
  Briefcase, 
  Calendar, 
  Users, 
  Sparkles,
  CheckCheck
} from 'lucide-react';
import { NotificationItem, apiService } from '../../services/apiService';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh,
  onNavigate
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await apiService.markNotificationRead(n.id).catch(() => {});
    }
    onRefresh();
  };

  const handleItemClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      await apiService.markNotificationRead(notif.id).catch(() => {});
      onRefresh();
    }
    if (notif.link) {
      onNavigate(notif.link);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Briefcase className="w-4 h-4 text-[#1D4ED8]" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'application':
      case 'team':
        return <Users className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#575F6E]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-start justify-end p-4 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-white border border-[#E6E8EB] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden mt-12 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E6E8EB] flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#111418]" />
            <h3 className="text-sm font-bold text-[#111418]">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-100 text-[#1D4ED8] font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-[#1D4ED8] hover:underline flex items-center gap-1 px-2 py-1 rounded"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-[#88909E] hover:text-[#111418] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#E6E8EB]">
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-2 p-6">
              <div className="w-10 h-10 rounded-full bg-[#F4F4F1] flex items-center justify-center mx-auto text-[#88909E]">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-[#111418]">No notifications yet</p>
              <p className="text-xs text-[#575F6E]">
                You're all caught up! New opportunity alerts, festival milestones, and application status changes will appear here.
              </p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-3.5 hover:bg-[#FBFBFA] cursor-pointer transition-colors flex items-start gap-3 ${
                  !n.read ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E6E8EB] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#111418] truncate">
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#1D4ED8] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#575F6E] leading-relaxed">
                    {n.message}
                  </p>
                  <div className="text-[10px] text-[#88909E] font-mono flex items-center justify-between pt-1">
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    {n.link && (
                      <span className="text-[#1D4ED8] font-sans font-semibold flex items-center gap-0.5">
                        View <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FBFBFA] border-t border-[#E6E8EB] text-center text-xs text-[#88909E]">
          <span>Alliance Hub Realtime Notification Dispatch</span>
        </div>
      </div>
    </div>
  );
};
