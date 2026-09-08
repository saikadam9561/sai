import React, { useState } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Phone, 
  CreditCard, 
  Scale, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { CommodityType, FarmerToken, Language, ProcurementCenter } from "../types";
import { MSP_RATES } from "../data/mockData";

interface SmartTokenBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  center: ProcurementCenter;
  day: "today" | "tomorrow";
  language: Language;
  initialCommodity: CommodityType;
  onBookingSuccess: (token: FarmerToken) => void;
}

export const SmartTokenBookingModal: React.FC<SmartTokenBookingModalProps> = ({
  isOpen,
  onClose,
  center,
  day,
  language,
  initialCommodity,
  onBookingSuccess,
}) => {
  const [commodity, setCommodity] = useState<CommodityType>(initialCommodity);
  const [quantityQtl, setQuantityQtl] = useState<number>(35);
  const [selectedSlot, setSelectedSlot] = useState<string>("09:30 AM - 10:30 AM");
  const [farmerName, setFarmerName] = useState<string>("तुकाराम ज्ञानोबा पाटील (Tukaram Patil)");
  const [farmerPhone, setFarmerPhone] = useState<string>("+91 98221 54321");
  const [aadhaarLast4, setAadhaarLast4] = useState<string>("9014");
  const [vehicleType, setVehicleType] = useState<"Tractor Trolley" | "Pickup Truck" | "Bullock Cart" | "Tempo">("Tractor Trolley");
  const [vehicleNumber, setVehicleNumber] = useState<string>("MH-15-AB-7741");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const msp = MSP_RATES[commodity];
  const estimatedPayout = quantityQtl * msp.ratePerQtl;

  const availableSlots = [
    { slot: "08:30 AM - 09:30 AM", status: "Filling Fast", fast: true },
    { slot: "09:30 AM - 10:30 AM", status: "Recommended (Min Crowd)", fast: true },
    { slot: "11:00 AM - 12:00 PM", status: "Moderate", fast: false },
    { slot: "01:30 PM - 02:30 PM", status: "Available", fast: false },
    { slot: "03:30 PM - 04:30 PM", status: "Available", fast: false },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedTokenNum = Math.floor(115 + Math.random() * 30); // E.g. #125
      const newToken: FarmerToken = {
        id: `MH-NSK-2026-${generatedTokenNum}`,
        tokenNumber: generatedTokenNum,
        farmerName,
        farmerPhone,
        aadhaarLast4,
        centerId: center.id,
        centerName: center.name,
        commodity,
        estimatedQuantityQtl: Number(quantityQtl),
        date: day === "tomorrow" ? "Tomorrow" : "Today",
        timeSlot: selectedSlot,
        vehicleType,
        vehicleNumber: vehicleNumber || "MH-15-TR-1020",
        status: "reserved",
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOfflineSynced: true,
      };

      setIsSubmitting(false);
      onBookingSuccess(newToken);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {language === "mr" 
                ? "थेट डिजिटल हमीभाव स्लॉट आरक्षण" 
                : "Direct Government MSP Time-Slot Booking"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {language === "mr" ? "ई-टोकन पास बुक करा" : "Book e-Procurement Gate Token"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === "mr" ? center.nameMr : center.name} • {center.district}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Estimated MSP Value Alert Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-900 font-bold block">
                  {commodity} • Govt MSP: ₹{msp.ratePerQtl.toLocaleString()}/Qtl
                </span>
                <span className="text-[11px] text-emerald-700">
                  Estimated 100% Direct DBT Value: <strong>₹{estimatedPayout.toLocaleString()}</strong> (0ms Bank Transfer)
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
              {day === "tomorrow" ? "Tomorrow's Slot" : "Today"}
            </span>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>
                {language === "mr" ? "सोयीची वेळ निवडा (Select Time Window)" : "Select Time Slot Window"}
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableSlots.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedSlot(item.slot)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    selectedSlot === item.slot
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200"
                  }`}
                >
                  <span className="font-bold text-xs font-mono">{item.slot}</span>
                  <span className={`text-[10px] mt-1 ${selectedSlot === item.slot ? "text-emerald-100" : "text-stone-500"}`}>
                    {item.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Vehicle Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === "mr" ? "अंदाजे वजन (क्विंटल):" : "Estimated Quantity (Quintals):"}
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={quantityQtl}
                onChange={(e) => setQuantityQtl(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === "mr" ? "वाहन प्रकार:" : "Vehicle Type:"}
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Tractor Trolley">Tractor Trolley (ट्रॅक्टर ट्रॉली)</option>
                <option value="Pickup Truck">Pickup Bolero (पिकअप)</option>
                <option value="Tempo">Tempo / Chhota Hathi (टेम्पो)</option>
                <option value="Bullock Cart">Bullock Cart (बैलगाडी)</option>
              </select>
            </div>
          </div>

          {/* Vehicle Registration & Aadhaar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === "mr" ? "वाहन क्रमांक:" : "Vehicle Number:"}
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="MH-15-AB-1234"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === "mr" ? "आधार शेवटचे ४ अंक (Aadhaar Last 4):" : "Aadhaar Last 4 Digits (DBT Link):"}
              </label>
              <input
                type="text"
                maxLength={4}
                value={aadhaarLast4}
                onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ""))}
                placeholder="9014"
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest"
              />
            </div>
          </div>

          {/* Farmer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === "mr" ? "शेतकऱ्याचे नाव:" : "Farmer Full Name:"}
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === "mr" ? "मोबाईल क्रमांक (SMS अलर्टसाठी):" : "Mobile Number (SMS alerts):"}
              </label>
              <input
                type="text"
                value={farmerPhone}
                onChange={(e) => setFarmerPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-stone-200">
            <button
              id="confirm-booking-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>
                {isSubmitting
                  ? "Generating Verified e-Pass..."
                  : language === "mr"
                  ? "खात्री करा व ई-टोकन पास मिळवा (Generate Pass)"
                  : "Confirm & Generate Digital Token Pass"}
              </span>
            </button>
            <p className="text-[11px] text-stone-500 text-center mt-2">
              🔒 100% Free Government APMC Token • Works without active internet after generation
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
