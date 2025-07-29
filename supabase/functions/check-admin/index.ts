import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get admin emails from secrets
    const adminEmail1 = Deno.env.get('ADMIN_EMAIL_1');
    const adminEmail2 = Deno.env.get('ADMIN_EMAIL_2');

    console.log(`Checking email: ${email}`);
    console.log(`Admin email 1: ${adminEmail1 ? 'SET' : 'NOT SET'}`);
    console.log(`Admin email 2: ${adminEmail2 ? 'SET' : 'NOT SET'}`);

    if (!adminEmail1 && !adminEmail2) {
      console.error('No admin emails configured in secrets');
      return new Response(
        JSON.stringify({ error: 'Admin configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if the email matches either admin email
    const isAdmin = (adminEmail1 && email === adminEmail1) || (adminEmail2 && email === adminEmail2);

    console.log(`Admin check for ${email}: ${isAdmin}`);

    return new Response(
      JSON.stringify({ isAdmin }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in check-admin function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});