
export class InputSanitizer {
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Basic HTML entity encoding and script tag removal
    return input.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized.toLowerCase() : '';
  }

  static sanitizePhoneNumber(phone: string): string {
    const sanitized = this.sanitizeString(phone);
    const phoneRegex = /^[0-9+\-\s()]+$/;
    return phoneRegex.test(sanitized) ? sanitized : '';
  }

  static sanitizeName(name: string): string {
    const sanitized = this.sanitizeString(name);
    const nameRegex = /^[a-zA-Z\s\u00C0-\u017F\-'.]+$/;
    return nameRegex.test(sanitized) ? sanitized : '';
  }

  static sanitizeMessage(message: string): string {
    if (typeof message !== 'string') {
      return '';
    }
    
    // Allow basic formatting but sanitize dangerous content
    return message.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^>]*>/gi, '')
      .replace(/<object\b[^>]*>/gi, '')
      .replace(/<embed\b[^>]*>/gi, '')
      .replace(/<link\b[^>]*>/gi, '')
      .replace(/<meta\b[^>]*>/gi, '');
  }

  static sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        switch (key) {
          case 'email':
            sanitized[key] = this.sanitizeEmail(value);
            break;
          case 'no_hp':
          case 'phone':
          case 'telephone':
            sanitized[key] = this.sanitizePhoneNumber(value);
            break;
          case 'nama':
          case 'name':
          case 'first_name':
          case 'last_name':
            sanitized[key] = this.sanitizeName(value);
            break;
          case 'pesan':
          case 'message':
          case 'description':
            sanitized[key] = this.sanitizeMessage(value);
            break;
          default:
            sanitized[key] = this.sanitizeString(value);
        }
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  static isValidXSSInput(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^>]*>/gi,
      /<object\b[^>]*>/gi,
      /<embed\b[^>]*>/gi,
      /<link\b[^>]*>/gi,
      /<meta\b[^>]*>/gi,
      /expression\s*\(/gi,
      /@import/i,
      /vbscript:/gi
    ];
    
    return !xssPatterns.some(pattern => pattern.test(input));
  }
}
