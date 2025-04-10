import { Request, Response } from 'express';
import { storage } from '../../storage';

/**
 * Retrieves all legal contexts from storage
 */
export async function getAllLegalContexts(_req: Request, res: Response) {
  try {
    const legalContexts = await storage.getAllLegalContexts();
    res.json(legalContexts);
  } catch (error) {
    console.error('Error fetching legal contexts:', error);
    res.status(500).json({ error: 'Failed to fetch legal contexts' });
  }
}

/**
 * Retrieves a specific legal context by ID
 */
export async function getLegalContextById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid ID is required' });
    }
    
    const legalContext = await storage.getLegalContext(parseInt(id));
    
    if (!legalContext) {
      return res.status(404).json({ error: 'Legal context not found' });
    }
    
    res.json(legalContext);
  } catch (error) {
    console.error('Error fetching legal context:', error);
    res.status(500).json({ error: 'Failed to fetch legal context' });
  }
}