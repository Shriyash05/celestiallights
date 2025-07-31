import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GlowingButton from "@/components/GlowingButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_CONFIG } from "@/config/contact";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create detailed WhatsApp message with all form data
      let whatsappMessage = `Hi! I'm interested in your lighting solutions and would like to request a custom quote.

*Project Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}
• Company: ${formData.company || 'Not specified'}
• Project Type: ${formData.projectType || 'Not specified'}

*Project Description:*
${formData.message}

*PDF Requirements:*
I have a PDF file with detailed project requirements that I can share directly in this chat after connecting.
`;

      whatsappMessage += `\n\nPlease get back to me soon! Thank you.`;

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Open WhatsApp directly
      const whatsappLink = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappLink, '_blank');

      toast({
        title: "WhatsApp Opened",
        description:
          "You've been redirected to WhatsApp. You can share your PDF directly in the chat after connecting.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 89764 53765"],
      subtitle: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@celestiallights.com"],
      subtitle: "Send us your requirements"
    },
    {
      icon: MapPin,
      title: "Location",
      details: ["Siddhivinayak Engineering", "Par-R-410,TTC Industries Area","MIDC Industrial Area, Rabale, Navi Mumbai, Maharashtra 400701"],
      subtitle: "Visit our facility"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon-Fri: 9:00 AM - 6:00 PM", "Sat: 9:00 AM - 2:00 PM"],
      subtitle: "We're here to help"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Get In Touch</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Illuminate Your
            <span className="text-primary"> Vision</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your space? Contact our lighting experts for a consultation 
            and discover how we can bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 bg-background">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{info.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{info.subtitle}</p>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm font-medium">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <Card className="mt-8 border-0 bg-gradient-hero border border-primary/20">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Why Choose Us?</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium">&lt; 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Project Timeline</span>
                    <span className="text-sm font-medium">2-4 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Warranty</span>
                    <span className="text-sm font-medium">5+ years</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-background">
              <CardHeader>
                <CardTitle className="text-2xl">Request a Custom Quote</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and our lighting specialists will get back to you with a detailed proposal.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company/Organization</label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Type</label>
                    <Input
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      placeholder="e.g., Residential, Commercial, Architectural"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Details *</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your lighting requirements, space details, timeline, and any specific preferences..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  {/* PDF Upload Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        <strong>Note:</strong> You can upload and share your PDF requirements directly in the WhatsApp chat after you are redirected.
                      </span>
                    </div>
                  </div>

                  <GlowingButton 
                    type="submit" 
                    size="lg" 
                    className="w-full group"
                    glowColor="golden"
                    intensity="high"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        Send via WhatsApp
                      </>
                    )}
                  </GlowingButton>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;