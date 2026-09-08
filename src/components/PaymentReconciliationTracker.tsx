import React, { useState } from "react";
import { 
  Banknote, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Printer, 
  ExternalLink,
  Receipt,
  Download,
  Building,
  Check
} from "lucide-react";
import { Language, ProduceJourneyRecord } from "../types";

interface PaymentReconciliationTrackerProps {
  journey: ProduceJourneyRecord;
  language: Language;
}

export const PaymentReconciliationTracker: React.FC<PaymentReconciliationTrackerProps> = ({
  journey,
  language,
}) => {
  const [showJFormModal, setShowJFormModal] = useState(false);
  const payment = journey.payment;

  if (!payment) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 mb-8 text-center">
        <Clock className="w-8 h-8 text-stone-400 mx-auto mb-2" />
        <h3 className="text-base font-bold text-stone-800">
          Payment Calculation In Progress
        </h3>
        <p className="text-xs text-stone-500">
          Weighbridge weight and quality certification must conclude before real-time DBT reconciliation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-5 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>0ms Sub-Second Transaction Reconciliation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {language === "mr" ? "पारदर्शक पेमेंट व थेट बँक जमा (DBT)" : "Direct Benefit Transfer & Payment Ledger"}
          </h2>
          <p className="text-xs text-stone-500">
            Government of India PFMS (Public Financial Management System) Integrated
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowJFormModal(true)}
          className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center space-x-2 shadow-md transition-all"
        >
          <Receipt className="w-4 h-4 text-emerald-400" />
          <span>{language === "mr" ? "खरेदी पावती (J-Form) उघडा" : "View Official Mandi J-Form"}</span>
        </button>
      </div>

      {/* Main Reconciliation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        {/* Total Net Amount Hero */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-950 text-white p-6 rounded-3xl flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-xs font-semibold text-emerald-300 block mb-1">
              NET DIRECT BENEFIT TRANSFER (DBT)
            </span>
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white block">
              ₹{payment.netPayableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-emerald-400 mt-2 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
              <span>Direct Bank Credit Reconciled in {payment.latencyMs}ms</span>
            </span>
          </div>

          <div className="pt-4 border-t border-emerald-800/60 text-xs text-stone-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-400">Credited To:</span>
              <span className="font-semibold text-white">{payment.bankAccountMasked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">IFSC:</span>
              <span className="font-mono text-white">{payment.ifscCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">UTR / Ref:</span>
              <span className="font-mono text-emerald-300 text-[11px]">{payment.utrNumber}</span>
            </div>
          </div>
        </div>

        {/* Itemized Calculation Breakdown (Full Transparency - Anti-Corruption) */}
        <div className="lg:col-span-2 bg-stone-50 border border-stone-200 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
              {language === "mr" ? "पारदर्शक दर व कपाती तपशील (No Hidden Cuts)" : "Itemized Government MSP Ledger Breakdown"}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-200">
                <span className="text-stone-600">
                  Gross Produce Value (42.4 Qtl @ ₹4,892.00/Qtl MSP)
                </span>
                <span className="font-mono font-bold text-stone-900">
                  + ₹{payment.grossAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-stone-200">
                <span className="text-stone-600">
                  Moisture Content Quality Penalty (11.2% within 12% FAQ limit)
                </span>
                <span className="font-mono font-semibold text-emerald-700">
                  ₹0.00 (Zero Penalty)
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-stone-200">
                <span className="text-stone-600">
                  Foreign Matter & Chaff Deduction (1.1% within limits)
                </span>
                <span className="font-mono font-semibold text-emerald-700">
                  ₹0.00 (Zero Penalty)
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-stone-200">
                <span className="text-stone-600">
                  Gunny Bag Packing Allowance (+₹3.50 × 85 bags)
                </span>
                <span className="font-mono font-semibold text-emerald-700">
                  + ₹{payment.bagSubsidyCredit.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="font-bold text-stone-900 text-sm">
                  Net Transferred Amount
                </span>
                <span className="font-mono font-extrabold text-emerald-800 text-base">
                  ₹{payment.netPayableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 mt-4 border-t border-stone-200 pt-2">
            🛡️ Certified by Electronic Weighbridge Scale #02 & APMC Chief Quality Inspector. No middlemen or unofficial cash deductions allowed.
          </p>
        </div>
      </div>

      {/* J-Form Official Mandi Receipt Modal */}
      {showJFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-300 relative my-6 text-stone-900">
            {/* Header with National / State Emblem Motif */}
            <div className="border-b-2 border-stone-900 pb-4 mb-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-stone-800 mb-1">
                <Building className="w-5 h-5 text-emerald-800" />
                <span className="font-serif font-bold text-sm tracking-wide uppercase">
                  कृषी उत्पन्न बाजार समिती (APMC) / महाराष्ट्र शासन
                </span>
              </div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-stone-900 tracking-tight">
                शेतमाल खरेदी पावती / J-FORM (पावती क्रमांक: {payment.paymentId})
              </h2>
              <p className="text-[11px] text-stone-600 font-serif">
                Authorized Electronic Procurement & DBT Clearance Certificate
              </p>
            </div>

            {/* Receipt Table */}
            <div className="space-y-4 text-xs font-serif">
              <div className="grid grid-cols-2 gap-3 border border-stone-300 p-3 rounded-lg bg-stone-50">
                <div>
                  <span className="text-stone-500 block">शेतकऱ्याचे नाव (Farmer):</span>
                  <strong className="text-stone-900 text-sm">{journey.token.farmerName}</strong>
                  <span className="text-stone-600 block text-[11px] font-mono">
                    Aadhaar: •••• •••• {journey.token.aadhaarLast4}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">खरेदी केंद्र (Center):</span>
                  <strong className="text-stone-900 text-sm">{journey.token.centerName}</strong>
                  <span className="text-stone-600 block text-[11px]">
                    तारीख: {journey.token.date} • वेळ: 10:12 AM
                  </span>
                </div>
              </div>

              {/* Commodities & Weighment Table */}
              <table className="w-full border-collapse border border-stone-300 text-left">
                <thead>
                  <tr className="bg-stone-200 text-stone-800">
                    <th className="border border-stone-300 p-2">तपशील</th>
                    <th className="border border-stone-300 p-2 text-right">वजन / नग</th>
                    <th className="border border-stone-300 p-2 text-right">हमीभाव दर (MSP)</th>
                    <th className="border border-stone-300 p-2 text-right">एकूण रक्कम</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-stone-300 p-2">
                      {journey.token.commodity} (Grade A - FAQ)
                      <span className="block text-[10px] text-stone-500">
                        ओलावा: 11.2% • काडीकचरा: 1.1%
                      </span>
                    </td>
                    <td className="border border-stone-300 p-2 text-right font-mono">
                      {journey.weighbridge?.netWeightQuintal} Qtl ({journey.weighbridge?.gunnyBagsCount} पोती)
                    </td>
                    <td className="border border-stone-300 p-2 text-right font-mono">
                      ₹4,892.00 /Qtl
                    </td>
                    <td className="border border-stone-300 p-2 text-right font-mono font-bold">
                      ₹{payment.grossAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="border border-stone-300 p-2 text-right">
                      बारदाना / पोती अनुदान (85 × ₹3.50)
                    </td>
                    <td className="border border-stone-300 p-2 text-right font-mono text-emerald-800">
                      + ₹{payment.bagSubsidyCredit.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-stone-100 font-bold">
                    <td colSpan={3} className="border border-stone-300 p-2 text-right">
                      एकूण देय रक्कम (Net Payable):
                    </td>
                    <td className="border border-stone-300 p-2 text-right font-mono text-sm text-stone-950">
                      ₹{payment.netPayableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Settlement Verification Block */}
              <div className="border border-stone-300 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase">DBT Transaction Ref</span>
                  <span className="font-mono text-xs font-bold text-stone-900">{payment.utrNumber}</span>
                  <span className="text-[11px] text-emerald-800 block mt-0.5">
                    ✓ स्टेट बँक ऑफ इंडिया (खाते: •••4291) मध्ये जमा
                  </span>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 border border-stone-400 p-1 rounded inline-block bg-white text-center">
                    <span className="text-[8px] block font-mono text-stone-600">SEAL / QR</span>
                    <ShieldCheck className="w-8 h-8 mx-auto text-emerald-700" />
                    <span className="text-[7px] block font-bold text-emerald-800">VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-4 text-center text-xs">
                <div>
                  <span className="border-t border-stone-400 pt-1 inline-block px-4">
                    वजनकाटा ऑपरेटर स्वाक्षरी
                  </span>
                </div>
                <div>
                  <span className="border-t border-stone-400 pt-1 inline-block px-4">
                    सचिव / मुख्य खरेदी अधिकारी (APMC)
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-stone-200 pt-4 mt-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-black transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setShowJFormModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 text-xs font-bold hover:bg-stone-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
