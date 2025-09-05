import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for admin operations
const supabaseUrl = 'https://kzoywkomnniqdrvccolg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: any = null;

if (supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not found. Upload URL generation will not work.');
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
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: "fileName and fileType are required" });
    }

    if (!supabase) {
      return res.status(500).json({ error: "Storage service not configured" });
    }

    // Generate a unique file name
    const timestamp = Date.now();
    const randomId = Math.round(Math.random() * 1E9);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomId}.${fileExtension}`;
    const filePath = `uploads/${uniqueFileName}`;

    // Generate signed URL for upload (valid for 1 hour)
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
      uploadUrl: signedUrlData.signedUrl,
      filePath: filePath,
      publicUrl: publicUrl,
      fileName: uniqueFileName
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return res.status(500).json({ error: "Failed to generate upload URL" });
  }
}
