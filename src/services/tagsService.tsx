// services/tagsService.ts

// Define the interfaces for the API response
export interface Email {
    type: string;
    value: string;
  }
  
  export interface Phone {
    type: string;
    value: string;
  }
  
  export interface Website {
    type: string;
    value: string;
  }
  
  export interface Address {
    type: string;
    value: string;
  }
  
  export interface TagInfo {
    dob: string | null;
    mine?: number;
    fname: string;
    lname: string;
    notes: string | null;
    title: string | null;
    avatar: string | null;
    emails: Email[];
    phones: Phone[];
    company: string | null;
    position: string | null;
    websites: Website[];
    addresses: Address[];
  }
  
  export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  }
  
  export interface Tag {
    id: number;
    tuid: string;
    tagInfo: TagInfo;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    privacyPolicyAccepted: boolean;
    privacyPolicyVersion: string | null;
    privacyAcceptedDate: string | null;
    userId: number;
    companyId: number | null;
    tagOrderId: number | null;
    user: User;
    company: any | null;
  }
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  // Helper function to get JWT auth token
  const getAuthHeaders = () => {
    // Try multiple potential token storage locations
    let token = null;
    
    if (typeof window !== 'undefined') {
      // Try common token storage methods
      token = localStorage.getItem('jwt') || 
              localStorage.getItem('token') || 
              localStorage.getItem('authToken') ||
              sessionStorage.getItem('jwt') ||
              sessionStorage.getItem('token') ||
              document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
  
    }
    
    // You can also set a default token for development/testing
    if (process.env.NODE_ENV === 'development' && !token) {
      // Uncomment and set this if you have a development token
      // token = 'your-development-token';
    }
    
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  };
  
  const logAuthStatus = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token') || localStorage.getItem('authToken');
      console.log('Auth token exists:', !!token);
      if (token) {
        console.log('Token starts with:', token.substring(0, 10) + '...');
      }
    }
  };
  
  export const tagsService = {
    async getAllTags(): Promise<Tag[]> {
      try {
        logAuthStatus();
        
        const response = await fetch(`${API_BASE_URL}/tag`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication failed. Token may be invalid or expired.');
            return []; 
          }
          console.error(`API error: ${response.status}`);
          return []; 
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching tags:', error);
        return []; 
      }
    },

    async getAllMyTags(): Promise<Tag[]> {
      try {
        logAuthStatus();
        
        const response = await fetch(`${API_BASE_URL}/tag/my-tags`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication failed. Token may be invalid or expired.');
            return []; 
          }
          console.error(`API error: ${response.status}`);
          return []; 
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching tags:', error);
        return []; 
      }
    },

    async getCompanyContacts(companyId: number): Promise<Tag[]> {
      try {
        logAuthStatus();
        
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/contacts`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication failed. Token may be invalid or expired.');
            return []; 
          }
          console.error(`API error: ${response.status}`);
          return []; 
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching tags:', error);
        return []; 
      }
    },
  

    async getTagById(id: number): Promise<Tag | null> {
      try {
        const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication failed. Token may be invalid or expired.');
            return null;
          }
          console.error(`API error: ${response.status}`);
          return null;
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error fetching tag with ID ${id}:`, error);
        return null;
      }
    },
  

    async createTag(tagData: Partial<Tag>): Promise<Tag | null> {
      try {
        const response = await fetch(`${API_BASE_URL}/tags`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(tagData),
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication failed. Token may be invalid or expired.');
            return null;
          }
          console.error(`API error: ${response.status}`);
          return null;
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error creating tag:', error);
        return null;
      }
    },
  
    async updateTag(id: number, tagData: Partial<Tag>): Promise<Tag | null> {
      try {
        const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(tagData),
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication failed. Token may be invalid or expired.');
            return null;
          }
          console.error(`API error: ${response.status}`);
          return null;
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error updating tag with ID ${id}:`, error);
        return null;
      }
    },

    async deleteTag(id: number): Promise<boolean> {
      try {
        const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication failed. Token may be invalid or expired.');
            return false;
          }
          console.error(`API error: ${response.status}`);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error(`Error deleting tag with ID ${id}:`, error);
        return false;
      }
    },
    

    async searchTags(query: string): Promise<Tag[]> {
      try {
        const response = await fetch(`${API_BASE_URL}/tags/search?q=${encodeURIComponent(query)}`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication failed. Token may be invalid or expired.');
            return [];
          }
          console.error(`API error: ${response.status}`);
          return [];
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error searching tags:', error);
        return [];
      }
    }
  };
  
  export default tagsService;