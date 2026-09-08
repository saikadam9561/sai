import React from "react";
import { 
  Sprout, 
  Wifi, 
  WifiOff, 
  Globe, 
  Bell, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Ticket,
  SlidersHorizontal,
  Cloud,
  CheckCircle2
} from "lucide-react";
import { Language, SmartNotification } from "../types";

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  isOperatorMode: boolean;
  onToggleOperatorMode: () => void;
  notifications: SmartNotification[];
  onOpenNotifications: () => void;
  onSyncOfflineData: () => void;
  isSyncing: boolean;
  activeTokenNumber?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  isOffline,
  onToggleOffline,
  isOperatorMode,
  onToggleOperatorMode,
  notifications,
  onOpenNotifications,
  onSyncOfflineData,
  isSyncing,
  activeTokenNumber,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Emblem */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center space-x-1.5">
                <span>KisanSetu</span>
                <span className="text-emerald-400 font-serif">किसान सेतू</span>
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                0ms DBT • Gate e-Pass
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block font-sans">
              Smart Wait-Time Prediction & Direct Benefit Transfer
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Active Token Pill if present */}
          {activeTokenNumber && (
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/50 border border-emerald-700 text-emerald-200 text-xs font-mono font-bold">
              <Ticket className="w-3.5 h-3.5 text-emerald-400" />
              <span>Token #{activeTokenNumber}</span>
            </div>
          )}

          {/* Offline / Online 2G Rural Toggle */}
          <button
            id="toggle-offline-mode"
            type="button"
            onClick={onToggleOffline}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              isOffline
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                : "bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
            }`}
            title="Toggle rural offline storage mode"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Live 4G/5G</span>
              </>
            )}
          </button>

          {/* Sync Outbox Button */}
          <button
            id="sync-outbox-btn"
            type="button"
            onClick={onSyncOfflineData}
            disabled={isSyncing}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs flex items-center transition-colors disabled:opacity-50"
            title="Sync offline tokens & passes with Mandi Central Server"
          >
            <RefreshCw className={`w-4 h-4 text-stone-300 ${isSyncing ? "animate-spin text-emerald-400" : ""}`} />
          </button>

          {/* Language Switcher */}
          <div className="relative inline-flex items-center bg-stone-800 rounded-xl p-0.5 border border-stone-700 text-xs">
            <button
              type="button"
              onClick={() => onLanguageChange("mr")}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                language === "mr"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              मराठी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("hi")}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                language === "hi"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("en")}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                language === "en"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              EN
            </button>
          </div>

          {/* Notifications Bell */}
          <button
            id="notifications-bell-btn"
            type="button"
            onClick={onOpenNotifications}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 relative transition-colors"
            title="Smart Notifications & Turn Alerts"
          >
            <Bell className="w-4 h-4 text-stone-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-stone-950 ring-2 ring-stone-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Mandi Operator Mode Toggle */}
          <button
            id="operator-mode-toggle"
            type="button"
            onClick={onToggleOperatorMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
              isOperatorMode
                ? "bg-indigo-600 text-white border border-indigo-500"
                : "bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700"
            }`}
            title="Toggle APMC Mandi Officer / Operator Simulation Console"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isOperatorMode ? "Operator View" : "Mandi Staff"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
