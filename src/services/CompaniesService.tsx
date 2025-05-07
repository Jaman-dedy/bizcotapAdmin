// services/companiesService.tsx

// Define the interfaces for Company and related data
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
    avatar?: string | null;
    companyId?: number | null;
  }
  
  export interface Company {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    logo: string | null;
    website: string | null;
    industry: string | null;
    dataProcessingAgreement?: boolean;
    dataProcessingDate?: string | null;
    ownerId: number;
    owner?: User;
    employees?: User[];
  }
  
  export interface CreateCompanyDto {
    name: string;
    logo?: string | null;
    website?: string | null;
    industry?: string | null;
    ownerId: number;
  }
  
  export interface UpdateCompanyDto {
    name?: string;
    logo?: string | null;
    website?: string | null;
    industry?: string | null;
    ownerId?: number;
    dataProcessingAgreement?: boolean;
    dataProcessingDate?: string | null;
  }
  
  export interface AddEmployeeDto {
    userIds: number[];
  }
  
  export interface CompanyQueryParams {
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    search?: string;
    industry?: string | string[];
    hasWebsite?: boolean;
    employeeCount?: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  // Helper function to get JWT auth token
  const getAuthHeaders = (contentType = 'application/json') => {
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
    
    return {
      'Content-Type': contentType,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  };
  
  // Helper function to build query string
  const buildQueryString = (params: CompanyQueryParams): string => {
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
  
  export const companiesService = {
    /**
     * Fetch all companies from the API with pagination and filters
     */
    async getAllCompanies(params: CompanyQueryParams = {}): Promise<PaginatedResponse<Company>> {
      try {
        const queryString = buildQueryString(params);
        const url = `${API_BASE_URL}/companies${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
          }
          console.log(`API error: ${response.status}`);
          return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
        }
        
        const result = await response.json();
        
        // Handle both paginated and non-paginated responses
        if (Array.isArray(result)) {
          return {
            data: result,
            total: result.length,
            page: params.page || 1,
            pageSize: params.pageSize || result.length,
            totalPages: 1
          };
        }
        
        return result;
      } catch (error) {
        console.log('Error fetching companies:', error);
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
    },
  
    /**
     * Get a single company by ID
     */
    async getCompanyById(id: number): Promise<Company | null> {
      try {
        const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return null;
          }
          console.log(`API error: ${response.status}`);
          return null;
        }
        
        return await response.json();
      } catch (error) {
        console.log(`Error fetching company with ID ${id}:`, error);
        return null;
      }
    },
  
    /**
     * Create a new company with FormData support for file uploads
     */
    async createCompany(companyData: CreateCompanyDto | FormData): Promise<Company | null> {
      try {
        // Determine if we're using FormData
        const isFormData = companyData instanceof FormData;
        
        const response = await fetch(`${API_BASE_URL}/companies`, {
          method: 'POST',
          headers: getAuthHeaders(isFormData ? undefined : 'application/json'),
          body: isFormData ? companyData : JSON.stringify(companyData),
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return null;
          }
          console.log(`API error: ${response.status}`);
          return null;
        }
        
        return await response.json();
      } catch (error) {
        console.log('Error creating company:', error);
        return null;
      }
    },
  
    /**
     * Update an existing company with FormData support
     */
    async updateCompany(id: number, companyData: UpdateCompanyDto | FormData): Promise<Company | null> {
      try {
        // Determine if we're using FormData
        const isFormData = companyData instanceof FormData;
        
        const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(isFormData ? undefined : 'application/json'),
          body: isFormData ? companyData : JSON.stringify(companyData),
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return null;
          }
          console.log(`API error: ${response.status}`);
          return null;
        }
        
        return await response.json();
      } catch (error) {
        console.log(`Error updating company with ID ${id}:`, error);
        return null;
      }
    },
  
    /**
     * Delete a company
     */
    async deleteCompany(id: number): Promise<boolean> {
      try {
        const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return false;
          }
          console.log(`API error: ${response.status}`);
          return false;
        }
        
        return true;
      } catch (error) {
        console.log(`Error deleting company with ID ${id}:`, error);
        return false;
      }
    },
  
    /**
     * Add employees to a company
     */
    async addEmployees(companyId: number, addEmployeeDto: AddEmployeeDto): Promise<Company | null> {
      try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/employees`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(addEmployeeDto),
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return null;
          }
          console.log(`API error: ${response.status}`);
          return null;
        }
        
        return await response.json();
      } catch (error) {
        console.log(`Error adding employees to company ${companyId}:`, error);
        return null;
      }
    },
  
    /**
     * Remove an employee from a company
     */
    async removeEmployee(companyId: number, userId: number): Promise<boolean> {
      try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}/employees/${userId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return false;
          }
          console.log(`API error: ${response.status}`);
          return false;
        }
        
        return true;
      } catch (error) {
        console.log(`Error removing employee ${userId} from company ${companyId}:`, error);
        return false;
      }
    },
  
    /**
     * Search companies by name or industry
     */
    async searchCompanies(query: string): Promise<Company[]> {
      try {
        const response = await fetch(`${API_BASE_URL}/companies/search?q=${encodeURIComponent(query)}`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return [];
          }
          console.log(`API error: ${response.status}`);
          return [];
        }
        
        return await response.json();
      } catch (error) {
        console.log('Error searching companies:', error);
        return [];
      }
    },
  
    /**
     * Get available users for adding to company
     */
    async getAvailableUsers(): Promise<User[]> {
      try {
        const response = await fetch(`${API_BASE_URL}/users?filter=available`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return [];
          }
          console.log(`API error: ${response.status}`);
          return [];
        }
        
        return await response.json();
      } catch (error) {
        console.log('Error fetching available users:', error);
        return [];
      }
    },
    
    /**
     * Get list of available industries
     */
    async getIndustries(): Promise<string[]> {
      try {
        const response = await fetch(`${API_BASE_URL}/companies/industries`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return [];
          }
          console.log(`API error: ${response.status}`);
          return [];
        }
        
        return await response.json();
      } catch (error) {
        console.log('Error fetching industries:', error);
        return [];
      }
    },
    
    /**
     * Batch delete companies (for bulk operations)
     */
    async batchDeleteCompanies(ids: number[]): Promise<{ success: boolean, failedIds: number[] }> {
      try {
        const response = await fetch(`${API_BASE_URL}/companies/batch`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          body: JSON.stringify({ ids }),
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed. Token may be invalid or expired.');
            return { success: false, failedIds: ids };
          }
          console.log(`API error: ${response.status}`);
          return { success: false, failedIds: ids };
        }
        
        return await response.json();
      } catch (error) {
        console.log('Error batch deleting companies:', error);
        return { success: false, failedIds: ids };
      }
    },
    
    /**
     * Setup WebSocket connection for real-time updates
     */
    setupWebSocket(onMessage: (data: any) => void): WebSocket | null {
      try {
        if (typeof window === 'undefined') return null;
        
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/companies`;
        
        const socket = new WebSocket(wsUrl);
        
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMessage(data);
          } catch (error) {
            console.log('Error parsing WebSocket message:', error);
          }
        };
        
        socket.onerror = (error) => {
          console.log('WebSocket error:', error);
        };
        
        return socket;
      } catch (error) {
        console.log('Error setting up WebSocket:', error);
        return null;
      }
    }
  };
  
  export default companiesService;