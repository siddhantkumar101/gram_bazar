import { useState, useCallback, useEffect, useRef } from "react";

const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  // Load voices (they load asynchronously)
  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = useCallback((text, lang = "hi-IN") => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    // Try to find best matching voice
    const preferred = voices.find(v => v.lang === lang)
      || voices.find(v => v.lang.startsWith("hi"))
      || voices.find(v => v.lang.startsWith("en-IN"))
      || null;
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback((text, lang) => {
    if (isSpeaking) stop();
    else speak(text, lang);
  }, [isSpeaking, speak, stop]);

  return { speak, stop, toggle, isSpeaking, supported: !!window.speechSynthesis };
};

export default useTTS;
