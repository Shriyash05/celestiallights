import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import formidable, { File } from 'formidable';
import fs from 'fs';

// Initialize Supabase client for storage
const supabaseUrl = 'https://kzoywkomnniqdrvccolg.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: any = null;

// Only initialize if we have the required credentials
if (supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('VITE_SUPABASE_ANON_KEY not found. File uploads will not work.');
}

// Upload file to Supabase Storage
async function uploadToSupabaseStorage(file: File): Promise<string> {
  if (!supabase) {
    // Fallback to base64 data URL if Supabase is not available
    console.warn('Supabase client not available, using base64 fallback');
    const buffer = fs.readFileSync(file.filepath);
    const base64 = buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
  }

  const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalFilename}`;
  const filePath = `uploads/${fileName}`;

  try {
    const buffer = fs.readFileSync(file.filepath);
    
    const { data, error } = await supabase.storage
      .from('celestial-lights-assets')
      .upload(filePath, buffer, {
        contentType: file.mimetype || 'application/octet-stream',
        duplex: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      // Fallback to base64 data URL if storage upload fails
      console.warn('Falling back to base64 data URL');
      const base64 = buffer.toString('base64');
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
    const buffer = fs.readFileSync(file.filepath);
    const base64 = buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
  }
}

// Disable body parsing for this API route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  try {
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB limit - increased for better video support
      multiples: true,
      filter: ({ mimetype }: { mimetype?: string | null }) => {
        // Allow images, videos, and PDFs
        return !!(mimetype && (
          mimetype.startsWith('image/') ||
          mimetype.startsWith('video/') ||
          mimetype === 'application/pdf'
        ));
      },
    });

    const [fields, files] = await form.parse(req);
    
    if (!files.files || !Array.isArray(files.files) || files.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const filePromises = files.files.map(async (file: File) => {
      try {
        const publicUrl = await uploadToSupabaseStorage(file);
        return {
          filename: file.originalFilename || 'unknown',
          originalName: file.originalFilename || 'unknown',
          url: publicUrl,
          size: file.size,
          mimetype: file.mimetype || 'application/octet-stream',
        };
      } catch (error) {
        console.error(`Failed to upload ${file.originalFilename}:`, error);
        throw error;
      }
    });

    const fileData = await Promise.all(filePromises);
    res.json({ files: fileData });
  } catch (error) {
    console.error("Error uploading files:", error);
    
    // Check if it's a file size error
    if (error instanceof Error && error.toString().includes('maxFileSize exceeded')) {
      return res.status(413).json({ 
        error: "File too large", 
        message: "File size exceeds 25MB limit. For larger files, consider compressing your video or use the direct upload option.",
        maxSize: "25MB",
        suggestion: "Try using video compression tools or contact support for files larger than 25MB"
      });
    }
    
    res.status(500).json({ error: "Failed to upload files" });
  }
}
