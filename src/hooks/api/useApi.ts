// hooks/api/useApi.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiClient from '@/lib/api';
import { handleApiError, parseApiResponse, UnknownObject, buildQueryString } from '@/utils/api';

// Generic fetcher for any endpoint
const fetcher = async <T>(endpoint: string, params?: UnknownObject): Promise<T> => {
  try {
    const queryString = params ? `?${buildQueryString(params)}` : '';
    const response = await apiClient.get<T>(`${endpoint}${queryString}`);
    return parseApiResponse<T>(response);
  } catch (error) {
    throw error;
  }
};

// Generic creator for any endpoint
const creator = async <T>(endpoint: string, data: UnknownObject): Promise<T> => {
  try {
    const response = await apiClient.post<T>(endpoint, data);
    return parseApiResponse<T>(response);
  } catch (error) {
    throw error;
  }
};

// Generic updater for any endpoint
const updater = async <T>(endpoint: string, id: number | string, data: UnknownObject, isPatch = true): Promise<T> => {
  try {
    const method = isPatch ? 'patch' : 'put';
    const response = await apiClient[method]<T>(`${endpoint}/${id}`, data);
    return parseApiResponse<T>(response);
  } catch (error) {
    throw error;
  }
};

// Generic deleter for any endpoint
const deleter = async <T>(endpoint: string, id: number | string): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(`${endpoint}/${id}`);
    return parseApiResponse<T>(response);
  } catch (error) {
    throw error;
  }
};

// Hook for fetching a list of items
export function useList<T>(
  endpoint: string,
  params?: UnknownObject,
  options?: UseQueryOptions<T, AxiosError>
) {
  return useQuery<T, AxiosError>({
    queryKey: [endpoint, params],
    queryFn: () => fetcher<T>(endpoint, params),
    ...options,
  });
}

// Hook for fetching a single item
export function useSingle<T>(
  endpoint: string,
  id?: number | string,
  options?: UseQueryOptions<T, AxiosError>
) {
  return useQuery<T, AxiosError>({
    queryKey: [endpoint, id],
    queryFn: () => fetcher<T>(`${endpoint}/${id}`),
    enabled: !!id,
    ...options,
  });
}

// Hook for creating items
export function useCreate<T>(
  endpoint: string,
  options?: UseMutationOptions<T, AxiosError, UnknownObject>
) {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, UnknownObject>({
    mutationFn: (data) => creator<T>(endpoint, data),
    onError: (error) => handleApiError(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    ...options,
  });
}

// Hook for updating items
export function useUpdate<T>(
  endpoint: string,
  options?: UseMutationOptions<T, AxiosError, { id: number | string; data: UnknownObject; isPatch?: boolean }>
) {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, { id: number | string; data: UnknownObject; isPatch?: boolean }>({
    mutationFn: ({ id, data, isPatch = true }) => updater<T>(endpoint, id, data, isPatch),
    onError: (error) => handleApiError(error),
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      queryClient.invalidateQueries({ queryKey: [endpoint, variables.id] });
    },
    ...options,
  });
}

// Hook for deleting items
export function useDelete<T>(
  endpoint: string,
  options?: UseMutationOptions<T, AxiosError, number | string>
) {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, number | string>({
    mutationFn: (id) => deleter<T>(endpoint, id),
    onError: (error) => handleApiError(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    ...options,
  });
}
