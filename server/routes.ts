import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPortfolioProjectSchema, insertProductSchema, insertProfileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Portfolio Projects API
  app.get("/api/portfolio-projects", async (req, res) => {
    try {
      const projects = await storage.getPublishedPortfolioProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching portfolio projects:", error);
      res.status(500).json({ error: "Failed to fetch portfolio projects" });
    }
  });

  app.get("/api/portfolio-projects/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedPortfolioProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching featured portfolio projects:", error);
      res.status(500).json({ error: "Failed to fetch featured portfolio projects" });
    }
  });

  app.get("/api/portfolio-projects/:id", async (req, res) => {
    try {
      const project = await storage.getPortfolioProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching portfolio project:", error);
      res.status(500).json({ error: "Failed to fetch portfolio project" });
    }
  });

  app.post("/api/portfolio-projects", async (req, res) => {
    try {
      const validatedData = insertPortfolioProjectSchema.parse(req.body);
      const project = await storage.createPortfolioProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating portfolio project:", error);
      res.status(500).json({ error: "Failed to create portfolio project" });
    }
  });

  app.patch("/api/portfolio-projects/:id", async (req, res) => {
    try {
      const project = await storage.updatePortfolioProject(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      console.error("Error updating portfolio project:", error);
      res.status(500).json({ error: "Failed to update portfolio project" });
    }
  });

  app.delete("/api/portfolio-projects/:id", async (req, res) => {
    try {
      await storage.deletePortfolioProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting portfolio project:", error);
      res.status(500).json({ error: "Failed to delete portfolio project" });
    }
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getPublishedProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Auth API
  app.post("/api/auth/check-admin", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // For now, check if profile exists and has admin role
      const profile = await storage.getProfileByEmail(email);
      const isAdmin = profile?.role === "admin";
      
      res.json({ isAdmin });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ error: "Failed to check admin status" });
    }
  });

  // Contact/Quote API - simplified version of the Supabase edge function
  app.post("/api/send-quote-email", async (req, res) => {
    try {
      const { customerName, customerEmail, projectType } = req.body;
      
      // Log the quote request (in a real app, you'd send an email here)
      console.log("New quote request:", {
        customerName: customerName || 'Not provided',
        customerEmail: customerEmail || 'Not provided',
        projectType: projectType || 'General consultation',
        timestamp: new Date().toISOString()
      });
      
      // For now, just return success - you can integrate with email service later
      res.json({ success: true, message: "Quote request received successfully" });
    } catch (error) {
      console.error("Error processing quote request:", error);
      res.status(500).json({ error: "Failed to process quote request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
