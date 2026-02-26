import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function search() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Find information about the Facebook page 'Ayn's Closet' (https://www.facebook.com/aynscloset). What is their contact information (phone, email, address)? What is their logo URL or description? What specific products or services do they offer? Please provide a detailed summary.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  console.log(response.text);
}

search().catch(console.error);
