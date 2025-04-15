import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variable for API key
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyDnKE_Q4R0HbfaQSwn5MMUtibnfaMQAtIU";
if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not configured');
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Analyzes a legal document and returns a structured analysis in presentation style
 * @param content The document content to analyze
 * @param fileName The name of the document file
 * @returns A formatted analysis of the document optimized for presentations
 */
export async function analyzeDocument(content: string, fileName: string): Promise<string> {
  try {
    if (!content) {
      throw new Error('Document content is empty');
    }

    console.log(`Starting document analysis for: ${fileName}`);
    console.log(`Content length: ${content.length} characters`);

    // Clean up content
    const cleanContent = content
      .replace(/[^\x20-\x7E\x0A\x0D]/g, ' ')  // Remove non-printable characters
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .trim();

    if (!cleanContent) {
      throw new Error('Document content is empty after cleaning');
    }

    // Log content processing details
    console.log(`Cleaned content length: ${cleanContent.length} characters`);
    console.log(`Content sample: ${cleanContent.substring(0, 500)}...`);

    // Truncate content if needed
    const maxContentLength = 15000;
    const truncatedContent = cleanContent.length > maxContentLength
      ? `${cleanContent.substring(0, maxContentLength)}... [content truncated]`
      : cleanContent;

    console.log(`Content length after truncation: ${truncatedContent.length} characters`);

    // Presentation-style prompt with enhanced numbering on new lines
    const systemPrompt = `You are a legal expert specializing in document analysis with a focus on Ugandan law. Your task is to analyze legal documents and provide clear, structured insights in a professional presentation format. Follow these guidelines:

DOCUMENT STRUCTURE
Your analysis must include these sections in the following order:

1. EXECUTIVE SUMMARY
   A concise overview of the document and key findings.

2. DOCUMENT CLASSIFICATION
   Type, jurisdiction, and parties involved.

3. KEY POINTS
   Main legal provisions, dates, obligations, and requirements.

4. SUMMARY
   Brief overview of objectives and implications.

5. LEGAL TERMINOLOGY
   Plain language explanations of complex terms.

6. RECOMMENDATIONS
   Suggested next steps and resources.

7. DISCLAIMER
   Clear statement that this is not legal advice.

FORMATTING REQUIREMENTS
For a clean, presentation-style document:

• Use ALL CAPS for section headers
• Start each numbered item on a new line
• Every time you use a number (like "1." or "2."), it must begin on a new line
• Format ALL numbers as:
  1. ITEM ONE
     Details about item one
  2. ITEM TWO
     Details about item two
• Use "•" bullet points for non-numbered lists
• Use proper paragraph spacing (double line breaks between sections)
• Format dates as DD/MM/YYYY
• For each key legal term, present as: TERM: Definition
• Keep paragraphs concise (2-4 sentences maximum)
• Use clean, consistent spacing throughout

PRESENTATION STYLE
• Use a professional, formal tone
• Prioritize clarity and readability
• Present information concisely and directly
• Format for easy visual scanning
• Use white space effectively
• ALWAYS START A NEW LINE FOR EACH NUMBERED ITEM`;

    const userPrompt = `Please analyze the following legal document related to Ugandan law. Create a professional, presentation-style document following the formatting guidelines outlined above.

Document Content:
${truncatedContent}

Format this as a clean, presentation-ready document that a lawyer could use for a client briefing. Remember that EVERY numbered item must start on a new line. For example:
1. FIRST POINT
   Details about the first point
2. SECOND POINT
   Details about the second point`;

    console.log('Sending request to Google Gemini API...');

    try {
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: userPrompt }
      ]);
      
      const analysis = result.response.text();

      if (!analysis) {
        throw new Error('No analysis generated from AI service');
      }

      console.log(`Document analysis completed successfully`);
      console.log(`Analysis length: ${analysis.length} characters`);

      // Additional processing to ensure numbers start on new lines
      const enhancedAnalysis = analysis
        .replace(/\*\*/g, '')  // Remove any remaining asterisks
        .replace(/--+/g, '')   // Remove any remaining dashes
        .replace(/(\d+\.\s+)/g, '\n$1')  // Ensure numbers start on new lines
        .replace(/\n\n\n+/g, '\n\n')  // Clean up excessive line breaks
        .replace(/<b>(.*?)<\/b>/g, '$1');  // Process bold tags
      
      // Format the output in a clean presentation style
      const formattedAnalysis = `
                        LEGAL CASE ANALYSIS                       
                        
                        ${fileName.toUpperCase()}
                        

${enhancedAnalysis}

                                              
Analysis Date: ${new Date().toLocaleDateString()}
Document Reference: ${fileName}
`;

      return formattedAnalysis;
    } catch (error) {
      console.error('Google Gemini API error:', error);
      throw new Error(`Google Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in document analysis service:', error);
    if (error instanceof Error) {
      throw new Error(`Document analysis failed: ${error.message}`);
    }
    throw new Error('Document analysis failed: Unknown error occurred');
  }
}