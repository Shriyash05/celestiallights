# Professional Lighting Company Website

## Project Overview
A modern full-stack web application for a professional lighting company featuring:
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
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **File Uploads**: Multer for handling media files
- **Email**: Nodemailer for contact forms and notifications
- **Session Management**: Express sessions with PostgreSQL store

### Key Features
- Product catalog with categories and detailed specs
- Project portfolio with before/after images
- Quote request system with form submissions
- Admin panel for content management
- File upload system for project images
- Email notifications for inquiries
- Mobile-responsive design

## Database Schema
- Products: catalog items with specifications and images
- Projects: portfolio showcases with details and media
- Quotes: customer inquiries and requests
- Users: admin authentication system

## User Preferences
*To be updated based on user interactions*

## Recent Changes
- **2025-01-31**: Project migrated from Replit Agent to Replit environment
- Configured for proper client/server separation
- All dependencies installed and verified
- Database connection established with Supabase PostgreSQL
- Fixed UI issues: consistent image display, technical specifications, video playback
- Resolved type inconsistencies between schema and realtime service

## Development Notes
- Server runs on port 5001 to avoid conflicts
- Static file serving configured for uploads
- Vite dev server integrated for hot reloading
- Cross-env setup for environment variable handling