import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPortfolioProjectSchema, insertProductSchema, insertProfileSchema } from "@shared/schema";
import { z } from "zod";
import { uploadMultiple, uploadToSupabaseStorage } from "./upload";

export async function registerRoutes(app: Express): Promise<Server> {
  // File Upload API - now stores files in Supabase Storage buckets
  app.post("/api/upload", uploadMultiple, async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const filePromises = req.files.map(async (file: Express.Multer.File) => {
        try {
          const publicUrl = await uploadToSupabaseStorage(file);
          return {
            filename: file.originalname,
            originalName: file.originalname,
            url: publicUrl, // Now contains the Supabase Storage public URL
            size: file.size,
            mimetype: file.mimetype,
          };
        } catch (error) {
          console.error(`Failed to upload ${file.originalname}:`, error);
          throw error;
        }
      });

      const fileData = await Promise.all(filePromises);
      res.json({ files: fileData });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });

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

  app.put("/api/portfolio-projects/:id", async (req, res) => {
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

  app.put("/api/products/:id", async (req, res) => {
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
  app.post("/api/auth/signin", async (req, res) => {
    try {
      // With Supabase Auth, client-side authentication is preferred
      // This endpoint is kept for compatibility but should not be used for actual authentication
      // Authentication should be handled client-side with Supabase Auth
      
      res.status(400).json({
        error: "Authentication is handled client-side with Supabase Auth",
        message: "Please use the client-side authentication flow"
      });
    } catch (error) {
      console.error("Error during signin:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.post("/api/auth/check-admin", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Check if profile exists and has admin role
      const profile = await storage.getProfileByEmail(email);
      const isAdmin = profile?.role === "admin";
      
      res.json({ isAdmin });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ error: "Failed to check admin status" });
    }
  });

  // Contact/Quote API - free email solution using Nodemailer
  app.post("/api/send-quote-email", async (req, res) => {
    try {
      const { customerName, customerEmail, projectType } = req.body;
      
      // Log the quote request
      const quoteRequest = {
        customerName: customerName || 'Not provided',
        customerEmail: customerEmail || 'Not provided',
        projectType: projectType || 'General consultation',
        timestamp: new Date().toISOString()
      };
      
      console.log("New quote request:", quoteRequest);
      
      // If email credentials are provided, send email using Nodemailer
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const nodemailer = await import('nodemailer');
        
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          subject: 'New Quote Request - Celestial Lights',
          html: `
            <h1>New Quote Request</h1>
            <p>A new quote request has been received from the website.</p>
            
            <h2>Customer Details:</h2>
            <ul>
              <li><strong>Name:</strong> ${quoteRequest.customerName}</li>
              <li><strong>Email:</strong> ${quoteRequest.customerEmail}</li>
              <li><strong>Project Type:</strong> ${quoteRequest.projectType}</li>
              <li><strong>Timestamp:</strong> ${quoteRequest.timestamp}</li>
            </ul>
            
            <p>Please follow up with the customer as soon as possible.</p>
            
            <p>Best regards,<br>Celestial Lights Website</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Quote email sent successfully');
      }
      
      res.json({ success: true, message: "Quote request received successfully" });
    } catch (error) {
      console.error("Error processing quote request:", error);
      // Even if email fails, we should still log the request and return success
      res.json({ success: true, message: "Quote request received successfully" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
