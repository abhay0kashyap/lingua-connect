
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole } from "../types";
import { GEMINI_MODEL } from "../constants";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBotResponse = async (
  history: Message[],
  userMessage: string,
  targetLanguage: string,
  nativeLanguage: string,
  personaName: string
): Promise<{ text: string; translatedText: string }> => {
  const ai = getAIClient();

  if (!ai) {
    return {
      text: `[Mock ${targetLanguage}] Hello from ${personaName}`,
      translatedText: `[Mock ${nativeLanguage}] Hello from ${personaName}`
    };
  }

  try {
    const systemPrompt = `
      You are a language tutor persona named ${personaName}. 
      User speaks: ${nativeLanguage}.
      User is learning: ${targetLanguage}.

      RULES:
      1. Reply in ${targetLanguage} naturally.
      2. Provide a translation in ${nativeLanguage}.
      3. Be casual, human, and encouraging.
      
      OUTPUT JSON:
      {
        "text": "Response in ${targetLanguage}",
        "translatedText": "Translation in ${nativeLanguage}"
      }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...history.slice(-6).map(m => ({
          role: m.role === MessageRole.USER ? 'user' : 'model',
          parts: [{ text: m.text }] // Send original text
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      text: parsed.text || "...",
      translatedText: parsed.translatedText || "..."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Connection error...", translatedText: "Error..." };
  }
};
