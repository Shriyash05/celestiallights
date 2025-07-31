import React from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { CONTACT_CONFIG } from "@/config/contact";

interface CallUsButtonProps {
  variant?: "default" | "outline" | "ghost" | "hero";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

const CallUsButton: React.FC<CallUsButtonProps> = ({ 
  variant = "default", 
  size = "md", 
  className = "",
  children = "Call Us",
  showIcon = true
}) => {
  const phoneNumber = CONTACT_CONFIG.businessPhone.replace(/\s+/g, '').replace('+', '');
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      asChild
    >
      <a href={`tel:${phoneNumber}`}>
        {showIcon && <Phone className="mr-2 h-4 w-4" />}
        {children}
      </a>
    </Button>
  );
};

export default CallUsButton; 