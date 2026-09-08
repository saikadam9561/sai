import React from "react";
import { 
  QrCode, 
  Clock, 
  Calendar, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Printer, 
  WifiOff, 
  ShieldCheck,
  ArrowRight,
  Share2,
  AlertCircle
} from "lucide-react";
import { FarmerToken, Language, ProcurementCenter } from "../types";

interface DigitalTokenPassProps {
  token: FarmerToken;
  center?: ProcurementCenter;
  language: Language;
  onViewLiveQueue: () => void;
  onStartCheckIn?: () => void;
}

export const DigitalTokenPass: React.FC<DigitalTokenPassProps> = ({
  token,
  center,
  language,
  onViewLiveQueue,
  onStartCheckIn,
}) => {
  const currentServing = center?.currentServingToken || 84;
  const difference = Math.max(0, token.tokenNumber - currentServing);
  const estimatedWaitMins = difference * 2.5; // ~2.5 mins per digital scale unload

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden p-6 sm:p-8 max-w-2xl mx-auto mb-8 relative">
      {/* Decorative top band */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>Government of Maharashtra • e-Procurement Gate Pass</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === "mr" ? "स्मार्ट ई-टोकन पास" : language === "hi" ? "स्मार्ट ई-टोकन पास" : "Digital Mandi Token Pass"}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-emerald-200 block font-mono">TOKEN NUMBER</span>
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white drop-shadow-xs">
              #{token.tokenNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Live Queue Pulse Card */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            #{currentServing}
          </div>
          <div>
            <span className="text-xs text-emerald-800 font-bold block">
              {language === "mr" ? "सध्या केंद्रावर सुरू असलेला नंबर" : "Currently Now Serving at Mandi"}
            </span>
            <p className="text-xs text-emerald-950">
              {difference === 0 ? (
                <strong className="text-emerald-700">YOUR TURN! Proceed to Weighbridge Gate 2</strong>
              ) : (
                <>
                  <strong className="font-bold text-emerald-900">{difference} farmers</strong> ahead of you (~{Math.round(estimatedWaitMins)} mins wait)
                </>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewLiveQueue}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
        >
          <span>Live Queue Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Details and QR Code */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center mb-6">
        {/* Visual Simulated High-Res QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center">
          <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-stone-300 shadow-xs flex flex-col items-center justify-center relative">
            {/* SVG stylized QR code */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900" fill="currentColor">
              {/* Corner 1 */}
              <rect x="5" y="5" width="26" height="26" fill="black" />
              <rect x="9" y="9" width="18" height="18" fill="white" />
              <rect x="13" y="13" width="10" height="10" fill="black" />
              {/* Corner 2 */}
              <rect x="69" y="5" width="26" height="26" fill="black" />
              <rect x="73" y="9" width="18" height="18" fill="white" />
              <rect x="77" y="13" width="10" height="10" fill="black" />
              {/* Corner 3 */}
              <rect x="5" y="69" width="26" height="26" fill="black" />
              <rect x="9" y="73" width="18" height="18" fill="white" />
              <rect x="13" y="77" width="10" height="10" fill="black" />
              {/* Pattern data blocks */}
              <rect x="36" y="8" width="6" height="6" />
              <rect x="48" y="14" width="6" height="6" />
              <rect x="36" y="24" width="8" height="6" />
              <rect x="52" y="26" width="6" height="8" />
              <rect x="10" y="38" width="6" height="8" />
              <rect x="22" y="44" width="8" height="6" />
              <rect x="38" y="38" width="12" height="12" />
              <rect x="58" y="42" width="6" height="6" />
              <rect x="70" y="38" width="10" height="6" />
              <rect x="84" y="44" width="6" height="12" />
              <rect x="38" y="60" width="8" height="8" />
              <rect x="54" y="58" width="10" height="6" />
              <rect x="42" y="76" width="6" height="12" />
              <rect x="56" y="72" width="12" height="6" />
              <rect x="74" y="68" width="8" height="8" />
              <rect x="86" y="80" width="8" height="8" />
              <rect x="70" y="86" width="8" height="6" />
            </svg>
            <span className="text-[9px] font-mono text-stone-600 mt-1 block">
              {token.id}
            </span>
          </div>
          <span className="text-[11px] text-stone-500 mt-2 block">
            Scan at Weighbridge In-Gate
          </span>
        </div>

        {/* Core Metadata */}
        <div className="sm:col-span-2 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">{language === "mr" ? "शेतकऱ्याचे नाव" : "Farmer Name"}</span>
            <span className="font-bold text-stone-900">{token.farmerName}</span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">{language === "mr" ? "खरेदी केंद्र" : "Procurement Center"}</span>
            <span className="font-bold text-stone-900 text-right">{token.centerName}</span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">{language === "mr" ? "शेतमाल व अंदाजे वजन" : "Commodity & Quantity"}</span>
            <span className="font-bold text-emerald-800">
              {token.commodity} • {token.estimatedQuantityQtl} Quintals
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">{language === "mr" ? "वाहन क्रमांक" : "Vehicle & Reg. No"}</span>
            <span className="font-bold font-mono text-stone-900">
              {token.vehicleType} ({token.vehicleNumber})
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">{language === "mr" ? "आरक्षित तारीख व वेळ" : "Reserved Date & Slot"}</span>
            <span className="font-bold text-stone-900 font-mono">
              {token.date} • {token.timeSlot}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-stone-500">Aadhaar Verification</span>
            <span className="font-mono text-stone-700">•••• •••• {token.aadhaarLast4} (Verified)</span>
          </div>
        </div>
      </div>

      {/* Offline capability reminder */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between text-xs mb-6">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4 text-emerald-600" />
          <span className="text-stone-700">
            {language === "mr" 
              ? "हा पास तुमच्या फोनमध्ये सेव्ह आहे. इंटरनेट नसतानाही गेटवर दाखवता येईल." 
              : "This QR token pass works 100% offline without internet connection."}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
          Offline Ready
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass / PDF</span>
          </button>
        </div>

        {onStartCheckIn && (
          <button
            type="button"
            onClick={onStartCheckIn}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <span>Simulate Gate Check-in</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
