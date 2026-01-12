import { GoogleGenAI, Type } from "@google/genai";
import { Challenge } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found in environment");
  return new GoogleGenAI({ apiKey });
};

export const generateEcoTip = async (): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Provide a short, catchy, 1-sentence eco-friendly tip for today. Focus on something actionable.",
    });
    return response.text || "Reduce, Reuse, Recycle!";
  } catch (error) {
    console.error("Failed to generate tip:", error);
    return "Every small action counts towards a greener planet.";
  }
};

export const chatWithAssistant = async (message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]): Promise<string> => {
  try {
    const ai = getClient();
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: history,
        config: {
            systemInstruction: "You are EcoBot, a friendly and knowledgeable sustainability assistant. Keep answers concise, encouraging, and practical. Use formatting like bullet points where helpful."
        }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm not sure how to answer that, but I'm learning every day!";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the eco-network right now. Please try again later.";
  }
};

export const findNearbyEcoPlaces = async (lat: number, lng: number, query: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using 2.5-flash for Maps grounding support
      contents: `Find ${query} near this location. List the top 3 results with their names and a brief reason why they are relevant.`,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });
    return response.text || "I couldn't find any specific places nearby at the moment.";
  } catch (error) {
    console.error("Maps grounding error:", error);
    return "Unable to access location services or maps right now.";
  }
};

export const generateCampaignIdea = async (topic: string): Promise<Challenge | null> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a unique, fun, and actionable 30-day eco-friendly community challenge about "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            target: { type: Type.NUMBER },
            unit: { type: Type.STRING },
          },
          required: ["title", "description", "target", "unit"]
        }
      }
    });
    
    const text = response.text;
    if (!text) return null;
    
    const data = JSON.parse(text);
    
    return {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      target: data.target,
      unit: data.unit,
      progress: 0,
      daysLeft: 30,
      participants: 1
    };
  } catch (error) {
    console.error("Campaign gen error:", error);
    return null;
  }
};

export const generateForumReply = async (postContent: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `A user posted this on an eco-community forum: "${postContent}". Write a short, encouraging, and helpful 1-sentence reply as a friendly bot.`,
        });
        return response.text || "That's a great idea! Thanks for sharing.";
    } catch (error) {
        return "Thanks for sharing!";
    }
}

export const analyzeLocalReport = async (description: string): Promise<{category: string, severity: 'Low' | 'Medium' | 'High', summary: string}> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this user report about a local environmental issue: "${description}". Categorize it (e.g. Litter, Maintenance, Wildlife), determine severity (Low/Medium/High), and write a 5-word summary.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            summary: { type: Type.STRING }
          },
          required: ["category", "severity", "summary"]
        }
      }
    });
    
    const text = response.text;
    if (!text) return { category: "General", severity: "Low", summary: "Report received" };
    return JSON.parse(text);
  } catch (error) {
    console.error("Report analysis failed", error);
    return { category: "General", severity: "Low", summary: "Report received" };
  }
};