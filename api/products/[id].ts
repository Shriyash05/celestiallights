import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query } = req;
  const id = query.id as string;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
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
        const product = await storage.getProduct(id);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(product);

      case 'PATCH':
      case 'PUT':
        const updatedProduct = await storage.updateProduct(id, req.body);
        return res.status(200).json(updatedProduct);

      case 'DELETE':
        await storage.deleteProduct(id);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error(`Error in product ${id} API:`, error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
