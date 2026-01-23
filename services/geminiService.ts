
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, Recommendation } from "../types";

export const getFragranceRecommendation = async (mood: Mood): Promise<Recommendation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Recommend a luxury fragrance vibe for a person feeling "${mood}". 
    The tone should be sophisticated, poetic, and exclusive. 
    Refer to elements like Oudh, Bergamot, or Rose if they fit.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fragranceName: { type: Type.STRING, description: 'A creative name for the recommended scent vibe' },
          reason: { type: Type.STRING, description: 'A short poetic explanation of why it fits the mood' },
          vibe: { type: Type.STRING, description: 'One word describing the essence (e.g. Etherial, Commanding)' }
        },
        required: ['fragranceName', 'reason', 'vibe']
      }
    }
  });

  return JSON.parse(response.text);
};
