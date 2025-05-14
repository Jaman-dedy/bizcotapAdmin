// types/company.ts

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
