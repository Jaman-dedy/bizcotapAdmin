// hooks/useTags.ts
import { useState, useEffect, useCallback } from 'react';
import { Tag } from '@/services/tagsService';
import apiClient from '@/lib/api';
import { notification } from 'antd';
import { handleApiError, parseApiResponse } from '@/utils/api';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';



const TAG_ENDPOINT = '/tag';


export function useCreateTagWithFormData() {
  const queryClient = useQueryClient();

  return useMutation<Tag, AxiosError, { tagData: object, avatarFile?: File | null }>({
    mutationFn: async ({ tagData, avatarFile }) => {
      // Create FormData instance
      const formData = new FormData();

      // Add the tag data as JSON string to the 'data' key
      formData.append('data', JSON.stringify(tagData));

      // Add avatar file if provided
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // Make the API request with FormData
      const response = await apiClient.post(TAG_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return parseApiResponse<Tag>(response);
    },
    onSuccess: () => {
      // Invalidate tags list query to refresh the data
      queryClient.invalidateQueries({ queryKey: [TAG_ENDPOINT] });
    },
    onError: (error) => handleApiError(error),
  });
}

export default function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tags
  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get('/tag');
      setTags(response.data);

      return response.data;
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch tags';
      setError(errorMessage);

      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch a single tag by ID
  const fetchTagById = async (id: number | string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get(`/tag/${id}`);
      return response.data;
    } catch (err: any) {
      console.error(`Error fetching tag with ID ${id}:`, err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch tag';
      setError(errorMessage);

      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Update a tag
  const updateTag = async (id: number | string, tagData: any, avatarFile?: File | null) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create FormData for file upload if needed
      const formData = new FormData();
      formData.append('data', JSON.stringify(tagData));

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await apiClient.put(`/tag/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the tag in the local state
      setTags(prev => prev.map(tag => tag.id === id ? response.data : tag));

      // Show success notification
      notification.success({
        message: 'Contact Updated',
        description: 'Contact information has been updated successfully.',
      });

      return { success: true, data: response.data };
    } catch (err: any) {
      console.error(`Error updating tag with ID ${id}:`, err);
      const errorMessage = err.response?.data?.message || 'Failed to update tag';
      setError(errorMessage);

      // Show error notification
      notification.error({
        message: 'Update Failed',
        description: errorMessage,
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a tag
  const deleteTag = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      await apiClient.delete(`/tag/${id}`);

      // Remove the tag from the local state
      setTags(prev => prev.filter(tag => tag.id !== id));

      return { success: true };
    } catch (err: any) {
      console.error(`Error deleting tag with ID ${id}:`, err);
      const errorMessage = err.response?.data?.message || 'Failed to delete tag';
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Load tags on component mount
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    isLoading,
    error,
    fetchTags,
    fetchTagById,
    updateTag,
    deleteTag
  };
}


export function useToggleContactStatus() {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, { tagId: string | number, hasContact: boolean }>({
    mutationFn: async ({ tagId, hasContact }) => {
      const response = await apiClient.patch(`/tag/${tagId}/contact-status`, { hasContact });
      return parseApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAG_ENDPOINT] });
    },
    onError: (error) => handleApiError(error),
  });
}

export function useCreateFormConfig() {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, { 
    tuid: string,
    tagIdNumeric: number,
    formConfig: {
      formTitle?: string,
      nameField?: string | null,
      emailField?: string | null,
      phoneField?: string | null,
      companyField?: string | null,
      messageField?: string | null,
      submitButtonText?: string,
      thankYouMessage?: string
    }
  }>({
    mutationFn: async ({ tuid, tagIdNumeric, formConfig }) => {
      console.log('Creating form config with tuid:', tuid);
      console.log('tagIdNumeric:', tagIdNumeric);
      console.log('Form config data:', formConfig);
      
      const payload = {
        tuid,
        tagIdNumeric,
        ...formConfig
      };
      
      const response = await apiClient.post('/form-config', payload);
      return parseApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/form-config'] });
    },
    onError: (error) => handleApiError(error),
  });
}