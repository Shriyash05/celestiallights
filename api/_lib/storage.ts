import { 
  profiles, portfolioProjects, products,
  type Profile, type InsertProfile,
  type PortfolioProject, type InsertPortfolioProject,
  type Product, type InsertProduct
} from "../../shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

// Define types for selected columns to match query results
type SelectedPortfolioProject = Pick<PortfolioProject, 'id' | 'title' | 'category' | 'description' | 'features' | 'location' | 'isPublished' | 'isFeatured' | 'createdAt' | 'updatedAt' | 'videoUrl' | 'images'>;
type SelectedProduct = Pick<Product, 'id' | 'title' | 'category' | 'description' | 'isPublished' | 'isFeatured' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'images' | 'technicalSpecifications' | 'dimensions' | 'bodyColor' | 'beamAngle' | 'powerConsumption' | 'ipRating' | 'colorTemperature' | 'lumensOutput' | 'material' | 'mountingType' | 'controlType' | 'warrantyPeriod' | 'certifications'>;

export interface IStorage {
  
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, updates: Partial<Profile>): Promise<Profile>;
  
  // Portfolio Project methods
  getAllPortfolioProjects(): Promise<SelectedPortfolioProject[]>;
  getPublishedPortfolioProjects(): Promise<SelectedPortfolioProject[]>;
  getFeaturedPortfolioProjects(): Promise<SelectedPortfolioProject[]>;
  getPortfolioProject(id: string): Promise<SelectedPortfolioProject | undefined>;
  createPortfolioProject(project: InsertPortfolioProject): Promise<{ id: string }>;
  updatePortfolioProject(id: string, updates: Partial<PortfolioProject>): Promise<{ id: string }>;
  deletePortfolioProject(id: string): Promise<void>;
  
  // Product methods
  getAllProducts(): Promise<SelectedProduct[]>;
  getPublishedProducts(): Promise<SelectedProduct[]>;
  getFeaturedProducts(): Promise<SelectedProduct[]>;
  getProduct(id: string): Promise<SelectedProduct | undefined>;
  createProduct(product: InsertProduct): Promise<{ id: string }>;
  updateProduct(id: string, updates: Partial<Product>): Promise<{ id: string }>;
  deleteProduct(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {

  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile || undefined;
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.email, email));
    return profile || undefined;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set({ ...updates, updatedAt: new Date().toISOString() as any }) // Cast to any to bypass Drizzle type issue
      .where(eq(profiles.id, id))
      .returning();
    return profile;
  }

  // Portfolio Project methods
  async getAllPortfolioProjects(): Promise<SelectedPortfolioProject[]> {
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
    }).from(portfolioProjects).orderBy(portfolioProjects.createdAt);
  }

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
  }

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
  }

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
  }

  async createPortfolioProject(insertProject: InsertPortfolioProject): Promise<{ id: string }> {
    const [project] = await db
      .insert(portfolioProjects)
      .values(insertProject)
      .returning({ id: portfolioProjects.id });
    return project;
  }

  async updatePortfolioProject(id: string, updates: Partial<PortfolioProject>): Promise<{ id: string }> {
    const [project] = await db
      .update(portfolioProjects)
      .set({ ...updates, updatedAt: sql`CURRENT_TIMESTAMP` }) // Use SQL to set timestamp
      .where(eq(portfolioProjects.id, id))
      .returning({ id: portfolioProjects.id });
    return project;
  }

  async deletePortfolioProject(id: string): Promise<void> {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  }

  // Product methods
  async getAllProducts(): Promise<SelectedProduct[]> {
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
    }).from(products).orderBy(products.createdAt);
  }

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
  }

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
  }

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
  }

  async createProduct(insertProduct: InsertProduct): Promise<{ id: string }> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning({ id: products.id });
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ id: string }> {
    const [product] = await db
      .update(products)
      .set({ ...updates, updatedAt: sql`CURRENT_TIMESTAMP` }) // Use SQL to set timestamp
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
}

export const storage = new DatabaseStorage();
