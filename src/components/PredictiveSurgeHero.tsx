import React, { useState } from "react";
import { 
  Building2, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Star, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  TrendingDown, 
  AlertTriangle,
  Scale,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { CommodityType, Language, ProcurementCenter } from "../types";
import { MSP_RATES } from "../data/mockData";

interface PredictiveSurgeHeroProps {
  language: Language;
  centers: ProcurementCenter[];
  onSelectCenterForBooking: (center: ProcurementCenter, day: "today" | "tomorrow") => void;
  selectedCommodity: CommodityType;
  onSelectCommodity: (c: CommodityType) => void;
}

export const PredictiveSurgeHero: React.FC<PredictiveSurgeHeroProps> = ({
  language,
  centers,
  onSelectCenterForBooking,
  selectedCommodity,
  onSelectCommodity,
}) => {
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("tomorrow");

  const commodities: { id: CommodityType; name: string; mr: string; hi: string }[] = [
    { id: "Soybean", name: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" },
    { id: "Cotton", name: "Cotton", mr: "कापूस", hi: "कपास" },
    { id: "Wheat", name: "Wheat", mr: "गहू", hi: "गेहूं" },
    { id: "Gram", name: "Gram (Chana)", mr: "हरभरा (चना)", hi: "चना" },
    { id: "Maize", name: "Maize (Makka)", mr: "मका", hi: "मक्का" },
  ];

  const msp = MSP_RATES[selectedCommodity];

  return (
    <section className="mb-8">
      {/* Hero Header & Value Proposition */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === "mr" 
                ? "कृत्रिम बुद्धिमत्ता आधारित गर्दी व वेळ अंदाज" 
                : language === "hi"
                ? "AI आधारित भीड़ एवं समय भविष्यवाणी"
                : "Predictive Wait-Time & Smart Routing Engine"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {language === "mr" ? (
              <>शेतकऱ्याला ताटकळत ठेवू नका;<br className="hidden sm:inline" /> सिस्टीमने वेळेचे अचूक नियोजन करावे.</>
            ) : language === "hi" ? (
              <>किसान को इंतजार न करवाएं;<br className="hidden sm:inline" /> सिस्टम समय का सटीक प्रबंधन करे।</>
            ) : (
              <>Don't make farmers wait for the system;<br className="hidden sm:inline" /> make the system predict and manage the wait time.</>
            )}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-emerald-100/80 leading-relaxed">
            {language === "mr" 
              ? "उद्या शेतमाल विकायचा आहे का? कोणत्या केंद्रावर किती गर्दी आहे ते आधीच तपासा आणि थेट १ तासात हमीभावाने विक्री करा."
              : language === "hi"
              ? "क्या कल अपनी फसल बेचनी है? पहले ही जांचें किस केंद्र पर कितनी भीड़ है और 1 घंटे में सीधे समर्थन मूल्य पर बेचें।"
              : "Compare live mandi congestion before leaving your farm. Route to less crowded centers and eliminate 5+ hour gate jams."}
          </p>

          {/* Commodity & Day Filter Bar */}
          <div className="mt-6 pt-5 border-t border-emerald-800/60 flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-emerald-200/90 font-medium">
                {language === "mr" ? "शेतमाल निवडा:" : "Commodity:"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commodities.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectCommodity(item.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      selectedCommodity === item.id
                        ? "bg-white text-emerald-950 shadow-sm font-bold"
                        : "bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/50"
                    }`}
                  >
                    {language === "mr" ? item.mr : language === "hi" ? item.hi : item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Current MSP Badge */}
            <div className="ml-auto inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-800/50 border border-emerald-600/40 text-xs">
              <Scale className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-emerald-200">
                {language === "mr" ? "शासकीय हमीभाव (MSP):" : "Govt MSP:"}
              </span>
              <strong className="text-white font-mono text-sm">
                ₹{msp.ratePerQtl.toLocaleString()}/Qtl
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Center Comparison & Smart Routing Board */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <span>
                {language === "mr" 
                  ? "जवळची खरेदी केंद्र तुलना (Live Wait-Time Comparison)" 
                  : "Nearby Procurement Centers Wait-Time Comparison"}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Real-time gate telemetry updated every 30 seconds • Powered by electronic weighbridge sensors
            </p>
          </div>

          {/* Today vs Tomorrow Day Toggle */}
          <div className="inline-flex items-center bg-stone-200/80 p-1 rounded-2xl border border-stone-300 text-xs">
            <button
              type="button"
              onClick={() => setSelectedDay("today")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                selectedDay === "today"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {language === "mr" ? "आजची स्थिती" : language === "hi" ? "आज की स्थिति" : "Today Live"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedDay("tomorrow")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                selectedDay === "tomorrow"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              ⭐ {language === "mr" ? "उद्यासाठी बुकिंग" : language === "hi" ? "कल के लिए बुकिंग" : "Tomorrow Slot"}
            </button>
          </div>
        </div>

        {/* The 3 Center Cards Grid: Center A vs Center B vs Center C */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {centers.map((center) => {
            const isRecommended = center.recommendation === "recommended";
            const isCongested = center.recommendation === "avoid";
            const tokensAvailable =
              selectedDay === "tomorrow"
                ? center.tomorrowTokensAvailable
                : center.todayTokensRemaining;

            return (
              <div
                key={center.id}
                className={`relative rounded-3xl p-5 sm:p-6 transition-all border flex flex-col justify-between ${
                  isRecommended
                    ? "bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-500/10"
                    : isCongested
                    ? "bg-stone-50 border-stone-200 opacity-90 shadow-sm"
                    : "bg-white border-stone-200 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  {isRecommended ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold tracking-wide uppercase">
                      <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      <span>{language === "mr" ? "शिफारस केलेले केंद्र" : "Recommended Center"}</span>
                    </span>
                  ) : isCongested ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{language === "mr" ? "मोठी गर्दी - टाळा" : "Severe Jam - Avoid"}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === "mr" ? "मध्यम गर्दी" : "Moderate Traffic"}</span>
                    </span>
                  )}

                  <span className="text-xs text-stone-500 font-mono">
                    {center.distanceKm} km {language === "mr" ? "अंतर" : "away"}
                  </span>
                </div>

                {/* Center Title & Location */}
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    {language === "mr" ? center.nameMr : language === "hi" ? center.nameHi : center.name}
                  </h4>
                  <p className="text-xs text-stone-500 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{center.district}</span>
                  </p>
                </div>

                {/* Telemetry Stats Block (Wait time & Queue) */}
                <div className="my-5 p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-3">
                  {/* Estimated Wait */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-600 flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <span>{language === "mr" ? "अंदाजे प्रतीक्षा वेळ:" : "Estimated Wait:"}</span>
                    </span>
                    <span className={`text-base sm:text-lg font-mono font-extrabold ${
                      isRecommended 
                        ? "text-emerald-700" 
                        : isCongested 
                        ? "text-rose-700" 
                        : "text-amber-700"
                    }`}>
                      {center.avgWaitMins >= 60
                        ? `${(center.avgWaitMins / 60).toFixed(1)} ${language === "mr" ? "तास" : "Hours"}`
                        : `${center.avgWaitMins} ${language === "mr" ? "मिनिटे" : "Mins"}`}
                      {isRecommended && " ⭐"}
                      {isCongested && " ❌"}
                    </span>
                  </div>

                  {/* Farmers in Queue */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-600 flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-stone-400" />
                      <span>{language === "mr" ? "रांगेत शेतकरी:" : "Farmers in Queue:"}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-800">
                      {center.currentWaiting} {language === "mr" ? "शेतकरी" : "farmers"}
                    </span>
                  </div>

                  {/* Active Weighbridges */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-600 flex items-center space-x-1.5">
                      <Scale className="w-4 h-4 text-stone-400" />
                      <span>{language === "mr" ? "इलेक्ट्रॉनिक वजनकाटे:" : "Active Weighbridges:"}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      {center.activeWeighbridges} {language === "mr" ? "कार्यरत" : "active"}
                    </span>
                  </div>
                </div>

                {/* Bottom Action / Booking Button */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                    <span>
                      {selectedDay === "tomorrow"
                        ? language === "mr" ? "उद्याचे शिल्लक टोकन:" : "Tomorrow's slots:"
                        : language === "mr" ? "आजचे शिल्लक टोकन:" : "Today's slots:"}
                    </span>
                    <strong className="font-mono text-stone-800">
                      {tokensAvailable} {language === "mr" ? "उपलब्ध" : "available"}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCenterForBooking(center, selectedDay)}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-xs ${
                      isRecommended
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-md"
                        : isCongested
                        ? "bg-stone-200 hover:bg-stone-300 text-stone-700"
                        : "bg-stone-900 hover:bg-black text-white"
                    }`}
                  >
                    <span>
                      {language === "mr"
                        ? isRecommended
                          ? "येथे थेट टोकन बुक करा (वेळ वाचवा)"
                          : "तरीही हे केंद्र निवडा"
                        : isRecommended
                        ? "Book Token Directly (Save 4 Hours)"
                        : "Select Center"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
