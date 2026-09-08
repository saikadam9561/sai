import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Ticket, 
  ListOrdered, 
  Sprout, 
  Banknote, 
  Mic, 
  Sparkles, 
  RefreshCw, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2
} from "lucide-react";
import { CommodityType, FarmerToken, Language, ProcurementCenter, ProduceJourneyRecord, SmartNotification } from "./types";
import { INITIAL_CENTERS, INITIAL_SAMPLE_JOURNEY, INITIAL_NOTIFICATIONS, UI_STRINGS } from "./data/mockData";
import { offlineStorage } from "./lib/offlineStorage";
import { Navbar } from "./components/Navbar";
import { PredictiveSurgeHero } from "./components/PredictiveSurgeHero";
import { SmartTokenBookingModal } from "./components/SmartTokenBookingModal";
import { DigitalTokenPass } from "./components/DigitalTokenPass";
import { LiveQueueDashboard } from "./components/LiveQueueDashboard";
import { ProduceJourneyTracker } from "./components/ProduceJourneyTracker";
import { PaymentReconciliationTracker } from "./components/PaymentReconciliationTracker";
import { FarmerVoiceAssistant } from "./components/FarmerVoiceAssistant";
import { InstantAlertBanner } from "./components/InstantAlertBanner";
import { OperatorConsoleModal } from "./components/OperatorConsoleModal";

export default function App() {
  const [language, setLanguage] = useState<Language>(() => offlineStorage.getLanguage());
  const [isOffline, setIsOffline] = useState<boolean>(() => offlineStorage.isOfflineForced());
  const [isOperatorMode, setIsOperatorMode] = useState<boolean>(false);
  const [centers, setCenters] = useState<ProcurementCenter[]>(() => offlineStorage.getStoredCenters());
  const [journey, setJourney] = useState<ProduceJourneyRecord>(() => offlineStorage.getStoredJourney());
  const [notifications, setNotifications] = useState<SmartNotification[]>(INITIAL_NOTIFICATIONS);
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityType>("Soybean");
  
  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<"prediction" | "pass" | "queue" | "journey" | "payment" | "voice">("prediction");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingCenter, setBookingCenter] = useState<ProcurementCenter>(INITIAL_CENTERS[0]);
  const [bookingDay, setBookingDay] = useState<"today" | "tomorrow">("tomorrow");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Sync state to offline storage
  useEffect(() => {
    offlineStorage.setLanguage(language);
  }, [language]);

  useEffect(() => {
    offlineStorage.setOfflineForced(isOffline);
  }, [isOffline]);

  useEffect(() => {
    offlineStorage.saveJourney(journey);
  }, [journey]);

  useEffect(() => {
    offlineStorage.saveCenters(centers);
  }, [centers]);

  // Fetch live center telemetry from backend if online
  useEffect(() => {
    if (!isOffline) {
      fetch("/api/procurement/centers")
        .then((res) => res.json())
        .then((data) => {
          if (data?.data) {
            setCenters(data.data);
          }
        })
        .catch((err) => {
          console.warn("Using offline cached centers:", err);
        });
    }
  }, [isOffline]);

  // Handle Token Booking Trigger
  const handleOpenBooking = (center: ProcurementCenter, day: "today" | "tomorrow") => {
    setBookingCenter(center);
    setBookingDay(day);
    setIsBookingModalOpen(true);
  };

  // On successful booking
  const handleBookingSuccess = (newToken: FarmerToken) => {
    setIsBookingModalOpen(false);

    // If offline, queue in outbox
    if (isOffline) {
      offlineStorage.queueTokenForSync(newToken);
      setSyncNotice(
        language === "mr"
          ? "टोकन ऑफलाइन सेव्ह झाले आहे. नेटवर्क आल्यावर आपोआप सिंक होईल."
          : "Token saved offline in local storage. Will sync when back online."
      );
    }

    // Update active journey
    const updatedJourney: ProduceJourneyRecord = {
      tokenId: newToken.id,
      token: newToken,
      currentStage: 1,
      stagesTimestamps: {
        booked: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      },
    };
    setJourney(updatedJourney);

    // Add smart notification
    const newNotif: SmartNotification = {
      id: `notif-${Date.now()}`,
      type: "turn_warning",
      title: `Token #${newToken.tokenNumber} Reserved Successfully`,
      titleMr: `टोकन #${newToken.tokenNumber} यशस्वीरित्या आरक्षित`,
      titleHi: `टोकन #${newToken.tokenNumber} सफलतापूर्वक आरक्षित`,
      message: `Your time slot is ${newToken.timeSlot} at ${newToken.centerName}. Digital QR pass is ready.`,
      messageMr: `तुमचा वेळ स्लॉट ${newToken.timeSlot} आहे. डिजिटल QR पास उपलब्ध आहे.`,
      messageHi: `आपका समय स्लॉट ${newToken.timeSlot} है। डिजिटल QR पास तैयार है।`,
      timestamp: "Just now",
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Switch to Digital Pass view
    setActiveTab("pass");
  };

  // Sync Outbox tokens with server
  const handleSyncOfflineData = async () => {
    const outbox = offlineStorage.getOutboxTokens();
    setIsSyncing(true);

    try {
      if (!isOffline) {
        await fetch("/api/procurement/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offlineTokens: outbox }),
        });
      }
      offlineStorage.clearSyncedTokens();
      setSyncNotice(
        language === "mr"
          ? "सर्व स्थानिक डेटा केंद्रीय सर्व्हरशी यशस्वीरित्या सिंक झाला!"
          : "All local offline data synchronized successfully with central server!"
      );
    } catch (e) {
      console.warn("Sync failed:", e);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  // Call next token simulator
  const handleCallNextToken = () => {
    setCenters((prev) =>
      prev.map((c) => {
        if (c.id === journey.token.centerId || c.id === "center-c") {
          const nextServing = c.currentServingToken + 1;
          const nextWaiting = Math.max(0, c.currentWaiting - 1);
          return {
            ...c,
            currentServingToken: nextServing,
            currentWaiting: nextWaiting,
          };
        }
        return c;
      })
    );

    // Check if farmer's turn has arrived or is near
    const activeCenter = centers.find((c) => c.id === journey.token.centerId) || centers[0];
    const diff = journey.token.tokenNumber - (activeCenter.currentServingToken + 1);

    if (diff === 3) {
      const turnAlert: SmartNotification = {
        id: `turn-${Date.now()}`,
        type: "turn_warning",
        title: "Your Turn Approaching (3 Farmers Ahead)",
        titleMr: "तुमचा नंबर जवळ आला आहे (फक्त ३ शेतकरी पुढे)",
        titleHi: "आपकी बारी आने वाली है (केवल ३ किसान आगे)",
        message: `Currently Token #${activeCenter.currentServingToken + 1} called. Move vehicle to Gate 2.`,
        messageMr: `सध्या टोकन #${activeCenter.currentServingToken + 1} सुरू आहे. कृपया वजनकाटा गेट २ जवळ यावे.`,
        messageHi: `वर्तमान में टोकन #${activeCenter.currentServingToken + 1} बुलाया गया है। गेट २ पर आएं।`,
        timestamp: "Just now",
        isRead: false,
      };
      setNotifications((prev) => [turnAlert, ...prev]);
    }
  };

  // Simulate crowd surge at Center A
  const handleSimulateSurge = () => {
    setCenters((prev) =>
      prev.map((c) => {
        if (c.id === "center-a") {
          return {
            ...c,
            currentWaiting: c.currentWaiting + 35,
            avgWaitMins: c.avgWaitMins + 60,
          };
        }
        return c;
      })
    );

    const surgeAlert: SmartNotification = {
      id: `surge-${Date.now()}`,
      type: "crowd_surge",
      title: "Severe Queue Alert at Lasalgaon Mandi",
      titleMr: "लासलगाव केंद्रावर मोठी गर्दीचा इशारा",
      titleHi: "लासलगांव केंद्र पर भारी भीड़ चेतावनी",
      message: "Unload queue now exceeds 5.5 hours. Center C (Yeola) is strongly advised.",
      messageMr: "लासलगाव येथे ५.५ तासांपेक्षा जास्त प्रतीक्षा आहे. येवला केंद्र C निवडावे.",
      messageHi: "लासलगांव में ५.५ घंटे से अधिक प्रतीक्षा है। येवला केंद्र C चुनें।",
      timestamp: "Just now",
      isRead: false,
    };
    setNotifications((prev) => [surgeAlert, ...prev]);
  };

  const activeCenter = centers.find((c) => c.id === journey.token.centerId) || centers[0];
  const strings = UI_STRINGS[language];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-emerald-500 selection:text-white pb-20">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        isOperatorMode={isOperatorMode}
        onToggleOperatorMode={() => setIsOperatorMode(!isOperatorMode)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onSyncOfflineData={handleSyncOfflineData}
        isSyncing={isSyncing}
        activeTokenNumber={journey.token.tokenNumber}
      />

      {/* Sync or Offline Warning Notification Bar */}
      {syncNotice && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center space-x-2 transition-all">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncNotice}</span>
        </div>
      )}

      {isOffline && (
        <div className="bg-amber-600 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span>
            {language === "mr" 
              ? "आपण ऑफलाइन मोडमध्ये आहात. तुमचे टोकन व पावती फोनवर सेव्ह आहेत." 
              : "Rural Offline Mode Active: Tokens and receipts remain accessible without network."}
          </span>
        </div>
      )}

      {/* Operator Mode Ribbon if active */}
      {isOperatorMode && (
        <div className="bg-indigo-900 text-indigo-100 text-xs py-2 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-indigo-300" />
            <span className="font-bold">APMC Mandi Administrator Mode Active</span>
            <span className="hidden sm:inline text-indigo-300">
              • Test queue progression, lab test entries, and 0ms DBT settlements
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOperatorModalOpen(true)}
            className="px-3 py-0.5 rounded-md bg-indigo-700 hover:bg-indigo-600 text-white font-bold"
          >
            Open Mandi Console
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Navigation Tabs Bar for Seamless Switching */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 border-b border-stone-200 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("prediction")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "prediction"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>
              {language === "mr" ? "१. गर्दी अंदाज व केंद्र निवड" : "1. Wait Prediction & Centers"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pass")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "pass"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>
              {language === "mr" ? "२. माझे डिजिटल टोकन (QR)" : "2. Digital Token Pass"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "queue"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>
              {language === "mr" ? "३. थेट रांग बोर्ड (Live Queue)" : "3. Live Mandi Queue"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("journey")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "journey"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>
              {language === "mr" ? "४. शेतमाल डिजिटल ट्रॅकिंग" : "4. Digital Produce Journey"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("payment")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "payment"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>
              {language === "mr" ? "५. पारदर्शक पेमेंट (DBT)" : "5. Payment & J-Form"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("voice")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === "voice"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Mic className="w-4 h-4 text-emerald-600" />
            <span>
              {language === "mr" ? "६. AI व्हॉइस सहाय्यक" : "6. Farmer Voice AI"}
            </span>
          </button>
        </div>

        {/* Tab 1: Smart Wait Prediction & Center Recommendation */}
        {activeTab === "prediction" && (
          <div>
            <PredictiveSurgeHero
              language={language}
              centers={centers}
              onSelectCenterForBooking={handleOpenBooking}
              selectedCommodity={selectedCommodity}
              onSelectCommodity={setSelectedCommodity}
            />

            {/* Live Queue Board Preview right underneath */}
            <LiveQueueDashboard
              center={activeCenter}
              language={language}
              userToken={journey.token}
              onCallNextToken={handleCallNextToken}
              isOperator={isOperatorMode}
            />
          </div>
        )}

        {/* Tab 2: Digital Token Pass */}
        {activeTab === "pass" && (
          <DigitalTokenPass
            token={journey.token}
            center={activeCenter}
            language={language}
            onViewLiveQueue={() => setActiveTab("queue")}
            onStartCheckIn={() => {
              setJourney({
                ...journey,
                currentStage: 2,
                stagesTimestamps: {
                  ...journey.stagesTimestamps,
                  checkedIn: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
                },
              });
              setActiveTab("journey");
            }}
          />
        )}

        {/* Tab 3: Live Mandi Queue Board */}
        {activeTab === "queue" && (
          <LiveQueueDashboard
            center={activeCenter}
            language={language}
            userToken={journey.token}
            onCallNextToken={handleCallNextToken}
            isOperator={isOperatorMode}
          />
        )}

        {/* Tab 4: Digital Produce Journey */}
        {activeTab === "journey" && (
          <ProduceJourneyTracker
            journey={journey}
            language={language}
            onAdvanceStage={(stage) => setJourney({ ...journey, currentStage: stage })}
            onOpenReceipt={() => setActiveTab("payment")}
          />
        )}

        {/* Tab 5: Transparent Payment Ledger & Reconciled DBT */}
        {activeTab === "payment" && (
          <PaymentReconciliationTracker
            journey={journey}
            language={language}
          />
        )}

        {/* Tab 6: Farmer AI Voice Assistant */}
        {activeTab === "voice" && (
          <FarmerVoiceAssistant
            language={language}
            activeToken={journey.token}
            currentServingToken={activeCenter.currentServingToken}
          />
        )}

        {/* Always-accessible Voice Assistant Drawer preview on other tabs */}
        {activeTab !== "voice" && (
          <div className="mt-8 border-t border-stone-200 pt-8">
            <FarmerVoiceAssistant
              language={language}
              activeToken={journey.token}
              currentServingToken={activeCenter.currentServingToken}
            />
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <SmartTokenBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        center={bookingCenter}
        day={bookingDay}
        language={language}
        initialCommodity={selectedCommodity}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Smart Alerts Drawer */}
      <InstantAlertBanner
        notifications={notifications}
        language={language}
        onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Mandi Operator Console Modal */}
      <OperatorConsoleModal
        isOpen={isOperatorModalOpen}
        onClose={() => setIsOperatorModalOpen(false)}
        language={language}
        center={activeCenter}
        journey={journey}
        onUpdateJourney={setJourney}
        onAdvanceToken={handleCallNextToken}
        onSimulateSurge={handleSimulateSurge}
      />
    </div>
  );
}
