import { Request, Response } from 'express';
import { storage } from '../../storage';
import { analyzeDocument } from './document-service';
import mammoth from 'mammoth';
import { z } from 'zod';

// Document upload schema
const documentSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number()
});

// Document analysis schema
const analysisSchema = z.object({
  documentId: z.string(),
  fileName: z.string()
});

// Function to handle document upload
export async function uploadDocument(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Analyzing document:', {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });

    // Extract text from the document
    let textContent = '';
    
    if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Handle DOCX files
      try {
        const buffer = req.file.buffer;
        console.log('Processing DOCX file with mammoth...');
        
        // Use mammoth to extract text
        const result = await mammoth.extractRawText({ buffer });
        
        textContent = result.value;
        
        // Log warnings if any
        if (result.messages && result.messages.length > 0) {
          console.log('Mammoth processing warnings:', result.messages);
        }
        
        console.log('Successfully extracted text from DOCX document');
        console.log('Sample of extracted text:', textContent.substring(0, 200) + '...');
      } catch (mammothError) {
        console.error('Error extracting text from DOCX:', mammothError);
        return res.status(400).json({ 
          error: 'Failed to extract text from DOCX file', 
          message: mammothError instanceof Error ? mammothError.message : 'Unknown error'
        });
      }
    } else if (req.file.mimetype === 'text/plain') {
      // Handle plain text files
      textContent = req.file.buffer.toString('utf-8');
      console.log('Successfully extracted text from plain text document');
    } else {
      return res.status(400).json({ 
        error: 'Unsupported file type', 
        message: 'Only DOCX and TXT files are supported' 
      });
    }

    // Validate extracted text
    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Empty document content', 
        message: 'The document appears to be empty or could not be processed' 
      });
    }

    console.log('Text length:', textContent.length, 'characters');
    
    // Store the document
    const documentId = await storage.storeDocument({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      content: textContent
    });

    res.json({ 
      message: 'Document uploaded successfully',
      documentId: documentId
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ 
      error: 'Failed to upload document',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function analyzeUploadedDocument(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Analyzing document:', {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });

    // Extract text from the document
    let textContent = '';
    
    if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Handle DOCX files
      try {
        const buffer = req.file.buffer;
        console.log('Processing DOCX file with mammoth...');
        
        // Use mammoth to extract text
        const result = await mammoth.extractRawText({ buffer });
        
        textContent = result.value;
        
        // Log warnings if any
        if (result.messages && result.messages.length > 0) {
          console.log('Mammoth processing warnings:', result.messages);
        }
        
        console.log('Successfully extracted text from DOCX document');
        console.log('Sample of extracted text:', textContent.substring(0, 200) + '...');
      } catch (mammothError) {
        console.error('Error extracting text from DOCX:', mammothError);
        return res.status(400).json({ 
          error: 'Failed to extract text from DOCX file', 
          message: mammothError instanceof Error ? mammothError.message : 'Unknown error'
        });
      }
    } else if (req.file.mimetype === 'text/plain') {
      // Handle plain text files
      textContent = req.file.buffer.toString('utf-8');
      console.log('Successfully extracted text from plain text document');
    } else {
      return res.status(400).json({ 
        error: 'Unsupported file type', 
        message: 'Only DOCX and TXT files are supported' 
      });
    }

    // Validate extracted text
    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Empty document content', 
        message: 'The document appears to be empty or could not be processed' 
      });
    }

    console.log('Text length:', textContent.length, 'characters');
    
    // Analyze the document
    console.log('Starting document analysis...');
    const analysis = await analyzeDocument(textContent, req.file.originalname);
    console.log('Analysis completed successfully');
    console.log('Analysis length:', analysis.length, 'characters');
    
    res.json({ 
      message: 'Document analyzed successfully',
      analysis: analysis
    });
  } catch (error) {
    console.error('Error analyzing document:', error);
    res.status(500).json({ 
      error: 'Failed to analyze document',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}