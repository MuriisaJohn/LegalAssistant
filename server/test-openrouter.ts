import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Loaded environment variables from:', envPath);
} else {
  console.error('Environment file not found at:', envPath);
}

// Validate required environment variables
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not configured');
}

console.log('Using OpenRouter API key:', process.env.OPENROUTER_API_KEY.substring(0, 10) + '...');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://github.com/yourusername/legal-assistant',
    'X-Title': 'Legal Assistant',
    'Content-Type': 'application/json'
  }
});

async function testChatCompletion() {
  try {
    console.log('Testing chat completion...');
    
    const messages = [
      {
        role: "system" as const,
        content: "You are a legal information assistant specializing in Ugandan law. Follow these guidelines:\n\n1. LEGAL INFORMATION ONLY:\n- Provide factual information based on Ugandan law\n- Do NOT provide legal advice or suggest specific actions\n- Always cite relevant laws, acts, or regulations\n- Use clear, simple language while maintaining accuracy\n\n2. RESPONSE STRUCTURE:\n- Start with a brief acknowledgment of the query\n- Provide relevant legal framework and citations\n- Explain key concepts in simple terms\n- List potential legal remedies or processes (without recommending specific actions)\n- Include relevant authorities or institutions\n\n3. MANDATORY ELEMENTS:\n- Always include specific references to Ugandan laws and regulations\n- Provide contact information for relevant legal authorities\n- Include a clear disclaimer about not providing legal advice\n\n4. DISCLAIMER:\n\"IMPORTANT: This information is for general guidance only and should not be considered legal advice. Please consult a qualified legal professional for advice specific to your situation.\"\n\n5. REFERRAL:\n- Suggest consulting with:\n  * Uganda Law Society\n  * Legal Aid Service Providers Network (LASPNET)\n  * Justice Centers Uganda\n  * Local Council Courts"
      },
      {
        role: "user" as const,
        content: "they stole my land"
      }
    ];

    console.log('Sending request to OpenRouter...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    });

    console.log('Received response from OpenRouter:', JSON.stringify(completion, null, 2));
    
    if (!completion?.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', completion);
      throw new Error('No response content received from AI service');
    }

    const response = completion.choices[0].message.content;
    console.log('Response content:', response);
    
    return response;
  } catch (error) {
    console.error('Error in chat completion test:', error);
    throw error;
  }
}

async function testDocumentAnalysis() {
  try {
    console.log('Testing document analysis...');
    
    // Sample document content
    const content = `This is a sample legal document for testing purposes.
    
    The Constitution of Uganda, 1995, as amended, provides for the protection of property rights under Article 26.
    
    The Land Act, Cap 227, governs land ownership and transactions in Uganda.
    
    The Land Acquisition Act, Cap 226, provides for the compulsory acquisition of land for public purposes.
    
    This document outlines the legal framework for land ownership and protection in Uganda.`;
    
    const messages = [
      {
        role: "system" as const,
        content: "You are a legal expert specializing in document analysis. Provide clear, structured analysis of legal documents in English."
      },
      {
        role: "user" as const,
        content: `As a legal expert, analyze this document comprehensively in English. Provide:

1. Document Classification:
- Document type and purpose
- Legal jurisdiction (if applicable)
- Key parties involved

2. Key Points Extraction:
- Main legal provisions
- Critical dates and deadlines
- Obligations and rights
- Conditions and requirements

3. Summary:
- Brief overview (2-3 sentences)
- Main objectives
- Critical implications

4. Legal Terminology:
- Identify and explain complex legal terms
- Highlight any jurisdiction-specific terminology
- Provide plain language explanations

Document Content:
${content}

Please provide the analysis in English using a clear, structured format.`
      }
    ];

    console.log('Sending request to OpenRouter API...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.3,
      max_tokens: 2000
    });

    console.log('Received response from OpenRouter API:', JSON.stringify(completion, null, 2));

    if (!completion?.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', completion);
      throw new Error('No analysis generated from AI service');
    }

    const analysis = completion.choices[0].message.content;
    console.log('Document analysis completed successfully');
    console.log('Analysis:', analysis);
    
    return analysis;
  } catch (error) {
    console.error('Error in document analysis test:', error);
    throw error;
  }
}

async function runTests() {
  try {
    console.log('Starting OpenRouter API tests...');
    
    // Test chat completion
    console.log('\n=== TESTING CHAT COMPLETION ===');
    await testChatCompletion();
    
    // Test document analysis
    console.log('\n=== TESTING DOCUMENT ANALYSIS ===');
    await testDocumentAnalysis();
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests(); 