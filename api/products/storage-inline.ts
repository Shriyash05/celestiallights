// Inline storage module for products API to avoid Vercel module resolution issues
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
type SelectedProduct = Pick<Product, 'id' | 'title' | 'category' | 'description' | 'isPublished' | 'isFeatured' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'images' | 'technicalSpecifications' | 'dimensions' | 'bodyColor' | 'beamAngle' | 'powerConsumption' | 'ipRating' | 'colorTemperature' | 'lumensOutput' | 'material' | 'mountingType' | 'controlType' | 'warrantyPeriod' | 'certifications'>;

// Product methods (inline from storage.ts)
export const productStorage = {
  async getPublishedProducts(): Promise<SelectedProduct[]> {
    return await db.select({
      id: products.id,
      title: products.title,
      category: products.category,
      description: products.description,
      isPublished: products.isPublished,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      imageUrl: products.imageUrl,
      images: products.images,
      technicalSpecifications: products.technicalSpecifications,
      dimensions: products.dimensions,
      bodyColor: products.bodyColor,
      beamAngle: products.beamAngle,
      powerConsumption: products.powerConsumption,
      ipRating: products.ipRating,
      colorTemperature: products.colorTemperature,
      lumensOutput: products.lumensOutput,
      material: products.material,
      mountingType: products.mountingType,
      controlType: products.controlType,
      warrantyPeriod: products.warrantyPeriod,
      certifications: products.certifications,
    }).from(products)
      .where(eq(products.isPublished, true))
      .orderBy(products.createdAt);
  },

  async getFeaturedProducts(): Promise<SelectedProduct[]> {
    return await db.select({
      id: products.id,
      title: products.title,
      category: products.category,
      description: products.description,
      isPublished: products.isPublished,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      imageUrl: products.imageUrl,
      images: products.images,
      technicalSpecifications: products.technicalSpecifications,
      dimensions: products.dimensions,
      bodyColor: products.bodyColor,
      beamAngle: products.beamAngle,
      powerConsumption: products.powerConsumption,
      ipRating: products.ipRating,
      colorTemperature: products.colorTemperature,
      lumensOutput: products.lumensOutput,
      material: products.material,
      mountingType: products.mountingType,
      controlType: products.controlType,
      warrantyPeriod: products.warrantyPeriod,
      certifications: products.certifications,
    }).from(products)
      .where(eq(products.isFeatured, true))
      .orderBy(products.createdAt);
  },

  async createProduct(insertProduct: InsertProduct): Promise<{ id: string }> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning({ id: products.id });
    return product;
  },

  async getProduct(id: string): Promise<SelectedProduct | undefined> {
    const [product] = await db.select({
      id: products.id,
      title: products.title,
      category: products.category,
      description: products.description,
      isPublished: products.isPublished,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      imageUrl: products.imageUrl,
      images: products.images,
      technicalSpecifications: products.technicalSpecifications,
      dimensions: products.dimensions,
      bodyColor: products.bodyColor,
      beamAngle: products.beamAngle,
      powerConsumption: products.powerConsumption,
      ipRating: products.ipRating,
      colorTemperature: products.colorTemperature,
      lumensOutput: products.lumensOutput,
      material: products.material,
      mountingType: products.mountingType,
      controlType: products.controlType,
      warrantyPeriod: products.warrantyPeriod,
      certifications: products.certifications,
    }).from(products).where(eq(products.id, id));
    return product || undefined;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ id: string }> {
    const [product] = await db
      .update(products)
      .set({ ...updates, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return product;
  },

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
};
