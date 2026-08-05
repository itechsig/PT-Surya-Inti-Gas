/**
 * Utility function to fix image URLs that might be using localhost or incorrect paths
 * This is a temporary workaround until Railway deployment is complete
 */
export function fixImageUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder-image.png';
  
  // If it's already a proper HTTPS URL and not using localhost, return as-is
  if (url.startsWith('https://') && !url.includes('localhost')) return url;
  
  // Replace localhost URLs with Railway production URL using storage link
  if (url.startsWith('http://localhost/api/v1/image/')) {
    const path = url.replace('http://localhost/api/v1/image/', '');
    // Use storage link instead of API endpoint since API not deployed yet
    return `https://ptsuryaintigas-production.up.railway.app/storage/${path}`;
  }
  
  // Replace localhost URLs with Railway production URL
  if (url.startsWith('http://localhost')) {
    return url.replace('http://localhost', 'https://ptsuryaintigas-production.up.railway.app');
  }
  
  // Replace HTTP URLs with HTTPS
  if (url.startsWith('http://') && !url.includes('localhost')) {
    return url.replace('http://', 'https://');
  }
  
  // If it's a relative path starting with /storage/, try storage link
  if (url.startsWith('/storage/')) {
    return `https://ptsuryaintigas-production.up.railway.app${url}`;
  }
  
  // If it's a relative path starting with /images/, try to make it work with storage
  if (url.startsWith('/images/')) {
    const path = url.replace('/images/', '');
    return `https://ptsuryaintigas-production.up.railway.app/storage/${path}`;
  }
  
  // If it's a relative path without leading slash, try storage
  if (!url.startsWith('http') && !url.startsWith('/')) {
    return `https://ptsuryaintigas-production.up.railway.app/storage/${url}`;
  }
  
  // Return as-is if we can't determine the pattern
  return url;
}