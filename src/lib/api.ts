// Get the API base URL based on environment
export const getApiUrl = (): string => {
  // In production (Vercel), use the backend URL from environment variable
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  
  // Client-side
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiUrl) {
    return apiUrl;
  }
  
  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  
  // Production without explicit API URL - use same origin
  return window.location.origin;
};

// Helper function to make API calls
export const apiCall = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
};

export default { getApiUrl, apiCall };
