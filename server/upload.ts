import multer from 'multer';
import { Request } from 'express';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for storage
const supabaseUrl = 'https://kzoywkomnniqdrvccolg.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

let supabase: any = null;

// Only initialize if we have the required credentials
if (supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('SUPABASE_ANON_KEY not found. File uploads will not work.');
}

// Configure memory storage to store files in memory before uploading to Supabase
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

// Upload file to Supabase Storage
export async function uploadToSupabaseStorage(file: Express.Multer.File): Promise<string> {
  if (!supabase) {
    // Fallback to base64 data URL if Supabase is not available
    console.warn('Supabase client not available, using base64 fallback');
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
  }

  const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
  const filePath = `uploads/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('celestial-lights-assets')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        duplex: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      // Fallback to base64 data URL if storage upload fails
      console.warn('Falling back to base64 data URL');
      const base64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64}`;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('celestial-lights-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Storage upload failed, using base64 fallback:', error);
    // Fallback to base64 data URL
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
  }
}