import React from "react";
import { 
  Users, 
  Clock, 
  Scale, 
  CheckCircle2, 
  ArrowUpRight, 
  AlertCircle, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Volume2
} from "lucide-react";
import { Language, ProcurementCenter, FarmerToken } from "../types";

interface LiveQueueDashboardProps {
  center: ProcurementCenter;
  language: Language;
  userToken?: FarmerToken;
  onCallNextToken: () => void;
  isOperator: boolean;
}

export const LiveQueueDashboard: React.FC<LiveQueueDashboardProps> = ({
  center,
  language,
  userToken,
  onCallNextToken,
  isOperator,
}) => {
  const currentToken = center.currentServingToken;
  const userTokenNum = userToken?.tokenNumber || 125;
  const difference = Math.max(0, userTokenNum - currentToken);
  const isApproaching = difference > 0 && difference <= 5;
  const isCurrentTurn = difference === 0;

  // Next 4 tokens in queue
  const upcomingTokens = [
    { token: currentToken + 1, time: "In 3 mins", commodity: "Soybean", vehicle: "MH-15-B-1090" },
    { token: currentToken + 2, time: "In 6 mins", commodity: "Cotton", vehicle: "MH-15-T-8821" },
    { token: currentToken + 3, time: "In 9 mins", commodity: "Wheat", vehicle: "MH-15-D-3211" },
    { token: currentToken + 4, time: "In 12 mins", commodity: "Soybean", vehicle: "MH-15-P-4409" },
  ];

  const weighbridges = [
    { id: "WB-01", name: "Electronic Scale 1 (Tractors)", status: "Active - Unloading #83", speed: "2.4 min/load" },
    { id: "WB-02", name: "Electronic Scale 2 (Small Pickups)", status: "Active - Weighing #84", speed: "1.8 min/load" },
    { id: "WB-03", name: "Electronic Scale 3 (Multi-Crop)", status: "Active - Moisture Sampling", speed: "2.5 min/load" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-5 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {language === "mr" ? "थेट रांग टेलिमेट्री" : "Live Mandi Queue Telemetry"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            {language === "mr" ? center.nameMr : center.name}
          </h2>
          <p className="text-xs text-stone-500">
            {center.district} • {center.activeWeighbridges} {language === "mr" ? "वजनकाटे कार्यरत" : "electronic weighbridges active"}
          </p>
        </div>

        {/* Action button for simulation / operator */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            id="call-next-token-btn"
            type="button"
            onClick={onCallNextToken}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
            title="Advance Queue by 1 token to test live prediction and notification triggers"
          >
            <Volume2 className="w-4 h-4" />
            <span>
              {language === "mr" 
                ? "पुढील टोकन बोलवा (+१)" 
                : "Call Next Token (+1 Advance)"}
            </span>
          </button>
        </div>
      </div>

      {/* Proactive Farmer Turn Notification Banner */}
      {isApproaching && (
        <div className="my-5 p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 flex items-start space-x-3 animate-pulse">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold text-sm block text-amber-900">
              {language === "mr" ? "🔔 तुमचा नंबर जवळ आला आहे!" : "🔔 Smart Alert: Your turn is approaching!"}
            </strong>
            <p className="mt-0.5">
              {language === "mr"
                ? `सध्या टोकन #${currentToken} सुरू आहे. तुमचे टोकन #${userTokenNum} आहे (फक्त ${difference} शेतकरी पुढे). कृपया ट्रॅक्टर वजनकाटा गेट २ कडे आणा.`
                : `Currently serving #${currentToken}. Your token is #${userTokenNum} (${difference} farmers ahead). Please move vehicle towards Gate 2.`}
            </p>
          </div>
        </div>
      )}

      {isCurrentTurn && (
        <div className="my-5 p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-950 flex items-start space-x-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-black text-sm block text-emerald-900">
              {language === "mr" ? "⭐ तुमचा नंबर सुरू झाला आहे!" : "⭐ IT'S YOUR TURN NOW!"}
            </strong>
            <p className="mt-0.5">
              {language === "mr"
                ? `टोकन #${userTokenNum}: कृपया इलेक्ट्रॉनिक वजनकाटा २ वर वाहन घेऊन या.`
                : `Token #${userTokenNum}: Please drive vehicle onto Weighbridge Scale 2 for tare and quality check.`}
            </p>
          </div>
        </div>
      )}

      {/* Main Board: Now Serving vs User Position */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-6">
        {/* NOW SERVING JUMBOTRON */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>NOW SERVING</span>
            </span>
            <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full font-mono">
              Gate 2 Unloading
            </span>
          </div>

          <div className="my-2">
            <span className="text-xs text-stone-400 block mb-1">CURRENT TOKEN NUMBER</span>
            <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-emerald-400">
              #{currentToken}
            </span>
          </div>

          <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
            <span>Pace: <strong>2.3 mins / truck</strong></span>
            <span className="text-emerald-400 font-semibold">Zero Gate Jam</span>
          </div>
        </div>

        {/* YOUR POSITION CARD */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
              {language === "mr" ? "तुमचा टोकन क्रमांक" : "YOUR TOKEN STATUS"}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
              Center C Pass
            </span>
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-950">
                #{userTokenNum}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">
                ({userToken?.commodity || "Soybean"})
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-2">
              {difference === 0 ? (
                <strong className="text-emerald-700">Currently being served!</strong>
              ) : (
                <>
                  <strong className="text-emerald-950 font-bold">{difference} farmers</strong> ahead in line
                  • Estimated wait: <strong className="font-mono">{Math.round(difference * 2.3)} mins</strong>
                </>
              )}
            </p>
          </div>

          <div className="pt-4 border-t border-emerald-200 text-xs text-emerald-700 flex items-center justify-between">
            <span>Slot: <strong>09:30 - 10:30 AM</strong></span>
            <span>Target: <strong>Gate 2 Scale</strong></span>
          </div>
        </div>

        {/* WEIGHBRIDGE METRICS */}
        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-stone-700 tracking-wider uppercase block mb-3">
              Weighbridge Gate Status
            </span>
            <div className="space-y-2.5">
              {weighbridges.map((wb) => (
                <div key={wb.id} className="bg-white p-2.5 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900 block">{wb.id}</span>
                    <span className="text-[11px] text-stone-500">{wb.status}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    {wb.speed}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Queue List */}
      <div>
        <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
          {language === "mr" ? "रांगेतील पुढील टोकन" : "Next In Line (Upcoming Queue)"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {upcomingTokens.map((item, idx) => (
            <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-stone-900 text-sm">
                  #{item.token}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  {item.time}
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 font-medium block mt-1">
                {item.commodity}
              </span>
              <span className="text-[10px] text-stone-400 font-mono block">
                {item.vehicle}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
