import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_CONFIG } from "@/config/contact";

interface QuoteModalProps {
  trigger: React.ReactNode;
  type: "quote" | "consultation";
}

const QuoteModal: React.FC<QuoteModalProps> = ({ trigger, type }) => {
  const { toast } = useToast();

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    location: "",
    budget: "",
    timeline: "",
    description: "",
    needsPdf: false,
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.projectType || !formData.description) {
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
      let whatsappMessage = `Hi! I'm interested in your lighting solutions and would like to request a ${type}.

*Project Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}
• Project Type: ${formData.projectType}
• Location: ${formData.location || 'Not specified'}
• Budget Range: ${formData.budget || 'Not specified'}
• Timeline: ${formData.timeline || 'Not specified'}

*Project Description:*
${formData.description}`;

      // Add PDF note if needed
      if (formData.needsPdf) {
        whatsappMessage += `

*PDF Requirements:*
I have a PDF file with detailed project requirements that I can share directly in this chat after connecting.`;
      }

      whatsappMessage += `

Please get back to me soon! Thank you.`;

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

      setIsOpen(false);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        location: "",
        budget: "",
        timeline: "",
        description: "",
        needsPdf: false,
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {type === "quote" ? "Request Quote" : "Schedule Consultation"}
          </DialogTitle>
          <DialogDescription>
            {type === "quote"
              ? "Get a detailed quote for your lighting project with custom specifications."
              : "Schedule a free consultation to discuss your lighting needs and explore solutions."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential Lighting</SelectItem>
                <SelectItem value="commercial">Commercial Lighting</SelectItem>
                <SelectItem value="architectural">Architectural Lighting</SelectItem>
                <SelectItem value="led-solutions">LED Solutions</SelectItem>
                <SelectItem value="smart-lighting">Smart Lighting Systems</SelectItem>
                <SelectItem value="cnc-machining">CNC Machining Services</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Project Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, State"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget Range</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-1-lakh">Under ₹1 Lakh</SelectItem>
                <SelectItem value="1-5-lakh">₹1 - 5 Lakh</SelectItem>
                <SelectItem value="5-10-lakh">₹5 - 10 Lakh</SelectItem>
                <SelectItem value="10-25-lakh">₹10 - 25 Lakh</SelectItem>
                <SelectItem value="25-50-lakh">₹25 - 50 Lakh</SelectItem>
                <SelectItem value="above-50-lakh">Above ₹50 Lakh</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeline">Project Timeline</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (Within 1 month)</SelectItem>
                <SelectItem value="1-3-months">1-3 Months</SelectItem>
                <SelectItem value="3-6-months">3-6 Months</SelectItem>
                <SelectItem value="6-12-months">6-12 Months</SelectItem>
                <SelectItem value="planning">Just Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Please describe your lighting requirements, space details, and any specific needs..."
            className="min-h-[100px]"
            required
          />
        </div>
        
        {/* PDF Note Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="needsPdf"
              checked={formData.needsPdf}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needsPdf: checked as boolean }))}
            />
            <Label htmlFor="needsPdf" className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              I will attach a detailed PDF with project requirements
            </Label>
          </div>
          {formData.needsPdf && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> You can upload and share your PDF requirements directly in the WhatsApp chat after you are redirected.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.email || !formData.projectType || !formData.description || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                Send via WhatsApp
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;