
import { GoogleGenAI, Type } from "@google/genai";
import { DailyData, Passage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchDailyPassages = async (): Promise<DailyData> => {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3 daily reflective passages for ${today}. 
    Each passage should be meaningful, around 80-120 words. 
    Include one high-quality educational or literary link (like Wikipedia, Project Gutenberg, or reputable news) relevant to the passage's topic.
    Vary the categories: Wisdom, Nature, History, or Science.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          passages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                link: { type: Type.STRING },
                linkLabel: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["id", "title", "content", "link", "linkLabel", "category"]
            }
          }
        },
        required: ["passages"]
      }
    }
  });

  try {
    // Correctly extract text from response and trim as per guidelines
    const jsonStr = response.text?.trim() || "{}";
    const data = JSON.parse(jsonStr);
    return {
      date: today,
      passages: data.passages || []
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format");
  }
};
