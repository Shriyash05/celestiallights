// Contact configuration
export const CONTACT_CONFIG = {
  // WhatsApp number (replace with actual business number)
  whatsappNumber: "918976453765", // Format: country code + number without +
  
  // Email addresses
  businessEmail: "info.celestiallight@gmail.com",
  
  // Phone numbers
  businessPhone: "+91 98765 43210",
  
  // Address
  businessAddress: "Mumbai, Maharashtra, India",
  
  // Business hours
  businessHours: "Mon - Fri: 9:00 AM - 6:00 PM",
};

// WhatsApp message templates
export const WHATSAPP_MESSAGES = {
  quoteRequest: (name: string, projectType: string) => 
    `Hi! I just sent a quote request via email. My name is ${name} and I'm interested in ${projectType} for my project. Please check your email and get back to me soon!`,
  
  consultationRequest: (name: string, projectType: string) => 
    `Hi! I just sent a consultation request via email. My name is ${name} and I'm interested in ${projectType} for my project. Please check your email and get back to me soon!`,
}; 