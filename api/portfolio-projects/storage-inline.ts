// Inline storage module to test Vercel compatibility
import { 
  profiles, portfolioProjects, products,
  type Profile, type InsertProfile,
  type PortfolioProject, type InsertPortfolioProject,
  type Product, type InsertProduct
} from "../../shared/schema.js";
import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../shared/schema.js";
import { eq, sql } from "drizzle-orm";

// Database setup (inline from db.ts)
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const db = drizzle(pool, { schema });

// Define types for selected columns to match query results
type SelectedPortfolioProject = Pick<PortfolioProject, 'id' | 'title' | 'category' | 'description' | 'features' | 'location' | 'isPublished' | 'isFeatured' | 'createdAt' | 'updatedAt' | 'videoUrl' | 'images'>;

// Portfolio Project methods (inline from storage.ts)
export const portfolioStorage = {
  async getPublishedPortfolioProjects(): Promise<SelectedPortfolioProject[]> {
    return await db.select({
      id: portfolioProjects.id,
      title: portfolioProjects.title,
      category: portfolioProjects.category,
      description: portfolioProjects.description,
      features: portfolioProjects.features,
      location: portfolioProjects.location,
      isPublished: portfolioProjects.isPublished,
      isFeatured: portfolioProjects.isFeatured,
      createdAt: portfolioProjects.createdAt,
      updatedAt: portfolioProjects.updatedAt,
      videoUrl: portfolioProjects.videoUrl,
      images: portfolioProjects.images,
    }).from(portfolioProjects)
      .where(eq(portfolioProjects.isPublished, true))
      .orderBy(portfolioProjects.createdAt);
  },

  async createPortfolioProject(insertProject: InsertPortfolioProject): Promise<{ id: string }> {
    const [project] = await db
      .insert(portfolioProjects)
      .values(insertProject)
      .returning({ id: portfolioProjects.id });
    return project;
  },

  async getFeaturedPortfolioProjects(): Promise<SelectedPortfolioProject[]> {
    return await db.select({
      id: portfolioProjects.id,
      title: portfolioProjects.title,
      category: portfolioProjects.category,
      description: portfolioProjects.description,
      features: portfolioProjects.features,
      location: portfolioProjects.location,
      isPublished: portfolioProjects.isPublished,
      isFeatured: portfolioProjects.isFeatured,
      createdAt: portfolioProjects.createdAt,
      updatedAt: portfolioProjects.updatedAt,
      videoUrl: portfolioProjects.videoUrl,
      images: portfolioProjects.images,
    }).from(portfolioProjects)
      .where(eq(portfolioProjects.isFeatured, true))
      .orderBy(portfolioProjects.createdAt);
  },

  async getPortfolioProject(id: string): Promise<SelectedPortfolioProject | undefined> {
    const [project] = await db.select({
      id: portfolioProjects.id,
      title: portfolioProjects.title,
      category: portfolioProjects.category,
      description: portfolioProjects.description,
      features: portfolioProjects.features,
      location: portfolioProjects.location,
      isPublished: portfolioProjects.isPublished,
      isFeatured: portfolioProjects.isFeatured,
      createdAt: portfolioProjects.createdAt,
      updatedAt: portfolioProjects.updatedAt,
      videoUrl: portfolioProjects.videoUrl,
      images: portfolioProjects.images,
    }).from(portfolioProjects).where(eq(portfolioProjects.id, id));
    return project || undefined;
  },

  async updatePortfolioProject(id: string, updates: Partial<PortfolioProject>): Promise<{ id: string }> {
    const [project] = await db
      .update(portfolioProjects)
      .set({ ...updates, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(portfolioProjects.id, id))
      .returning({ id: portfolioProjects.id });
    return project;
  },

  async deletePortfolioProject(id: string): Promise<void> {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  }
};
