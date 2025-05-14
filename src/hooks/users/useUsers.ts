// hooks/api/useUsers.ts
import { useList, useSingle, useCreate, useUpdate, useDelete } from '../api/useApi';
import {
  User,
  UpdateUserDto,
  UserQueryParams,
} from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { handleApiError, parseApiResponse } from '@/utils/api';
import type { AxiosError } from 'axios';

// Endpoint constants
const USERS_ENDPOINT = '/users';

// Hook for fetching users list with pagination and filters
export function useUsers(params?: UserQueryParams) {
  return useList<User[]>(USERS_ENDPOINT, params);
}

// Hook for fetching a single user by ID
export function useUser(id?: number) {
  return useSingle<User>(USERS_ENDPOINT, id);
}

// Hook for creating a user
export function useCreateUser() {
  return useCreate<User>(USERS_ENDPOINT);
}

// Hook for updating a user
export function useUpdateUser() {
  return useUpdate<User>(USERS_ENDPOINT);
}

// Hook for deleting a user
export function useDeleteUser() {
  return useDelete<boolean>(USERS_ENDPOINT);
}

// Hook for updating user's own profile (special endpoint if needed)
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError, UpdateUserDto>({
    mutationFn: async (data) => {
      const response = await apiClient.patch(`${USERS_ENDPOINT}/profile`, data);
      return parseApiResponse<User>(response);
    },
    onError: (error) => handleApiError(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_ENDPOINT, 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

// Hook for changing user's password (special endpoint if needed)
export function useChangePassword() {
  return useMutation<void, AxiosError, { currentPassword: string; newPassword: string }>({
    mutationFn: async (data) => {
      const response = await apiClient.post(`${USERS_ENDPOINT}/change-password`, data);
      return parseApiResponse<void>(response);
    },
    onError: (error) => handleApiError(error),
  });
}

// Hook for getting user count statistics
export function useUserStats() {
  return useList<{
    totalUsers: number;
    activeUsers: number;
    usersByRole: { role: string; count: number }[];
    usersByCompany: { companyId: number; companyName: string; count: number }[];
  }>(`${USERS_ENDPOINT}/stats`);
}

// Hook to fetch available roles (if there's an endpoint for it)
export function useUserRoles() {
  return useList<{ role: string; description: string }[]>(`${USERS_ENDPOINT}/roles`);
}
