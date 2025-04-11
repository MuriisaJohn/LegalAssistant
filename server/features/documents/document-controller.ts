import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { storage } from '../../storage';
import { generateLegalResponse } from '../chat/openai-service';

// Function to handle document upload
export async function uploadDocument(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype } = req.file;
    
    // Extract text based on file type
    let documentText = '';
    
    if (mimetype === 'application/pdf') {
      // For now, just extract text directly without parsing PDF structure
      // This is a simplified approach to avoid pdf-parse issues
      documentText = buffer.toString('utf-8');
      // Remove binary content and extract plain text portions
      documentText = documentText.replace(/[^\x20-\x7E\x0A\x0D]/g, ' ');
    } else if (mimetype === 'text/plain') {
      // Plain text
      documentText = buffer.toString('utf-8');
    } else if (
      mimetype === 'application/msword' || 
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // For DOC/DOCX, we'd need more libraries to extract text
      // For simplicity here, we'll just return a message
      return res.status(400).json({ 
        message: 'DOC/DOCX format is not supported yet. Please upload a PDF or text file.' 
      });
    } else {
      return res.status(400).json({ 
        message: 'Unsupported file format. Please upload a PDF, TXT, DOC, or DOCX file.' 
      });
    }

    // Create a new legal context entry
    const newDocument = await storage.createLegalContext({
      title: originalname,
      content: documentText,
    });

    // Send the document ID back to the client
    return res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: newDocument.id,
        title: newDocument.title,
      }
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return res.status(500).json({ message: 'Failed to process document upload' });
  }
}

// Function to analyze a document with AI
export async function analyzeDocument(req: Request, res: Response) {
  try {
    const { documentId } = req.params;
    const { question } = req.body;
    
    if (!documentId || !question) {
      return res.status(400).json({ message: 'Document ID and question are required' });
    }
    
    // Get the document from storage
    const document = await storage.getLegalContext(parseInt(documentId));
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Generate a response using OpenAI
    const response = await generateLegalResponse(
      question,
      document.content,
      'English' // Default language
    );
    
    return res.status(200).json({
      response,
      documentTitle: document.title
    });
  } catch (error) {
    console.error('Error analyzing document:', error);
    return res.status(500).json({ message: 'Failed to analyze document' });
  }
}