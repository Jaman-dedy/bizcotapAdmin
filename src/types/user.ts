// types/user.ts

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'INDIVIDUAL' | 'COMPANY_ADMIN' | 'COMPANY_MEMBER';

// export interface User {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone?: string;
//   role: UserRole;
//   companyId?: number | null;
//   avatar?: string | null;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  companyId?: number;
  isActive?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  companyId?: number | null;
  isActive?: boolean;
}

export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
  search?: string;
  role?: UserRole | UserRole[];
  companyId?: number;
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  googleId?: string | null;
  appleId?: string | null;
  linkedinId?: string | null;
  dataConsentVersion?: string | null;
  dataConsentDate?: string | null;
  marketingConsent?: boolean;
  marketingConsentDate?: string | null;
  lastPrivacyNoticeView?: string | null;
  dataRetentionDate?: string | null;
  passwordLastChanged?: string | null;
  failedLoginAttempts?: number;
  lastFailedLogin?: string | null;
  accountLocked?: boolean;
  accountLockedUntil?: string | null;
  mfaEnabled?: boolean;
  mfaSecret?: string | null;
  companyId?: number | null;
  company?: any | null;
}
