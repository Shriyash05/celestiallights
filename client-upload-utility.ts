// Client-side upload utility for handling files of any size
// Copy this to your client-side code (e.g., src/utils/upload.ts)

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
  filePath?: string;
}

interface SmartUploadResponse {
  method: 'direct' | 'signed-upload';
  uploadUrl?: string;
  publicUrl?: string;
  fileName?: string;
  filePath?: string;
  message?: string;
  maxSize?: number;
}

/**
 * Smart upload function that automatically chooses the best upload method
 * based on file size and handles both small and large files seamlessly.
 */
export async function smartUpload(file: File): Promise<UploadResult> {
  try {
    // Step 1: Ask the API which upload method to use
    const methodResponse = await fetch('/api/smart-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'get-upload-method',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    });

    if (!methodResponse.ok) {
      throw new Error(`Failed to get upload method: ${methodResponse.statusText}`);
    }

    const methodData: SmartUploadResponse = await methodResponse.json();

    // Step 2: Handle upload based on the recommended method
    if (methodData.method === 'direct') {
      // Use traditional FormData upload for small files
      return await traditionalUpload(file);
    } else if (methodData.method === 'signed-upload') {
      // Use direct Supabase upload for large files
      return await signedUpload(file, methodData);
    } else {
      throw new Error('Unknown upload method received from server');
    }
  } catch (error) {
    console.error('Smart upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Traditional upload method for smaller files (< 4MB)
 */
async function traditionalUpload(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.files && data.files.length > 0) {
    const uploadedFile = data.files[0];
    return {
      success: true,
      url: uploadedFile.url,
      fileName: uploadedFile.filename,
    };
  } else {
    throw new Error('No file data returned from server');
  }
}

/**
 * Signed URL upload method for larger files (> 4MB)
 */
async function signedUpload(file: File, uploadData: SmartUploadResponse): Promise<UploadResult> {
  if (!uploadData.uploadUrl || !uploadData.publicUrl || !uploadData.filePath) {
    throw new Error('Invalid upload data received from server');
  }

  // Step 1: Upload directly to Supabase using the signed URL
  const uploadResponse = await fetch(uploadData.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Direct upload failed: ${uploadResponse.statusText}`);
  }

  // Step 2: Confirm the upload with our API
  const confirmResponse = await fetch('/api/smart-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'confirm-upload',
      filePath: uploadData.filePath,
    }),
  });

  if (!confirmResponse.ok) {
    throw new Error(`Upload confirmation failed: ${confirmResponse.statusText}`);
  }

  const confirmData = await confirmResponse.json();

  return {
    success: true,
    url: confirmData.url,
    fileName: uploadData.fileName,
    filePath: uploadData.filePath,
  };
}

/**
 * Simple file upload with progress tracking
 */
export async function uploadWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    // For now, we'll simulate progress for signed uploads
    // In a real implementation, you might want to use XMLHttpRequest for better progress tracking
    
    if (onProgress) onProgress(0);
    
    const result = await smartUpload(file);
    
    if (onProgress) onProgress(100);
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Utility function to format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if a file type is supported
 */
export function isFileTypeSupported(file: File): boolean {
  const supportedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/mov', 'video/avi', 'video/quicktime',
    'application/pdf'
  ];
  
  return supportedTypes.includes(file.type) || 
         file.type.startsWith('image/') || 
         file.type.startsWith('video/');
}
