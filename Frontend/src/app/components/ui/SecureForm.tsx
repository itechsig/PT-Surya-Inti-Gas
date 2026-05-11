"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { CSRFProtection } from "../../../utils/csrf";
import { InputSanitizer } from "../../../utils/sanitization";

interface SecureFormProps {
  children: ReactNode;
  onSubmit: (data: Record<string, any>, headers: Record<string, string>) => Promise<void>;
  className?: string;
  sanitizeData?: boolean;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  className = "",
  sanitizeData = true
}) => {
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCsrfToken(CSRFProtection.getToken());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data: Record<string, any> = {};
      
      // Convert FormData to object and sanitize if requested
      for (const [key, value] of formData.entries()) {
        if (key === 'csrf_token') continue; // Skip CSRF token
        
        const stringValue = value.toString();
        data[key] = sanitizeData ? 
          InputSanitizer.sanitizeFormData({ [key]: stringValue })[key] : 
          stringValue;
      }
      
      // Add CSRF protection headers
      const headers = CSRFProtection.addToHeaders({
        'Content-Type': 'application/json',
      });
      
      await onSubmit(data, headers);
      
      // Refresh token after successful submission
      CSRFProtection.refreshToken();
      setCsrfToken(CSRFProtection.getToken());
      
    } catch (error) {
      console.error('Form submission error:', error);
      // Refresh token after error
      CSRFProtection.refreshToken();
      setCsrfToken(CSRFProtection.getToken());
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* CSRF Token */}
      <input
        type="hidden"
        name="csrf_token"
        value={csrfToken}
      />
      {children}
    </form>
  );
};
