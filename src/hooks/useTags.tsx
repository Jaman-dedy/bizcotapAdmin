import { useState, useEffect, useCallback } from 'react';
import tagsService, { Tag } from '@/services/tagsService';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [myTags, setMyTags] = useState<Tag[]>([]);
  const [companyContacts, setCompanyContacts] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tagsService.getAllTags();
      setTags(data);
      return { success: true };
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to load contacts. Please try again later.');
      return { success: false, error: 'Failed to load contacts. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMyTags = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tagsService.getAllMyTags();
      setMyTags(data);
      return { success: true };
    } catch (err) {
      console.error('Error fetching my tags:', err);
      setError('Failed to load contacts. Please try again later.');
      return { success: false, error: 'Failed to load contacts. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCompanyContacts = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tagsService.getCompanyContacts(id);
      setCompanyContacts(data);
      return { success: true };
    } catch (err) {
      console.error('Error fetching my tags:', err);
      setError('Failed to load contacts. Please try again later.');
      return { success: false, error: 'Failed to load contacts. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    fetchMyTags();
  }, [fetchMyTags]);

  useEffect(() => {
    fetchCompanyContacts(1);
  }, [fetchCompanyContacts]);

  const deleteTag = useCallback(async (id: number) => {
    try {
      await tagsService.deleteTag(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting tag:', err);
      return { success: false, error: 'Failed to delete contact' };
    }
  }, []);

  const searchTags = useCallback((searchText: string) => {
    if (!searchText.trim()) return tags;
    
    const searchLower = searchText.toLowerCase();
    return tags.filter(tag => {
      const fname = tag.tagInfo.fname?.toLowerCase() || '';
      const lname = tag.tagInfo.lname?.toLowerCase() || '';
      const emails = tag.tagInfo.emails?.map(e => e.value.toLowerCase()) || [];
      const company = tag.tagInfo.company?.toLowerCase() || '';
      
      return fname.includes(searchLower) || 
             lname.includes(searchLower) || 
             emails.some(email => email.includes(searchLower)) ||
             company.includes(searchLower);
    });
  }, [tags]);

  return {
    tags,
    myTags,
    companyContacts,
    isLoading,
    error,
    fetchTags,
    fetchMyTags,
    deleteTag,
    fetchCompanyContacts,
    searchTags
  };
};

export default useTags;