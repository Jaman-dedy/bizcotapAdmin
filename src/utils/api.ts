// lib/utils/api.ts
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Type for unknown objects
export type UnknownObject = Record<string, any>;

// Error handling for API requests
export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected error occurred';

    toast.error(errorMessage);
    return errorMessage;
  }

  const fallbackMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  toast.error(fallbackMessage);
  return fallbackMessage;
};

// Success handling for API requests
export const handleApiSuccess = (message: string) => {
  toast.success(message);
  return message;
};

// Parse API response data
export const parseApiResponse = <T>(response: AxiosResponse): T => {
  return response.data;
};

// Build query string from params
export const buildQueryString = (params: UnknownObject): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(`${key}[]`, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  return queryParams.toString();
};
