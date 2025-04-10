import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

/**
 * Generates a legal response based on the provided user message, legal context, and language.
 * 
 * @param message The user's question
 * @param context Legal context information to inform the AI's response
 * @param language The language to respond in (defaults to English)
 * @returns A string containing the AI's response
 */
export async function generateLegalResponse(
  message: string,
  context: string,
  language: string = "English"
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const prompt = `
You are a helpful legal assistant trained to analyze Ugandan legal documents and answer questions clearly and accurately.

Context:
${context}

Question (original language: ${language}):
${message}

Instructions:
- If the context is in a different language, translate it to English internally before answering.
- Base your answer strictly on the provided context. If the answer is not in the context, say: "The document does not contain enough information to answer this."
- Summarize any long sections as needed.
- Keep the answer concise and formal, in the same language as the original question (${language}).

Answer:
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful legal assistant specializing in Ugandan law." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Return a friendly error message
    return "I apologize, but I'm currently experiencing technical difficulties. Please try again later.";
  }
}
