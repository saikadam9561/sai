import { Language } from "../types";

export function speakText(text: string, language: Language): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis not supported by browser.");
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const langCodes: Record<Language, string> = {
      mr: "mr-IN",
      hi: "hi-IN",
      en: "en-IN",
    };

    utterance.lang = langCodes[language] || "mr-IN";

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function createSpeechRecognizer(
  language: Language,
  onResult: (transcript: string) => void,
  onError: (error: string) => void,
  onEnd: () => void
): any {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  const langCodes: Record<Language, string> = {
    mr: "mr-IN",
    hi: "hi-IN",
    en: "en-IN",
  };

  recognition.lang = langCodes[language] || "mr-IN";

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error || "Speech recognition error");
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
