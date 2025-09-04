import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../_lib/storage';
import { insertPortfolioProjectSchema } from '../../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (method) {
      case 'GET':
        const projects = await storage.getPublishedPortfolioProjects();
        return res.status(200).json(projects);

      case 'POST':
        try {
          const validatedData = insertPortfolioProjectSchema.parse(req.body);
          const project = await storage.createPortfolioProject(validatedData);
          return res.status(201).json(project);
        } catch (error) {
          if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Invalid data", details: error.errors });
          }
          throw error;
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Error in portfolio-projects API:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
