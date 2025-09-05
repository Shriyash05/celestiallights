import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://kzoywkomnniqdrvccolg.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: any = null;

if (supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('VITE_SUPABASE_ANON_KEY not found. Smart upload will not work.');
}

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
    const { action, fileName, fileType, fileSize } = req.body;

    if (!supabase) {
      return res.status(500).json({ error: "Storage service not configured" });
    }

    // Handle different actions
    switch (action) {
      case 'get-upload-method':
        // Determine the best upload method based on file size
        // Vercel Hobby plan has ~4.5MB limit for request bodies
        const maxDirectUploadSize = 4 * 1024 * 1024; // 4MB to be safe
        
        if (fileSize <= maxDirectUploadSize) {
          return res.status(200).json({
            method: 'direct',
            message: 'Use traditional API upload',
            maxSize: maxDirectUploadSize
          });
        } else {
          // Generate signed URL for large files
          const timestamp = Date.now();
          const randomId = Math.round(Math.random() * 1E9);
          const fileExtension = fileName.split('.').pop();
          const uniqueFileName = `${timestamp}-${randomId}.${fileExtension}`;
          const filePath = `uploads/${uniqueFileName}`;

          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('celestial-lights-assets')
            .createSignedUploadUrl(filePath);

          if (signedUrlError) {
            console.error('Error generating signed URL:', signedUrlError);
            return res.status(500).json({ error: "Failed to generate upload URL" });
          }

          // Get the public URL for later reference
          const { data: { publicUrl } } = supabase.storage
            .from('celestial-lights-assets')
            .getPublicUrl(filePath);

          return res.status(200).json({
            method: 'signed-upload',
            uploadUrl: signedUrlData.signedUrl,
            filePath: filePath,
            publicUrl: publicUrl,
            fileName: uniqueFileName,
            message: 'Use signed URL for direct upload'
          });
        }

      case 'confirm-upload':
        // Confirm that a signed upload was successful
        const { filePath: confirmedPath } = req.body;
        
        if (!confirmedPath) {
          return res.status(400).json({ error: "filePath is required" });
        }

        // Get the public URL
        const { data: { publicUrl: confirmedUrl } } = supabase.storage
          .from('celestial-lights-assets')
          .getPublicUrl(confirmedPath);

        return res.status(200).json({
          success: true,
          url: confirmedUrl,
          filePath: confirmedPath,
          message: 'Upload confirmed successfully'
        });

      default:
        return res.status(400).json({ error: "Invalid action. Use 'get-upload-method' or 'confirm-upload'" });
    }
  } catch (error) {
    console.error("Error in smart upload:", error);
    return res.status(500).json({ error: "Failed to process upload request" });
  }
}
