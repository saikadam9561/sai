import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Bot, 
  Sparkles, 
  MessageSquare, 
  RefreshCw, 
  CheckCircle2, 
  Cloud, 
  Cpu
} from "lucide-react";
import { ChatMessage, Language, FarmerToken } from "../types";
import { speakText, stopSpeaking, createSpeechRecognizer } from "../lib/speechUtils";

interface FarmerVoiceAssistantProps {
  language: Language;
  activeToken?: FarmerToken;
  currentServingToken: number;
}

export const FarmerVoiceAssistant: React.FC<FarmerVoiceAssistantProps> = ({
  language,
  activeToken,
  currentServingToken,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [engineSource, setEngineSource] = useState<string>("auto-adaptive");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check backend cloud status
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        if (data?.cloudApiConfigured) {
          setEngineSource("Google Cloud Gemini 2.5 Flash");
        } else {
          setEngineSource("Built-in Mandi Intelligence (Offline Resilient)");
        }
      })
      .catch(() => {
        setEngineSource("Built-in Mandi Intelligence (Offline Resilient)");
      });
  }, []);

  // Initialize initial greeting depending on language
  useEffect(() => {
    const greetings: Record<Language, string> = {
      mr: "नमस्कार शेतकरी बंधू! मी आपला किसान सेतू सहाय्यक आहे. आपण बोलून किंवा टाईप करून टोकन नंबर, गर्दी, हमीभाव (MSP) किंवा केंद्राची वेळ याबद्दल विचारू शकता. हे इंटरनेट असो वा नसो, पूर्णपणे काम करते.",
      hi: "नमस्ते किसान भाई! मैं आपका किसान सेतु सहायक हूँ। आप बोलकर या लिखकर टोकन, मंडी में भीड़, समर्थन मूल्य (MSP) या समय के बारे में पूछ सकते हैं। यह इंटरनेट के साथ या बिना इंटरनेट भी काम करता है।",
      en: "Hello farmer friend! I am your KisanSetu Predictive Assistant. Ask me by voice or text about your token status, queue waiting times, MSP rates, or center hours. Operates with or without cloud connectivity.",
    };

    setMessages([
      {
        id: "msg-welcome",
        sender: "assistant",
        text: greetings[language],
        timestamp: "Just now",
        language,
      },
    ]);
  }, [language]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Suggested quick voice questions requested by user
  const quickQuestions: Record<Language, { label: string; query: string }[]> = {
    mr: [
      { label: "माझा नंबर कधी येईल?", query: "माझा नंबर कधी येईल?" },
      { label: "उद्या खरेदी केंद्र चालू आहे का?", query: "उद्या खरेदी केंद्र चालू आहे का?" },
      { label: "सोयाबीनचा हमीभाव (MSP) काय आहे?", query: "सोयाबीनचा आजचा हमीभाव काय आहे?" },
      { label: "ओलावा किती टक्के चालतो?", query: "ओलावा किती टक्के चालतो?" },
      { label: "पैसे कधी जमा होणार?", query: "माझे पैसे कधी खात्यात जमा होतील?" },
    ],
    hi: [
      { label: "मेरी बारी कब आएगी?", query: "मेरी बारी कब आएगी?" },
      { label: "क्या कल केंद्र खुला रहेगा?", query: "क्या कल खरीद केंद्र खुला रहेगा?" },
      { label: "सोयाबीन का न्यूनतम समर्थन मूल्य (MSP)?", query: "सोयाबीन का आज का MSP क्या है?" },
      { label: "नमी (Moisture) कितनी स्वीकार्य है?", query: "नमी कितने प्रतिशत तक स्वीकार की जाती है?" },
      { label: "भुगतान कब मिलेगा?", query: "फसल का भुगतान कब जमा होगा?" },
    ],
    en: [
      { label: "When will my turn come?", query: "When will my turn come?" },
      { label: "Is center open tomorrow?", query: "Is the procurement center open tomorrow?" },
      { label: "What is Soybean MSP rate?", query: "What is today's government MSP rate for Soybean?" },
      { label: "Moisture limit for crops?", query: "What is the acceptable moisture percentage?" },
    ],
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      language,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          language,
          farmerContext: {
            tokenNumber: activeToken ? `MH-NSK-${activeToken.tokenNumber}` : "MH-NSK-125",
            commodity: activeToken?.commodity || "Soybean (सोयाबीन)",
            currentServingToken,
          },
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "माहिती उपलब्ध होत आहे...";

      if (data.source === "google_gemini_cloud") {
        setEngineSource("Google Cloud Gemini 2.5 Flash");
      } else {
        setEngineSource("Built-in Mandi Intelligence (Edge Resilient)");
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        language,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Automatically speak out the response for rural farmers
      setIsPlayingAudio(true);
      await speakText(replyText, language);
      setIsPlayingAudio(false);
    } catch (e) {
      console.error("Chat error:", e);
      const fallbackReply = language === "mr"
        ? `तुमचा टोकन नंबर ${activeToken?.tokenNumber || 125} आहे. सध्या केंद्रावर ${currentServingToken} नंबर सुरू आहे. साधारण ३० ते ४० मिनिटे लागतील.`
        : `Your token is #${activeToken?.tokenNumber || 125}. Current serving is #${currentServingToken}. Estimated wait is ~30 mins.`;

      const assistantMsg: ChatMessage = {
        id: `assistant-fb-${Date.now()}`,
        sender: "assistant",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        language,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Voice Input (Mic)
  const handleToggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      language,
      (transcript) => {
        setIsListening(false);
        if (transcript) {
          handleSendMessage(transcript);
        }
      },
      (err) => {
        console.warn("STT error:", err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      try {
        setIsListening(true);
        recognizer.start();
      } catch (err) {
        console.warn("Speech start failed:", err);
        setIsListening(false);
      }
    } else {
      alert("Microphone voice recognition is simulated in this browser mode. Please use the quick question chips or type below.");
    }
  };

  const handleStopAudio = () => {
    stopSpeaking();
    setIsPlayingAudio(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden p-5 sm:p-7 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                {language === "mr" 
                  ? "शेतकरी AI व्हॉइस सहाय्यक (मराठी/हिंदी/इंग्रजी)" 
                  : language === "hi" 
                  ? "किसान AI वॉयस सहायक" 
                  : "Farmer AI Voice & Chat Assistant"}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                {engineSource.includes("Gemini") ? (
                  <>
                    <Cloud className="w-3 h-3 text-emerald-700" />
                    <span>Cloud Gemini 2.5 Flash</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3 h-3 text-emerald-700" />
                    <span>Built-in Mandi Engine (Zero-Cloud Ready)</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Voice-first assistance for rural farmers with zero typing required • Operates with Cloud API or offline
            </p>
          </div>
        </div>

        {isPlayingAudio && (
          <button
            type="button"
            onClick={handleStopAudio}
            className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <VolumeX className="w-3.5 h-3.5 text-amber-700" />
            <span>Stop Speaking</span>
          </button>
        )}
      </div>

      {/* Quick Prompts Chips - High Accessibility for low-literacy farmers */}
      <div className="my-4">
        <span className="text-[11px] font-semibold text-stone-500 block mb-2">
          {language === "mr" ? "नेहमी विचारले जाणारे प्रश्न (एका क्लिकवर विचारा):" : "Quick Voice Questions (Click to Ask):"}
        </span>
        <div className="flex flex-wrap gap-2">
          {quickQuestions[language].map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q.query)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-1.5 transition-colors text-left"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="h-64 sm:h-72 overflow-y-auto p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 mb-4">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-2 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-stone-900 text-white rounded-tr-xs"
                    : "bg-white text-stone-900 border border-stone-200 shadow-xs rounded-tl-xs"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-stone-400">
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => speakText(m.text, language)}
                      className="text-emerald-700 hover:text-emerald-900 ml-2 font-medium flex items-center space-x-1"
                      title="Replay speech"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-stone-500 text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>
              {language === "mr" ? "शेतकरी सहाय्यक विचार करत आहे..." : "Assistant is calculating answer..."}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Mic & Send */}
      <div className="flex items-center space-x-2">
        {/* Voice Input Button */}
        <button
          id="assistant-mic-btn"
          type="button"
          onClick={handleToggleMic}
          className={`p-3 rounded-2xl transition-all ${
            isListening
              ? "bg-rose-600 text-white ring-4 ring-rose-400/40 animate-pulse"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
          }`}
          title={isListening ? "Listening... click to stop" : "Click to speak in Marathi or Hindi"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder={
              language === "mr" 
                ? "येथे प्रश्न विचारा किंवा माइक दाबा..." 
                : language === "hi" 
                ? "यहाँ प्रश्न पूछें या माइक दबाएं..." 
                : "Ask question or tap microphone..."
            }
            className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || isLoading}
          className="p-3 rounded-2xl bg-stone-900 hover:bg-black text-white font-semibold disabled:opacity-40 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
