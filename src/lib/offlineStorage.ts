import { FarmerToken, Language, ProcurementCenter, ProduceJourneyRecord } from "../types";
import { INITIAL_CENTERS, INITIAL_SAMPLE_JOURNEY } from "../data/mockData";

const STORAGE_KEYS = {
  LANGUAGE: "kisansetu_lang",
  SAVED_JOURNEY: "kisansetu_journey",
  OUTBOX_TOKENS: "kisansetu_outbox_tokens",
  CACHED_CENTERS: "kisansetu_cached_centers",
  IS_OFFLINE_FORCED: "kisansetu_offline_forced",
};

export const offlineStorage = {
  getLanguage(): Language {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (val === "mr" || val === "hi" || val === "en") return val;
    } catch {
      // ignore
    }
    return "mr"; // Default Marathi for regional context
  },

  setLanguage(lang: Language) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch {
      // ignore
    }
  },

  isOfflineForced(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_OFFLINE_FORCED) === "true";
    } catch {
      return false;
    }
  },

  setOfflineForced(forced: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.IS_OFFLINE_FORCED, forced ? "true" : "false");
    } catch {
      // ignore
    }
  },

  getStoredJourney(): ProduceJourneyRecord {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_JOURNEY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_SAMPLE_JOURNEY;
  },

  saveJourney(journey: ProduceJourneyRecord) {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_JOURNEY, JSON.stringify(journey));
    } catch {
      // ignore
    }
  },

  getStoredCenters(): ProcurementCenter[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_CENTERS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_CENTERS;
  },

  saveCenters(centers: ProcurementCenter[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CACHED_CENTERS, JSON.stringify(centers));
    } catch {
      // ignore
    }
  },

  getOutboxTokens(): FarmerToken[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OUTBOX_TOKENS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [];
  },

  queueTokenForSync(token: FarmerToken) {
    try {
      const existing = this.getOutboxTokens();
      existing.push(token);
      localStorage.setItem(STORAGE_KEYS.OUTBOX_TOKENS, JSON.stringify(existing));
    } catch {
      // ignore
    }
  },

  clearSyncedTokens() {
    try {
      localStorage.removeItem(STORAGE_KEYS.OUTBOX_TOKENS);
    } catch {
      // ignore
    }
  },
};
