import { VercelRequest, VercelResponse } from '@vercel/node';
import { portfolioStorage } from './storage-inline.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query } = req;
  const id = query.id as string;

  if (!id) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (method) {
      case 'GET':
        const project = await portfolioStorage.getPortfolioProject(id);
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }
        return res.status(200).json(project);

      case 'PATCH':
      case 'PUT':
        const updatedProject = await portfolioStorage.updatePortfolioProject(id, req.body);
        return res.status(200).json(updatedProject);

      case 'DELETE':
        // First check if the project exists
        const existingProject = await portfolioStorage.getPortfolioProject(id);
        if (!existingProject) {
          return res.status(404).json({ error: "Project not found" });
        }
        
        await portfolioStorage.deletePortfolioProject(id);
        return res.status(200).json({ 
          success: true, 
          message: "Project deleted successfully",
          deletedId: id 
        });

      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error(`Error in portfolio project ${id} API:`, error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
