import React from "react";
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Language, SmartNotification } from "../types";

interface InstantAlertBannerProps {
  notifications: SmartNotification[];
  language: Language;
  onDismiss: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const InstantAlertBanner: React.FC<InstantAlertBannerProps> = ({
  notifications,
  language,
  onDismiss,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {language === "mr" ? "स्मार्ट सूचना व अलर्ट्स" : "Smart Notifications & Alerts"}
              </h3>
              <p className="text-xs text-stone-500">
                Proactive queue warnings & schedule updates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-stone-100 my-4 max-h-96 overflow-y-auto space-y-3">
          {notifications.map((n) => {
            const title = language === "mr" ? n.titleMr : language === "hi" ? n.titleHi : n.title;
            const msg = language === "mr" ? n.messageMr : language === "hi" ? n.messageHi : n.message;

            return (
              <div
                key={n.id}
                className="pt-3 pb-2 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-900 text-sm">{title}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{n.timestamp}</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{msg}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onDismiss(n.id)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <p className="text-xs text-stone-500 text-center py-6">
              No new alerts. Queue conditions are normal.
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
