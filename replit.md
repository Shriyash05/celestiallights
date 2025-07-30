# Celestial Lights - Portfolio & Product Showcase

## Overview

This is a full-stack web application for Celestial Lights, a premium LED and architectural lighting company. The application serves as both a marketing website and content management system, showcasing the company's portfolio projects and products with an admin interface for content management.

**Migration Status**: Successfully migrated to standalone environment with PostgreSQL database and free email functionality, ready for deployment on any hosting provider.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API**: RESTful JSON API
- **Authentication**: Simple email-based admin authentication

### Design System
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Theme**: Dark theme with golden accent color (hsl(45 93% 66%))
- **Typography**: Custom CSS variables for consistent spacing and colors
- **Responsive**: Mobile-first design approach

## Key Components

### Frontend Components
- **Navigation**: Fixed header with smooth scroll navigation
- **Hero Section**: Landing area with call-to-action buttons and company statistics
- **Portfolio Section**: Showcase of featured projects with filtering and modal details
- **Products Section**: Display of featured products with detailed specifications
- **About Section**: Company history and values presentation
- **Contact Section**: Contact form with email functionality and company information
- **Admin Interface**: CRUD operations for portfolio projects and products

### Backend Components
- **Database Layer**: Drizzle ORM with type-safe schema definitions
- **Storage Interface**: Abstracted data access layer with CRUD operations
- **API Routes**: RESTful endpoints for portfolios, products, and authentication
- **Middleware**: Request logging and error handling

### Database Schema
- **users**: Basic user authentication table
- **profiles**: Extended user profile information
- **portfolio_projects**: Project showcase data with images, categories, and features
- **products**: Product catalog with technical specifications and categorization

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using TanStack Query
2. Express.js routes handle requests and validation
3. Storage layer interacts with PostgreSQL via Drizzle ORM
4. Responses are cached and managed by TanStack Query

### Content Management Flow
1. Admin authentication through simple email/password validation
2. CRUD operations for portfolio projects and products
3. Real-time updates reflected in the public-facing website
4. Image handling through URL references (external hosting)

### Public Website Flow
1. Static pages with dynamic content loading
2. Filtered views for portfolio projects and products
3. Modal dialogs for detailed content viewing
4. Contact form submissions with email notifications

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Development**: tsx for TypeScript execution, esbuild for bundling
- **Validation**: Zod for schema validation

### Development Tools
- **Build**: Vite with React plugin
- **Database**: Drizzle Kit for migrations and schema management
- **TypeScript**: Full type safety across the stack
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Build Process
1. Frontend builds to `dist/public` using Vite
2. Backend bundles to `dist/index.js` using esbuild
3. Database schema managed through Drizzle migrations
4. Environment variables for database connection and admin emails

### Environment Configuration
- **Development**: Uses tsx for hot reloading and development server
- **Production**: Serves static files and runs bundled backend
- **Database**: Neon PostgreSQL with connection pooling
- **Admin Access**: Environment-based admin email configuration

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon serverless)
- Environment variables for database URL and admin configuration
- Static file serving capability

The application is designed for easy deployment on platforms like GoDaddy, Vercel, DigitalOcean, or similar Node.js hosting providers with PostgreSQL database support.

## Admin Credentials
- **Email**: admin@celestiallights.com
- **Password**: admin123
- **Alternative Email**: info.celestiallight@gmail.com  
- **Alternative Password**: celestial2024