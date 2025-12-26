import { GoogleGenAI } from "@google/genai";
import { PORTFOLIO_DATA } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing");
      throw new Error("API Key missing");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const generateChatResponse = async (
  userMessage: string, 
  history: { role: 'user' | 'model'; text: string }[]
) => {
  try {
    const client = getClient();
    
    // Construct system instruction with portfolio context
    const systemInstruction = `
      You are an AI assistant living inside the portfolio website of ${PORTFOLIO_DATA.name}.
      
      Here is the portfolio data you need to know:
      ${JSON.stringify(PORTFOLIO_DATA, null, 2)}
      
      Your personality:
      - Witty, slightly sarcastic, and technically knowledgeable.
      - You adopt the "Neo-Brutalist" vibe of the website (bold, direct, confident).
      - You love discussing code, design trends, and why brutalism is better than minimalism.
      - Keep responses relatively concise (under 100 words) unless asked for a deep dive.
      - If asked about something not in the data, creatively pivot back to the portfolio or admit ignorance with style.
      
      Formatting:
      - Use Markdown for code blocks or emphasis.
    `;

    // Format history for Gemini SDK
    // Note: The SDK manages history in Chat sessions, but for simplicity in this stateless service wrapper
    // we will pass previous context manually or use a fresh chat if history is short.
    // For a robust implementation, we'd persist the chat object, but here we'll regenerate the chat
    // context each turn to ensure statelessness in the service function.
    
    const chat = client.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error 500: Neural link severed. Please check your API key or try again later.";
  }
};
