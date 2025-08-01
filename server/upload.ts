import multer from 'multer';
import { Request } from 'express';

// Configure memory storage to store files in memory instead of disk
const storage = multer.memoryStorage();

// File filter for images, videos, and PDFs
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  }
  // Allow videos
  else if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  }
  // Allow PDFs
  else if (file.mimetype === 'application/pdf') {
    cb(null, true);
  }
  // Reject other files
  else {
    cb(new Error('Only image, video, and PDF files are allowed!'));
  }
};

// Configure multer to store files in memory
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Middleware for multiple file uploads
export const uploadMultiple = upload.array('files', 10); // Allow up to 10 files

// Helper function to convert file buffer to base64 data URL
export function bufferToDataURL(buffer: Buffer, mimetype: string): string {
  const base64 = buffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
}