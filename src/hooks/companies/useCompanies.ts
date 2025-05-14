// hooks/api/useCompanies.ts
import { useList, useSingle, useCreate, useUpdate, useDelete } from '../api/useApi';
import {
  Company,
  CompanyQueryParams,
  PaginatedResponse,
  AddEmployeeDto,
  User
} from '@/types/company';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { handleApiError, parseApiResponse } from '@/utils/api';
import { AxiosError } from 'axios';

// Endpoint constants
const COMPANIES_ENDPOINT = '/companies';
const INDUSTRIES_ENDPOINT = '/companies/industries';
const AVAILABLE_USERS_ENDPOINT = '/users';

// Hook for fetching companies list with pagination and filters
export function useCompanies(params?: CompanyQueryParams) {
  return useList<PaginatedResponse<Company>>(COMPANIES_ENDPOINT, params);
}

// Hook for fetching a single company by ID
export function useCompany(id?: number) {
  return useSingle<Company>(COMPANIES_ENDPOINT, id);
}

// Hook for creating a company
export function useCreateCompany() {
  return useCreate<Company>(COMPANIES_ENDPOINT);
}

// Hook for updating a company
export function useUpdateCompany() {
  return useUpdate<Company>(COMPANIES_ENDPOINT);
}

// Hook for deleting a company
export function useDeleteCompany() {
  return useDelete<boolean>(COMPANIES_ENDPOINT);
}

// Hook for fetching available industries
export function useIndustries() {
  return useList<string[]>(INDUSTRIES_ENDPOINT);
}

// Hook for fetching available users
export function useAvailableUsers() {
  return useList<User[]>(`${AVAILABLE_USERS_ENDPOINT}?filter=available`);
}

// Hook for adding employees to a company
export function useAddEmployees() {
  const queryClient = useQueryClient();

  return useMutation<Company, AxiosError, { companyId: number; data: AddEmployeeDto }>({
    mutationFn: async ({ companyId, data }) => {
      const response = await apiClient.post(`${COMPANIES_ENDPOINT}/${companyId}/employees`, data);
      return parseApiResponse<Company>(response);
    },
    onError: (error) => handleApiError(error),
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: [COMPANIES_ENDPOINT] });
      queryClient.invalidateQueries({ queryKey: [COMPANIES_ENDPOINT, variables.companyId] });
    },
  });
}

// Hook for removing an employee from a company
export function useRemoveEmployee() {
  const queryClient = useQueryClient();

  return useMutation<boolean, AxiosError, { companyId: number; userId: number }>({
    mutationFn: async ({ companyId, userId }) => {
      const response = await apiClient.delete(`${COMPANIES_ENDPOINT}/${companyId}/employees/${userId}`);
      return response.status === 200;
    },
    onError: (error) => handleApiError(error),
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: [COMPANIES_ENDPOINT] });
      queryClient.invalidateQueries({ queryKey: [COMPANIES_ENDPOINT, variables.companyId] });
    },
  });
}

// Hook for batch deleting companies
export function useBatchDeleteCompanies() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean, failedIds: number[] }, AxiosError, number[]>({
    mutationFn: async (ids) => {
      const response = await apiClient.delete(`${COMPANIES_ENDPOINT}/batch`, { data: { ids } });
      return parseApiResponse<{ success: boolean, failedIds: number[] }>(response);
    },
    onError: (error) => handleApiError(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANIES_ENDPOINT] });
    },
  });
}

// Hook for searching companies
export function useSearchCompanies() {
  return useMutation<Company[], AxiosError, string>({
    mutationFn: async (query) => {
      const response = await apiClient.get(`${COMPANIES_ENDPOINT}/search?q=${encodeURIComponent(query)}`);
      return parseApiResponse<Company[]>(response);
    },
    onError: (error) => handleApiError(error),
  });
}
