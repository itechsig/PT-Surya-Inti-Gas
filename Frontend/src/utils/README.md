<!-- # Security Utilities

This directory contains security utilities for CSRF protection and XSS prevention.

## CSRF Protection (`csrf.ts`)

The `CSRFProtection` class provides methods for generating and managing CSRF tokens:

### Methods:
- `generateToken()`: Generates a new CSRF token using SHA-256
- `getToken()`: Retrieves existing token or creates a new one
- `refreshToken()`: Generates and stores a new token
- `validateToken(token)`: Validates if token matches stored token
- `getHeaderName()`: Returns the header name for CSRF token ('X-CSRF-Token')
- `addToHeaders(headers)`: Adds CSRF token to request headers
- `clearToken()`: Removes CSRF token from localStorage

### Usage:
```typescript
import { CSRFProtection } from '../utils/csrf';

// Get token for form
const token = CSRFProtection.getToken();

// Add to request headers
const headers = CSRFProtection.addToHeaders({
  'Content-Type': 'application/json'
});

// Refresh token after submission
CSRFProtection.refreshToken();
```

## Input Sanitization (`sanitization.ts`)

The `InputSanitizer` class provides methods for sanitizing user input to prevent XSS attacks:

### Methods:
- `sanitizeString(input)`: Basic string sanitization
- `sanitizeEmail(email)`: Email-specific sanitization
- `sanitizePhoneNumber(phone)`: Phone number sanitization
- `sanitizeName(name)`: Name field sanitization
- `sanitizeMessage(message)`: Message field sanitization (allows basic formatting)
- `sanitizeFormData(formData)`: Sanitizes entire form data object
- `isValidXSSInput(input)`: Checks for potential XSS patterns

### Usage:
```typescript
import { InputSanitizer } from '../utils/sanitization';

// Sanitize single input
const cleanName = InputSanitizer.sanitizeName(userInput);

// Sanitize entire form
const cleanData = InputSanitizer.sanitizeFormData(formData);
```

## SecureForm Component

The `SecureForm` component combines CSRF protection and input sanitization:

### Props:
- `children`: Form content
- `onSubmit`: Submit handler with sanitized data and headers
- `className`: CSS classes for form element
- `sanitizeData`: Whether to sanitize form data (default: true)

### Usage:
```typescript
import { SecureForm } from '../components/ui/SecureForm';

<SecureForm
  onSubmit={async (data, headers) => {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
  }}
  className="space-y-4"
>
  {/* Form fields */}
</SecureForm>
```

## Security Features

### CSRF Protection:
- Tokens stored in localStorage
- Automatic token refresh after submissions
- SHA-256 encrypted tokens
- Custom HTTP headers

### XSS Protection:
- DOMPurify-based sanitization
- Field-specific sanitization rules
- XSS pattern detection
- Configurable allowed HTML tags

### Best Practices:
1. Always use SecureForm for new forms
2. Refresh tokens after successful submissions
3. Validate server-side as well
4. Keep dependencies updated
5. Test with various XSS payloads -->
