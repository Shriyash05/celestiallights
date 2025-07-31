# Celestial Lights - Professional Lighting Company Website

## Project Overview
A modern full-stack web application for Celestial Lights featuring:
- Interactive product catalog with detailed product information
- Project portfolio showcase with case studies
- Quote request system with real-time communication
- Admin dashboard for content management
- Contact forms with email integration
- Responsive design with advanced animations

## Technical Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion for advanced interactions
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Backend (Express + TypeScript)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM via Supabase
- **Authentication**: Passport.js with local strategy
- **File Uploads**: Multer for handling media files
- **Email**: Nodemailer for contact forms and notifications
- **Session Management**: Express sessions with PostgreSQL store

### Key Features
- Product catalog with categories and detailed specs
- Project portfolio with before/after images and videos
- Quote request system with form submissions
- Admin panel for content management
- File upload system for project images and videos
- Real-time updates using Supabase subscriptions
- Email notifications for inquiries
- Mobile-responsive design

## Database Schema
- Products: catalog items with specifications and images
- Projects: portfolio showcases with details and media
- Quotes: customer inquiries and requests
- Users: admin authentication system

## User Preferences
- Deploy to GoDaddy hosting
- Remove all development environment references
- Professional production-ready configuration

## Recent Changes
- **2025-01-31**: Enhanced real-time functionality with Supabase subscriptions
- Fixed video display in project detail modals
- Implemented consistent image selection (no random photos)
- Added manual event fallbacks for real-time updates  
- Prepared for GoDaddy deployment with production configuration
- Removed development environment references

## Deployment Notes
- Configured for production deployment on GoDaddy
- Uses Supabase PostgreSQL for database
- Real-time subscriptions for instant UI updates
- Static file serving configured for uploads
- Cross-platform compatibility for hosting environments