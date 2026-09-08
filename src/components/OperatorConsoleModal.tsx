import React, { useState } from "react";
import { 
  Building2, 
  X, 
  Scale, 
  FlaskConical, 
  Banknote, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2,
  RefreshCw,
  Zap
} from "lucide-react";
import { Language, ProcurementCenter, ProduceJourneyRecord } from "../types";

interface OperatorConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  center: ProcurementCenter;
  journey: ProduceJourneyRecord;
  onUpdateJourney: (updated: ProduceJourneyRecord) => void;
  onAdvanceToken: () => void;
  onSimulateSurge: () => void;
}

export const OperatorConsoleModal: React.FC<OperatorConsoleModalProps> = ({
  isOpen,
  onClose,
  language,
  center,
  journey,
  onUpdateJourney,
  onAdvanceToken,
  onSimulateSurge,
}) => {
  const [moistureInput, setMoistureInput] = useState(journey.grading?.moisturePercent || 11.2);
  const [netWeightInput, setNetWeightInput] = useState(journey.weighbridge?.netWeightQuintal || 42.4);
  const [isProcessingDBT, setIsProcessingDBT] = useState(false);

  if (!isOpen) return null;

  const handleUpdateQualityAndWeight = () => {
    const grossPrice = Number(netWeightInput) * 4892;
    const bagSubsidy = 85 * 3.5;
    const penalty = moistureInput > 12 ? (moistureInput - 12) * 500 : 0;
    const netPayable = grossPrice - penalty + bagSubsidy;

    const updated: ProduceJourneyRecord = {
      ...journey,
      currentStage: 4,
      grading: {
        sampleBatchId: `LAB-SMP-${Math.floor(1000 + Math.random() * 9000)}`,
        moisturePercent: Number(moistureInput),
        foreignMatterPercent: 1.1,
        grade: moistureInput <= 12 ? "Grade A (FAQ)" : "Grade B (Standard)",
        status: "Passed",
        inspectorName: "S. K. Deshmukh (Agri Quality Officer)",
        testedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      weighbridge: {
        grossWeightKg: Math.round(Number(netWeightInput) * 100 + 4180),
        tareVehicleWeightKg: 4180,
        netWeightKg: Math.round(Number(netWeightInput) * 100),
        netWeightQuintal: Number(netWeightInput),
        gunnyBagsCount: 85,
        tarePerBagKg: 0.8,
        weighedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        weighbridgeId: "WB-02-DIGITAL",
        operatorId: "OP-VISHWAS-12",
      },
      payment: {
        paymentId: `PFMS-MH-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "approved",
        grossAmount: grossPrice,
        moistureDeduction: penalty,
        foreignMatterDeduction: 0,
        bagSubsidyCredit: bagSubsidy,
        netPayableAmount: netPayable,
        bankAccountMasked: "State Bank of India (•••4291)",
        ifscCode: "SBIN0004128",
        utrNumber: `CMS${Date.now().toString().slice(-10)}X`,
        reconciledAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        latencyMs: 12,
      },
    };

    onUpdateJourney(updated);
  };

  const handleInstantDisburseDBT = () => {
    setIsProcessingDBT(true);
    setTimeout(() => {
      setIsProcessingDBT(false);
      if (journey.payment) {
        onUpdateJourney({
          ...journey,
          currentStage: 5,
          payment: {
            ...journey.payment,
            status: "reconciled_credited",
            reconciledAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            latencyMs: 11,
          },
          stagesTimestamps: {
            ...journey.stagesTimestamps,
            paid: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} (Reconciled in 11ms)`,
          },
        });
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Mandi Operations & Queue Control Console
            </h2>
            <p className="text-xs text-stone-500">
              {center.name} • Active Weighbridge Gate 2
            </p>
          </div>
        </div>

        <div className="space-y-5 text-xs">
          {/* Queue Speed & Call Token */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-stone-800 text-sm mb-2 flex items-center justify-between">
              <span>Live Queue Dispatch</span>
              <span className="font-mono text-emerald-700">Currently Serving: #{center.currentServingToken}</span>
            </h4>
            <p className="text-stone-600 mb-3 leading-relaxed">
              Advance the line to test proactive farmer SMS notifications and turn countdown alerts.
            </p>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onAdvanceToken}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Call Next Token (+1)</span>
              </button>

              <button
                type="button"
                onClick={onSimulateSurge}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold flex items-center space-x-1.5 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Inject Traffic Surge</span>
              </button>
            </div>
          </div>

          {/* Electronic Scale & Quality Entry */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-stone-800 text-sm mb-2 flex items-center justify-between">
              <span>Gate 2 Scale & Lab Rapid Entry</span>
              <span className="text-stone-500 font-mono">Token #{journey.token.tokenNumber}</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Moisture Content (%):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={moistureInput}
                  onChange={(e) => setMoistureInput(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-mono text-sm bg-white"
                />
                <span className="text-[10px] text-stone-500">FAQ limit: max 12.0%</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Net Weight (Quintals):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={netWeightInput}
                  onChange={(e) => setNetWeightInput(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-mono text-sm bg-white"
                />
                <span className="text-[10px] text-stone-500">Tare deducted automatically</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpdateQualityAndWeight}
              className="w-full py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold transition-colors"
            >
              Update Lab & Weighbridge Reading
            </button>
          </div>

          {/* DBT Settlement Trigger */}
          <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-900 text-sm">
                Instant Sub-Second DBT Disbursement
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-mono font-bold text-[10px]">
                PFMS / Aadhaar Ready
              </span>
            </div>
            <p className="text-emerald-900/80 mb-3">
              Simulate 0-delay instant Direct Benefit Transfer reconciliation to farmer's bank account.
            </p>
            <button
              type="button"
              onClick={handleInstantDisburseDBT}
              disabled={isProcessingDBT}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center space-x-1.5 shadow-md transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isProcessingDBT ? "Reconciling via PFMS..." : "Simulate 0ms Real-Time Payout Disbursal"}</span>
            </button>
          </div>
        </div>

        <div className="pt-4 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
          >
            Close Operator Console
          </button>
        </div>
      </div>
    </div>
  );
};
