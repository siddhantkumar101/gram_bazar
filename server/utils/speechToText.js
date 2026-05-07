const { AssemblyAI } = require("assemblyai");

/**
 * Sends remote audio URL to AssemblyAI and returns transcript text.
 * @param {string} audioUrl - Publicly accessible audio URL.
 * @returns {Promise<string>}
 */
const speechToText = async (audioUrl) => {
  if (!process.env.ASSEMBLYAI_API_KEY) return "";

  const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
  const transcript = await client.transcripts.transcribe({ audio: audioUrl });
  return transcript.text || "";
};

module.exports = speechToText;
