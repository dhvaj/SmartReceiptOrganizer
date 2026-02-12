import { GoogleGenAI, Type } from "@google/genai";
import { Receipt } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeReceipt = async (file: File): Promise<Omit<Receipt, 'id' | 'imageUrl'>> => {
  const base64Data = await fileToGenerativePart(file);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data
          }
        },
        {
          text: `Analyze this receipt image. Extract the following details:
          - Vendor Name (store or merchant name)
          - Total Amount (numeric value only)
          - Tax Amount (numeric value only, 0 if not found)
          - Currency (e.g., USD, EUR, GBP)
          - Category (Classify into one of: Dining, Travel, Supplies, Groceries, Entertainment, Utilities, Other)
          - Date (YYYY-MM-DD format, use today's date if not visible)`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vendor: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          tax: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          category: { type: Type.STRING },
          date: { type: Type.STRING }
        },
        required: ["vendor", "amount", "currency", "category", "date"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse receipt data");
  }
};