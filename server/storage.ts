import { 
  users, profiles, portfolioProjects, products,
  type User, type InsertUser, type Profile, type InsertProfile,
  type PortfolioProject, type InsertPortfolioProject,
  type Product, type InsertProduct
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, updates: Partial<Profile>): Promise<Profile>;
  
  // Portfolio Project methods
  getAllPortfolioProjects(): Promise<PortfolioProject[]>;
  getPublishedPortfolioProjects(): Promise<PortfolioProject[]>;
  getFeaturedPortfolioProjects(): Promise<PortfolioProject[]>;
  getPortfolioProject(id: string): Promise<PortfolioProject | undefined>;
  createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject>;
  updatePortfolioProject(id: string, updates: Partial<PortfolioProject>): Promise<PortfolioProject>;
  deletePortfolioProject(id: string): Promise<void>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getPublishedProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

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
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return profile;
  }

  // Portfolio Project methods
  async getAllPortfolioProjects(): Promise<PortfolioProject[]> {
    return await db.select().from(portfolioProjects).orderBy(portfolioProjects.createdAt);
  }

  async getPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
    return await db.select().from(portfolioProjects)
      .where(eq(portfolioProjects.isPublished, true))
      .orderBy(portfolioProjects.createdAt);
  }

  async getFeaturedPortfolioProjects(): Promise<PortfolioProject[]> {
    return await db.select().from(portfolioProjects)
      .where(eq(portfolioProjects.isFeatured, true))
      .orderBy(portfolioProjects.createdAt);
  }

  async getPortfolioProject(id: string): Promise<PortfolioProject | undefined> {
    const [project] = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, id));
    return project || undefined;
  }

  async createPortfolioProject(insertProject: InsertPortfolioProject): Promise<PortfolioProject> {
    const [project] = await db
      .insert(portfolioProjects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updatePortfolioProject(id: string, updates: Partial<PortfolioProject>): Promise<PortfolioProject> {
    const [project] = await db
      .update(portfolioProjects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(portfolioProjects.id, id))
      .returning();
    return project;
  }

  async deletePortfolioProject(id: string): Promise<void> {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.createdAt);
  }

  async getPublishedProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.isPublished, true))
      .orderBy(products.createdAt);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.isFeatured, true))
      .orderBy(products.createdAt);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
}

export const storage = new DatabaseStorage();
