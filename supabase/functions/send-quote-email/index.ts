import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  customerName?: string;
  customerEmail?: string;
  projectType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerName, customerEmail, projectType }: QuoteEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Celestial Lights <onboarding@resend.dev>",
      to: ["info.celestiallight@gmail.com"],
      subject: "New Quote Request - Celestial Lights",
      html: `
        <h1>New Quote Request</h1>
        <p>A new quote request has been received from the website.</p>
        
        <h2>Customer Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${customerName || 'Not provided'}</li>
          <li><strong>Email:</strong> ${customerEmail || 'Not provided'}</li>
          <li><strong>Project Type:</strong> ${projectType || 'General consultation'}</li>
          <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        <p>Please follow up with the customer as soon as possible.</p>
        
        <p>Best regards,<br>Celestial Lights Website</p>
      `,
    });

    console.log("Quote email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: "Quote request sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);