import { pgTable, text, serial, integer, boolean, uuid, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table - using Supabase auth, so we don't need a separate users table
// The profiles table handles user data

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const portfolioProjects = pgTable("portfolio_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull().default([]),
  location: text("location").notNull(),
  images: text("images").array().default([]),
  videoUrl: text("videoUrl"),
  videos: text("videos").array().default([]),
  isPublished: boolean("isPublished").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  technicalSpecifications: text("technicalSpecifications").array().notNull().default([]),
  imageUrl: text("imageUrl"),
  images: text("images").array().default([]),
  isPublished: boolean("isPublished").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
  // Technical specification fields
  dimensions: jsonb("dimensions").default({}),
  bodyColor: text("bodyColor"),
  beamAngle: text("beamAngle"),
  powerConsumption: text("powerConsumption"),
  ipRating: text("ipRating"),
  colorTemperature: text("colorTemperature"),
  lumensOutput: text("lumensOutput"),
  material: text("material"),
  mountingType: text("mountingType"),
  controlType: text("controlType"),
  warrantyPeriod: text("warrantyPeriod"),
  certifications: text("certifications").array().default([]),
});

// Insert schemas

export const insertProfileSchema = createInsertSchema(profiles).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioProjectSchema = createInsertSchema(portfolioProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = z.infer<typeof insertPortfolioProjectSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
