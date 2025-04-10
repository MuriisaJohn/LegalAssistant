import OpenAI from "openai";

class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    // Initialize without API key - will be set dynamically
  }

  /**
   * Initialize OpenAI client with the provided API key
   * @param apiKey The OpenAI API key to use
   */
  private initialize(apiKey: string) {
    if (!this.client || this.client.apiKey !== apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  /**
   * Validate that an API key is provided in the request
   * @param req Express request object
   * @returns The API key from the request
   */
  private getApiKey(req: any): string {
    const apiKey = req.headers["x-api-key"] || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    
    return apiKey as string;
  }

  /**
   * Generate a legal response based on Ugandan law documents
   * @param question The legal question to answer
   * @param language The language to respond in
   * @param context Optional context to include
   * @returns The generated response
   */
  async generateLegalResponse(
    question: string,
    language: string = "English",
    context?: string
  ): Promise<string> {
    // Get API key from environment or fallback
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key is not configured");
    }
    
    this.initialize(apiKey);

    if (!this.client) {
      throw new Error("OpenAI client not initialized");
    }

    try {
      // Create system prompt with Ugandan legal context
      const systemPrompt = `You are a helpful legal assistant trained to analyze Ugandan legal documents and answer questions clearly and accurately.
${context ? `Context:\n${context}\n\n` : ""}
Question (original language: ${language}):
${question}

Instructions:
- If the context is in a different language, translate it to English internally before answering.
- Base your answer strictly on the provided context. If the answer is not in the context, say: "The document does not contain enough information to answer this."
- Summarize any long sections as needed.
- Keep the answer concise and formal, in the same language as the original question (${language}).

Answer:`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.2,
        max_tokens: 800,
      });

      return response.choices[0].message.content || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error(`Failed to generate legal response: ${error.message}`);
    }
  }

  /**
   * Translate text to the specified language
   * @param text The text to translate
   * @param targetLanguage The target language
   * @returns The translated text
   */
  async translateText(text: string, targetLanguage: string): Promise<string> {
    // Get API key from environment or fallback
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key is not configured");
    }
    
    this.initialize(apiKey);

    if (!this.client) {
      throw new Error("OpenAI client not initialized");
    }

    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: `Translate the following text to ${targetLanguage}. Maintain the original tone and formatting. Only respond with the translated text, nothing else.` 
          },
          { role: "user", content: text }
        ],
        temperature: 0.3,
      });

      return response.choices[0].message.content || text;
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error(`Failed to translate text: ${error.message}`);
    }
  }
}

export const openai = new OpenAIService();
