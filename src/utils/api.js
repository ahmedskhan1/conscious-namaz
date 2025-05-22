/**
 * Gets the absolute URL for an API endpoint
 * This is needed for server components in Next.js
 * 
 * @param {string} path - The API path (e.g., '/api/blogs')
 * @returns {string} - The absolute URL
 */
export function getApiUrl(path) {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For local development
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000/${cleanPath}`;
  }
  
  // For Vercel production environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/${cleanPath}`;
  }
  
  // For custom domain in production
  if (process.env.NEXT_PUBLIC_DOMAIN) {
    return `https://${process.env.NEXT_PUBLIC_DOMAIN}/${cleanPath}`;
  }
  
  // Fallback to relative URL if we can't determine the absolute URL
  // This will work for client-side requests but not for server components
  return `/${cleanPath}`;
} 