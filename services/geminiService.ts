
import { GoogleGenAI, Type } from "@google/genai";
import { Medicine, Sale } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askPharmacistAI = async (
  prompt: string,
  inventory: Medicine[],
  salesHistory: Sale[]
) => {
  try {
    const context = `
      Current Inventory: ${JSON.stringify(inventory.map(m => ({ 
        name: m.name, 
        stock: m.quantity, 
        expiry: m.expiryDate, 
        lowStock: m.quantity < m.lowStockThreshold 
      })))}
      
      Recent Sales Summary: Total sales count is ${salesHistory.length}.
      
      Instructions: You are a professional pharmacist assistant. Help the user manage the pharmacy, analyze stock trends, suggest restocks based on low stock levels, or answer medical questions based on common knowledge (always with a disclaimer). Be concise and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: context }] },
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI Assistant. Please check your connectivity.";
  }
};

export const getInventorySummary = async (inventory: Medicine[]) => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      criticalItems: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of medicine names that need urgent restocking."
      },
      summary: {
        type: Type.STRING,
        description: "A short 2-sentence summary of the overall inventory health."
      },
      restockPriority: {
        type: Type.STRING,
        enum: ["Low", "Medium", "High"],
        description: "Overall urgency for restocking."
      }
    },
    required: ["criticalItems", "summary", "restockPriority"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this pharmacy inventory and provide a structured JSON health check: ${JSON.stringify(inventory)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (err) {
    return {
      criticalItems: [],
      summary: "Inventory analysis unavailable.",
      restockPriority: "Low"
    };
  }
};
