const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const config = {
  endpoint: BASE_URL,
  api: {
    baseURL: `${BASE_URL}/api`,
  },
} as const; 