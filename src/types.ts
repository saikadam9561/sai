export type Language = "mr" | "hi" | "en";

export type CommodityType = "Soybean" | "Cotton" | "Wheat" | "Gram" | "Maize";

export interface ProcurementCenter {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  district: string;
  districtMr?: string;
  distanceKm: number;
  currentWaiting: number;
  avgWaitMins: number;
  status: "congested" | "moderate" | "fast";
  recommendation: "avoid" | "acceptable" | "recommended";
  currentServingToken: number;
  activeWeighbridges: number;
  todayTokensRemaining: number;
  tomorrowTokensAvailable: number;
  openingTime: string;
  closingTime: string;
}

export interface FarmerToken {
  id: string;
  tokenNumber: number;
  farmerName: string;
  farmerPhone: string;
  aadhaarLast4: string;
  centerId: string;
  centerName: string;
  commodity: CommodityType;
  estimatedQuantityQtl: number;
  date: string;
  timeSlot: string;
  vehicleType: "Tractor Trolley" | "Pickup Truck" | "Bullock Cart" | "Tempo";
  vehicleNumber: string;
  status: "reserved" | "in_gate" | "weighed" | "completed" | "cancelled";
  createdAt: string;
  isOfflineSynced: boolean;
}

export interface QualityGradingResult {
  sampleBatchId: string;
  moisturePercent: number;
  foreignMatterPercent: number;
  grade: "Grade A (FAQ)" | "Grade B (Standard)" | "Re-cleaning Advised";
  status: "Passed" | "Conditional" | "Rejected";
  inspectorName: string;
  testedAt: string;
}

export interface WeighbridgeSlip {
  grossWeightKg: number;
  tareVehicleWeightKg: number;
  netWeightKg: number;
  netWeightQuintal: number;
  gunnyBagsCount: number;
  tarePerBagKg: number;
  weighedAt: string;
  weighbridgeId: string;
  operatorId: string;
}

export interface PaymentReconciliationRecord {
  paymentId: string;
  status: "pending" | "approved" | "reconciled_credited";
  grossAmount: number;
  moistureDeduction: number;
  foreignMatterDeduction: number;
  bagSubsidyCredit: number;
  netPayableAmount: number;
  bankAccountMasked: string;
  ifscCode: string;
  utrNumber: string;
  reconciledAt: string;
  latencyMs: number;
}

export interface ProduceJourneyRecord {
  tokenId: string;
  token: FarmerToken;
  currentStage: 1 | 2 | 3 | 4 | 5; // 1: Booked, 2: Gate-In, 3: Quality Check, 4: Weighbridge, 5: Payment DBT
  stagesTimestamps: {
    booked: string;
    checkedIn?: string;
    graded?: string;
    weighed?: string;
    paid?: string;
  };
  grading?: QualityGradingResult;
  weighbridge?: WeighbridgeSlip;
  payment?: PaymentReconciliationRecord;
}

export interface SmartNotification {
  id: string;
  type: "turn_warning" | "schedule_change" | "payment_credit" | "crowd_surge";
  title: string;
  titleMr: string;
  titleHi: string;
  message: string;
  messageMr: string;
  messageHi: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  audioUrl?: string;
  language: Language;
}
