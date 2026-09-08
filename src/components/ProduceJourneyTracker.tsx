import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  QrCode, 
  FlaskConical, 
  Scale, 
  Banknote, 
  ChevronRight, 
  ShieldCheck, 
  FileText,
  AlertTriangle
} from "lucide-react";
import { Language, ProduceJourneyRecord } from "../types";

interface ProduceJourneyTrackerProps {
  journey: ProduceJourneyRecord;
  language: Language;
  onAdvanceStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onOpenReceipt: () => void;
}

export const ProduceJourneyTracker: React.FC<ProduceJourneyTrackerProps> = ({
  journey,
  language,
  onAdvanceStage,
  onOpenReceipt,
}) => {
  const currentStage = journey.currentStage;

  const stages = [
    {
      stageNum: 1,
      name: language === "mr" ? "टोकन आरक्षण" : "Token Slot Booked",
      desc: journey.token.timeSlot,
      icon: QrCode,
      time: journey.stagesTimestamps.booked,
    },
    {
      stageNum: 2,
      name: language === "mr" ? "गेट प्रवेश व QR स्कॅन" : "Gate In & QR Check-In",
      desc: "Gate 2 Security Pass",
      icon: ShieldCheck,
      time: journey.stagesTimestamps.checkedIn || "Pending Arrival",
    },
    {
      stageNum: 3,
      name: language === "mr" ? "प्रयोगशाळा गुणवत्ता व ओलावा तपासणी" : "Lab Quality & Moisture Test",
      desc: journey.grading ? `${journey.grading.grade} (${journey.grading.moisturePercent}% Moisture)` : "Awaiting Grain Sampler",
      icon: FlaskConical,
      time: journey.stagesTimestamps.graded || "Pending Inspection",
    },
    {
      stageNum: 4,
      name: language === "mr" ? "इलेक्ट्रॉनिक वजनकाटा" : "Electronic Weighbridge",
      desc: journey.weighbridge ? `Net: ${journey.weighbridge.netWeightQuintal} Qtl (${journey.weighbridge.gunnyBagsCount} Bags)` : "Vehicle on Scale",
      icon: Scale,
      time: journey.stagesTimestamps.weighed || "In Progress",
    },
    {
      stageNum: 5,
      name: language === "mr" ? "शासकीय हमीभाव पेमेंट व पावती" : "MSP DBT Payment & Receipt",
      desc: journey.payment?.status === "reconciled_credited" ? "₹2,07,718.30 Direct Credit (0ms)" : "Pending Signoff",
      icon: Banknote,
      time: journey.stagesTimestamps.paid || "Sub-second Settlement",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-5 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
        <div>
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
            {language === "mr" ? "डिजिटल शेतमाल जीवनचक्र" : "Digital Produce Lifecycle Tracking"}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            {language === "mr" ? "शेतमाल नोंदणी ते थेट पेमेंट प्रवास" : "From Gate Entry to Bank Settlement"}
          </h2>
          <p className="text-xs text-stone-500">
            Token #{journey.token.tokenNumber} • {journey.token.farmerName} • {journey.token.commodity}
          </p>
        </div>

        {/* Action button to trigger receipt or test simulation */}
        <div className="flex items-center space-x-2">
          {currentStage === 5 && (
            <button
              type="button"
              onClick={onOpenReceipt}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>
                {language === "mr" ? "खरेदी पावती पहा (J-Form)" : "View Official J-Form"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 my-8">
        {stages.map((s) => {
          const isPassed = currentStage > s.stageNum;
          const isCurrent = currentStage === s.stageNum;
          const isFuture = currentStage < s.stageNum;
          const Icon = s.icon;

          return (
            <div
              key={s.stageNum}
              onClick={() => onAdvanceStage(s.stageNum as any)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                isCurrent
                  ? "bg-emerald-50 border-2 border-emerald-500 shadow-md shadow-emerald-500/15 ring-2 ring-emerald-500/20"
                  : isPassed
                  ? "bg-stone-50/80 border-emerald-300 text-stone-800"
                  : "bg-stone-50/40 border-stone-200 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                  isCurrent
                    ? "bg-emerald-600 text-white shadow-xs"
                    : isPassed
                    ? "bg-emerald-500 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}>
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-400">
                  STEP {s.stageNum}/5
                </span>
              </div>

              <h4 className="text-xs font-bold text-stone-900 leading-snug mb-1">
                {s.name}
              </h4>
              <p className="text-[11px] text-stone-600 mb-2 leading-tight">
                {s.desc}
              </p>

              <span className="text-[10px] font-mono text-stone-400 block border-t border-stone-200/60 pt-2">
                {s.time}
              </span>

              {isCurrent && (
                <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-wide">
                  Active
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Stage Detail Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        {/* Lab Quality Analysis Card */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {language === "mr" ? "प्रयोगशाळा ओलावा व ग्रेड चाचणी" : "Moisture & Quality Lab Inspection"}
              </h4>
            </div>
            {journey.grading && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {journey.grading.grade}
              </span>
            )}
          </div>

          {journey.grading ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Moisture Content</span>
                <span className="font-bold text-emerald-700">
                  {journey.grading.moisturePercent}% (Limit: max 12.0% • Standard Accepted)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Foreign Matter & Dust</span>
                <span className="font-bold text-stone-800">
                  {journey.grading.foreignMatterPercent}% (Limit: max 2.0%)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Government Inspector</span>
                <span className="font-medium text-stone-700">
                  {journey.grading.inspectorName}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">Lab Batch Ref</span>
                <span className="font-mono text-stone-600">{journey.grading.sampleBatchId}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic py-4 text-center">
              Sample waiting for automatic probe at Gate 2 laboratory...
            </p>
          )}
        </div>

        {/* Weighbridge Tare & Gross Card */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {language === "mr" ? "इलेक्ट्रॉनिक वजनकाटा तपशील" : "Electronic Weighbridge Reading"}
              </h4>
            </div>
            {journey.weighbridge && (
              <span className="text-xs font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                {journey.weighbridge.weighbridgeId}
              </span>
            )}
          </div>

          {journey.weighbridge ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Gross Loaded Weight</span>
                <span className="font-bold font-mono text-stone-800">
                  {journey.weighbridge.grossWeightKg.toLocaleString()} kg
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Tare (Empty Vehicle)</span>
                <span className="font-bold font-mono text-stone-800">
                  - {journey.weighbridge.tareVehicleWeightKg.toLocaleString()} kg
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Gunny Bags Deduction (85 bags @ 0.8kg)</span>
                <span className="font-bold font-mono text-stone-800">
                  - 68 kg
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-stone-900">Net Produce Weight</span>
                <span className="font-extrabold font-mono text-emerald-800 text-sm">
                  {journey.weighbridge.netWeightQuintal} Quintals ({journey.weighbridge.netWeightKg} kg)
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic py-4 text-center">
              Vehicle weighing queued after moisture check...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
