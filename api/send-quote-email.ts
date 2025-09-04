import { VercelRequest, VercelResponse } from '@vercel/node';

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
    const { customerName, customerEmail, projectType } = req.body;
    
    // Log the quote request
    const quoteRequest = {
      customerName: customerName || 'Not provided',
      customerEmail: customerEmail || 'Not provided',
      projectType: projectType || 'General consultation',
      timestamp: new Date().toISOString()
    };
    
    console.log("New quote request:", quoteRequest);
    
    // If email credentials are provided, send email using Nodemailer
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: 'New Quote Request - Celestial Lights',
        html: `
          <h1>New Quote Request</h1>
          <p>A new quote request has been received from the website.</p>
          
          <h2>Customer Details:</h2>
          <ul>
            <li><strong>Name:</strong> ${quoteRequest.customerName}</li>
            <li><strong>Email:</strong> ${quoteRequest.customerEmail}</li>
            <li><strong>Project Type:</strong> ${quoteRequest.projectType}</li>
            <li><strong>Timestamp:</strong> ${quoteRequest.timestamp}</li>
          </ul>
          
          <p>Please follow up with the customer as soon as possible.</p>
          
          <p>Best regards,<br>Celestial Lights Website</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Quote email sent successfully');
    }
    
    res.json({ success: true, message: "Quote request received successfully" });
  } catch (error) {
    console.error("Error processing quote request:", error);
    // Even if email fails, we should still log the request and return success
    res.json({ success: true, message: "Quote request received successfully" });
  }
}
