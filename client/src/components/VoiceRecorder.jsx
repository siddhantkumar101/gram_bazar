import { useEffect } from "react";
import useVoiceInput from "../hooks/useVoiceInput";

const VoiceRecorder = ({ onText, lang = "hi-IN" }) => {
  const { text, isRecording, toggleRecording, error } = useVoiceInput(lang);

  useEffect(() => {
    // Only pass final text up when recording stops to prevent textarea jumping
    if (!isRecording && text) {
      onText(text);
    }
  }, [isRecording, text, onText]);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={toggleRecording}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-all active:scale-95 ${
          isRecording
            ? "bg-red-500 pulse-ring scale-110"
            : "bg-saffron-gradient shadow-saffron hover:brightness-105"
        }`}
        title={isRecording ? "Tap to stop" : "Tap to speak"}
      >
        {isRecording ? "⏹" : "🎤"}
      </button>

      {isRecording && (
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5 text-xs text-red-600 animate-pulse">
            <span>●</span> Listening... (tap ⏹ to stop)
          </div>
          {text && (
            <div className="max-w-xs bg-gray-800 text-white rounded-xl px-3 py-2 text-xs italic opacity-80">
              {text}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default VoiceRecorder;
