/**
 * Utility function to fix image URLs that might be using localhost or incorrect paths
 * This is a temporary workaround until Railway deployment is complete
 */
export function fixImageUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder-image.png';
  
  // If it's already a proper HTTPS URL and not using localhost, return as-is
  if (url.startsWith('https://') && !url.includes('localhost')) return url;
  
  // Replace localhost URLs with Railway production URL
  if (url.startsWith('http://localhost')) {
    return url.replace('http://localhost', 'https://ptsuryaintigas-production.up.railway.app');
  }
  
  // Replace HTTP URLs with HTTPS
  if (url.startsWith('http://') && !url.includes('localhost')) {
    return url.replace('http://', 'https://');
  }
  
  // If it's a relative path starting with /storage/, convert to API endpoint
  if (url.startsWith('/storage/')) {
    const path = url.replace('/storage/', '');
    return `https://ptsuryaintigas-production.up.railway.app/api/v1/image/${encodeURIComponent(path)}`;
  }
  
  // If it's a relative path starting with /images/, convert to API endpoint
  if (url.startsWith('/images/')) {
    const path = url.replace('/images/', '');
    return `https://ptsuryaintigas-production.up.railway.app/api/v1/image/${encodeURIComponent(path)}`;
  }
  
  // If it's already using the API endpoint format but with localhost, fix it
  if (url.includes('localhost/api/v1/image/')) {
    return url.replace('http://localhost', 'https://ptsuryaintigas-production.up.railway.app');
  }
  
  // If it's a relative path without leading slash, try to make it work
  if (!url.startsWith('http') && !url.startsWith('/')) {
    return `https://ptsuryaintigas-production.up.railway.app/api/v1/image/${encodeURIComponent(url)}`;
  }
  
  // Return as-is if we can't determine the pattern
  return url;
}