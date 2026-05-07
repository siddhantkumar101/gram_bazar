import { useState, useRef, useCallback } from "react";

const useVoiceInput = (lang = "hi-IN") => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  const startRecording = useCallback(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Voice not supported. Please use Chrome.");
      return;
    }

    setError("");
    setText("");

    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false; // continuous:true breaks on Android

    recognition.onstart = () => setIsRecording(true);
    
    recognition.onend = () => setIsRecording(false);
    
    recognition.onerror = (e) => {
      setIsRecording(false);
      if (e.error === "no-speech") setError("No speech detected.");
      else if (e.error === "not-allowed") setError("Microphone blocked.");
      else setError("Error: " + e.error);
    };

    recognition.onresult = (e) => {
      let finalStr = "";
      let interimStr = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) finalStr += e.results[i][0].transcript;
        else interimStr += e.results[i][0].transcript;
      }
      setText(finalStr || interimStr);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      setError("Mic already in use.");
    }
  }, [lang]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  return { text, setText, isRecording, toggleRecording, error };
};

export default useVoiceInput;
