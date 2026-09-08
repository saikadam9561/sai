import express, { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Support multiple cloud API key aliases (GEMINI_API_KEY, CLOUD_API_KEY, GOOGLE_API_KEY)
function getApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.CLOUD_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY
  );
}

// Lazy initialize Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// In-Memory Simulated State for Centers
const procurementCentersState = [
  {
    id: "center-a",
    name: "APMC Lasalgaon Main Yard",
    nameMr: "लासलगाव मुख्य बाजार आवार",
    nameHi: "लासलगांव मुख्य मंडी प्रांगण",
    district: "Nashik, Maharashtra",
    distanceKm: 4.2,
    currentWaiting: 120,
    avgWaitMins: 300, // 5 hours wait
    status: "congested",
    recommendation: "avoid",
    currentServingToken: 48,
    activeWeighbridges: 2,
    todayTokensRemaining: 0,
    tomorrowTokensAvailable: 14,
    openingTime: "08:00 AM",
    closingTime: "06:00 PM",
  },
  {
    id: "center-b",
    name: "Niphad Sub-Market Yard",
    nameMr: "निफाड उपबाजार आवार",
    nameHi: "निफाड उप-मंडी प्रांगण",
    district: "Nashik, Maharashtra",
    districtMr: "नाशिक, महाराष्ट्र",
    distanceKm: 11.5,
    currentWaiting: 45,
    avgWaitMins: 90, // 1.5 hours wait
    status: "moderate",
    recommendation: "acceptable",
    currentServingToken: 62,
    activeWeighbridges: 3,
    todayTokensRemaining: 18,
    tomorrowTokensAvailable: 85,
    openingTime: "08:00 AM",
    closingTime: "06:00 PM",
  },
  {
    id: "center-c",
    name: "Yeola Farmer Direct Hub",
    nameMr: "येवला शेतकरी थेट खरेदी केंद्र",
    nameHi: "येवला किसान सीधा खरीद केंद्र",
    district: "Nashik, Maharashtra",
    districtMr: "नाशिक, महाराष्ट्र",
    distanceKm: 16.0,
    currentWaiting: 30,
    avgWaitMins: 60, // 1 hour wait
    status: "fast",
    recommendation: "recommended",
    currentServingToken: 84,
    activeWeighbridges: 4,
    todayTokensRemaining: 42,
    tomorrowTokensAvailable: 160,
    openingTime: "08:00 AM",
    closingTime: "07:00 PM",
  },
];

// Offline & Non-Gemini Built-in Local Intelligence Engine
function generateLocalMandiResponse(
  query: string,
  language: "mr" | "hi" | "en",
  farmerContext?: {
    tokenNumber?: string;
    commodity?: string;
    currentServingToken?: number;
  }
): string {
  const q = query.toLowerCase();
  const tokenNum = farmerContext?.tokenNumber || "125";
  const curServing = farmerContext?.currentServingToken || 84;
  const numTokenVal = parseInt(tokenNum.replace(/\D/g, ""), 10) || 125;
  const diff = Math.max(0, numTokenVal - curServing);
  const estMinutes = Math.round(diff * 2.5);

  // Intent: Turn / Token timing ("माझा नंबर कधी येईल?", "मेरी बारी कब आएगी?")
  if (
    q.includes("नंबर") ||
    q.includes("बारी") ||
    q.includes("turn") ||
    q.includes("token") ||
    q.includes("कधी") ||
    q.includes("कब") ||
    q.includes("wait")
  ) {
    if (language === "mr") {
      return `तुमचा टोकन नंबर ${numTokenVal} आहे. सध्या केंद्रावर ${curServing} नंबर सुरू आहे. तुमच्या पुढे ${diff} शेतकरी आहेत. अंदाजे ${estMinutes} मिनिटे लागतील. कृपया गेट २ कडे वाहन तयार ठेवा.`;
    } else if (language === "hi") {
      return `आपका टोकन नंबर ${numTokenVal} है। वर्तमान में खरीद केंद्र पर ${curServing} नंबर चल रहा है। आपके आगे ${diff} किसान हैं। अनुमानित समय लगभग ${estMinutes} मिनट लगेगा।`;
    } else {
      return `Your token number is #${numTokenVal}. Center is currently serving #${curServing} (${diff} farmers ahead). Estimated waiting time is ~${estMinutes} minutes.`;
    }
  }

  // Intent: Tomorrow / Schedule ("उद्या खरेदी केंद्र चालू आहे का?", "कल खुला है?")
  if (
    q.includes("उद्या") ||
    q.includes("कल") ||
    q.includes("tomorrow") ||
    q.includes("चालू") ||
    q.includes("खुला") ||
    q.includes("open") ||
    q.includes("वेळ") ||
    q.includes("time")
  ) {
    if (language === "mr") {
      return `हो! उद्या येवला खरेदी केंद्र (Center C) सकाळी ८:०० ते संध्याकाळी ७:०० पर्यंत सुरू आहे. तिथे १६० मोफत टोकन उपलब्ध आहेत व गर्दी सर्वात कमी (फक्त १ तास) आहे. तुम्ही आत्ताच टोकन बुक करू शकता.`;
    } else if (language === "hi") {
      return `हाँ! कल येवला खरीद केंद्र (Center C) सुबह 8:00 से शाम 7:00 बजे तक खुला है। वहां 160 टोकन उपलब्ध हैं और केवल 1 घंटे की प्रतीक्षा है।`;
    } else {
      return `Yes! Yeola Center C is open tomorrow from 8:00 AM to 7:00 PM. 160 tokens are available with lowest waiting time (~1 hour). You can reserve a slot right now.`;
    }
  }

  // Intent: MSP / Price / भाव ("हमीभाव", "MSP", "भाव", "दर", "rate", "price")
  if (
    q.includes("हमीभाव") ||
    q.includes("msp") ||
    q.includes("भाव") ||
    q.includes("दर") ||
    q.includes("rate") ||
    q.includes("price") ||
    q.includes("सोयाबीन") ||
    q.includes("soybean")
  ) {
    if (language === "mr") {
      return `शासकीय हमीभाव (MSP २०२६): सोयाबीन ₹४,८९२/क्विंटल, कापूस ₹७,१२१/क्विंटल, गहू ₹२,२७५/क्विंटल, हरभरा ₹५,४४०/क्विंटल. कोणताही दलाल किंवा आडत्या मधली कपात करू शकत नाही.`;
    } else if (language === "hi") {
      return `सरकारी न्यूनतम समर्थन मूल्य (MSP 2026): सोयाबीन ₹4,892/क्विंटल, कपास ₹7,121/क्विंटल, गेहूं ₹2,275/क्विंटल, चना ₹5,440/क्विंटल। कोई भी बिचौलिया कटौती नहीं कर सकता।`;
    } else {
      return `Current Government MSP Rates (2026): Soybean ₹4,892/Qtl, Cotton ₹7,121/Qtl, Wheat ₹2,275/Qtl, Gram ₹5,440/Qtl. Direct Benefit Transfer is paid at 100% MSP with zero middlemen cuts.`;
    }
  }

  // Intent: Moisture / Quality ("ओलावा", "नमी", "moisture", "quality", "faq")
  if (
    q.includes("ओलावा") ||
    q.includes("नमी") ||
    q.includes("moisture") ||
    q.includes("गुणवत्ता") ||
    q.includes("quality")
  ) {
    if (language === "mr") {
      return `सोयाबीन आणि गव्हासाठी कमाल १२% पर्यंत ओलावा (Moisture) शासनाकडून स्वीकारला जातो. १२% च्या आत असल्यास शून्य दंड लागतो व पूर्ण हमीभाव मिळतो.`;
    } else if (language === "hi") {
      return `सोयाबीन और गेहूं के लिए अधिकतम 12% तक नमी (Moisture) स्वीकृत है। 12% के भीतर होने पर बिना किसी कटौती के पूरा MSP मिलता है।`;
    } else {
      return `Standard Fair Average Quality (FAQ) allows up to 12.0% moisture for Soybean and Wheat. Below 12%, zero penalty applies and 100% MSP is credited.`;
    }
  }

  // Intent: Payment / Bank ("पैसे", "पेमेंट", "खाते", "payment", "bank", "dbt")
  if (
    q.includes("पैसे") ||
    q.includes("पेमेंट") ||
    q.includes("खाते") ||
    q.includes("payment") ||
    q.includes("money") ||
    q.includes("bank") ||
    q.includes("dbt") ||
    q.includes("जमा")
  ) {
    if (language === "mr") {
      return `वजनकाट्यावर वजन होताच PFMS द्वारे थेट बँक खात्यात (DBT) रक्कम तात्काळ (काही मिलीसेकंदात) जमा होते. सोबत अधिकृत डिजिटल खरेदी पावती (J-Form) तयार होते.`;
    } else if (language === "hi") {
      return `कांटा होने के तुरंत बाद PFMS द्वारा आपके बैंक खाते (DBT) में राशि तुरंत जमा हो जाती है। आपको आधिकारिक J-Form डिजिटल रसीद मिलती है।`;
    } else {
      return `Immediately upon electronic weighbridge tare clearance, your net amount is reconciled and credited directly via Direct Benefit Transfer (DBT/PFMS) into your linked bank account with zero delay.`;
    }
  }

  // Default helpful response
  if (language === "mr") {
    return `नमस्कार शेतकरी बंधू! आपण टोकन नंबर, गर्दीची स्थिती, हमीभाव (MSP), किंवा पेमेंटबद्दल विचारू शकता. मी आपल्या सेवेसाठी सदैव सज्ज आहे.`;
  } else if (language === "hi") {
    return `नमस्ते किसान भाई! आप टोकन स्थिति, मंडी में भीड़, समर्थन मूल्य (MSP), या भुगतान से संबंधित कोई भी प्रश्न पूछ सकते हैं।`;
  } else {
    return `Hello farmer friend! You can ask about your token turn countdown, center waiting times, government MSP rates, or instant DBT payment status.`;
  }
}

// REST API Endpoints
app.get("/api/status", (_req: Request, res: Response) => {
  const apiKey = getApiKey();
  const hasValidKey = Boolean(apiKey && apiKey !== "MY_GEMINI_API_KEY");
  res.json({
    status: "ok",
    cloudApiConfigured: hasValidKey,
    provider: hasValidKey ? "google_gemini_cloud" : "built_in_mandi_intelligence",
    offlineFirstSupported: true,
  });
});

app.get("/api/procurement/centers", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: procurementCentersState,
    timestamp: new Date().toISOString(),
  });
});

// Sync offline tokens submitted by rural farmers with low network
app.post("/api/procurement/sync", (req: Request, res: Response) => {
  const { offlineTokens } = req.body;
  const count = Array.isArray(offlineTokens) ? offlineTokens.length : 0;
  res.json({
    success: true,
    syncedCount: count,
    reconciledAt: new Date().toISOString(),
    message: `Synchronized ${count} offline tokens with central mandi ledger.`,
  });
});

// Multi-Lingual AI Voice & Chat Assistant (Supports Cloud Gemini API & Built-in Mandi Engine)
app.post("/api/gemini/chat", async (req: Request, res: Response) => {
  const { message, language = "mr", farmerContext } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const aiClient = getGenAI();

  // If Cloud API Key is not configured, seamlessly use Built-in Mandi Domain Intelligence
  if (!aiClient) {
    const localReply = generateLocalMandiResponse(message, language, farmerContext);
    return res.json({
      reply: localReply,
      source: "built_in_mandi_intelligence",
      language,
    });
  }

  try {
    const systemPrompt = `You are "KisanSetu AI" (किसान सेतू), an empathetic, highly knowledgeable agricultural procurement advisor for Indian farmers in Maharashtra and across India.
Language to respond in: ${language === "mr" ? "Marathi (मराठी)" : language === "hi" ? "Hindi (हिंदी)" : "English"}.
Keep your reply short (1-3 sentences), warm, clear, and reassuring. Farmers may be listening via voice/audio while driving a tractor.
Context:
- Farmer Token: ${farmerContext?.tokenNumber || "MH-NSK-125"}
- Currently Serving at Center: #${farmerContext?.currentServingToken || 84}
- Center A (Lasalgaon): 120 farmers waiting (~5h wait, avoid)
- Center B (Niphad): 45 waiting (~1.5h wait)
- Center C (Yeola): 30 waiting (~1h wait, recommended)
- 2026 MSP Rates: Soybean ₹4,892/Qtl, Cotton ₹7,121/Qtl, Wheat ₹2,275/Qtl.
- Quality: Max 12% moisture FAQ standard.
- Payment: 0ms real-time direct benefit transfer (DBT) via PFMS to Aadhaar-linked bank.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nFarmer Question: ${message}` }] },
      ],
    });

    const replyText = response.text || generateLocalMandiResponse(message, language, farmerContext);
    return res.json({
      reply: replyText,
      source: "google_gemini_cloud",
      language,
    });
  } catch (error) {
    console.error("Gemini API error, falling back to built-in mandi intelligence:", error);
    const fallbackReply = generateLocalMandiResponse(message, language, farmerContext);
    return res.json({
      reply: fallbackReply,
      source: "built_in_mandi_intelligence_fallback",
      language,
    });
  }
});

// Vite Integration (Dev vs Prod)
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true, port: PORT, host: "0.0.0.0" },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KisanSetu Server running on port ${PORT}`);
  });
}

startServer();
