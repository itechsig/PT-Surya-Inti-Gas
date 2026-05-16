export class CSRFProtection {
  private static readonly TOKEN_KEY = 'csrf_token';
  private static readonly HEADER_NAME = 'X-CSRF-Token';

  static generateToken(): string {
    const timestamp = Date.now().toString();
    const randomString = this.generateRandomString(32);
    const combined = `${timestamp}:${randomString}`;
    return this.hashString(combined);
  }

  private static generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private static async hashStringAsync(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static hashString(str: string): string {
    // Simple hash function for synchronous use
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16) + Date.now().toString(16);
  }

  static getToken(): string {
    let token = localStorage.getItem(this.TOKEN_KEY);
    
    if (!token) {
      token = this.generateToken();
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    
    return token;
  }

  static refreshToken(): string {
    const newToken = this.generateToken();
    localStorage.setItem(this.TOKEN_KEY, newToken);
    return newToken;
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return token === storedToken;
  }

  static getHeaderName(): string {
    return this.HEADER_NAME;
  }

  static addToHeaders(headers: Record<string, string>): Record<string, string> {
    return {
      ...headers,
      [this.HEADER_NAME]: this.getToken()
    };
  }

  static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
