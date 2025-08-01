import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kzoywkomnniqdrvccolg.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_ANON_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log('Setting up Supabase storage bucket...');
  
  try {
    // Create bucket for celestial lights assets
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('celestial-lights-assets', {
      public: true,
      allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
      fileSizeLimit: 52428800 // 50MB
    });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✓ Storage bucket "celestial-lights-assets" already exists');
      } else {
        console.error('Error creating bucket:', bucketError);
        return;
      }
    } else {
      console.log('✓ Storage bucket "celestial-lights-assets" created successfully');
    }

    // Test upload to verify permissions
    const testFile = Buffer.from('test file content');
    const { data, error: uploadError } = await supabase.storage
      .from('celestial-lights-assets')
      .upload('test/test.txt', testFile, {
        contentType: 'text/plain'
      });

    if (uploadError) {
      console.error('Error testing upload:', uploadError);
    } else {
      console.log('✓ Test upload successful');
      
      // Clean up test file
      await supabase.storage
        .from('celestial-lights-assets')
        .remove(['test/test.txt']);
      console.log('✓ Test file cleaned up');
    }

    console.log('✓ Supabase Storage setup complete!');
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupStorage();