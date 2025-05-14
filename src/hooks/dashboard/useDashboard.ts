// hooks/api/useDashboard.ts
import { useList } from '../api/useApi';

// Endpoint constant
const DASHBOARD_ENDPOINT = '/dashboard';

// Types for dashboard data
export interface DashboardCounts {
  totalUsers: number;
  totalCompanies: number;
  totalTags: number;
  totalViews: number;
  totalActions: number;
  newUsersThisMonth: number;
  userGrowth: number;
  averageTagsPerUser: number;
  averageViewsPerTag: number;
  conversionRate: number;
}

export interface DashboardData {
  platformMetrics: DashboardCounts;
  // Add other dashboard data types as needed
}

export interface DashboardParams {
  startDate?: string;
  endDate?: string;
  companyId?: number;
}

// Hook for fetching platform counts and metrics
export function useDashboardCounts(params?: DashboardParams) {
  return useList<DashboardCounts>(`${DASHBOARD_ENDPOINT}/counts`, params);
}

// Hook for fetching all dashboard data
export function useDashboardData(params?: DashboardParams) {
  return useList<DashboardData>(DASHBOARD_ENDPOINT, params);
}

// Hook for fetching user growth trends
export function useUserGrowthTrends(params?: DashboardParams & { interval?: 'day' | 'week' | 'month' | 'year' }) {
  return useList<{
    periods: string[];
    userCounts: number[];
    tagCounts: number[];
  }>(`${DASHBOARD_ENDPOINT}/user-growth`, params);
}

// Hook for fetching company comparison data
export function useCompanyComparison(params?: DashboardParams) {
  return useList<{
    topCompaniesByTags: { id: number; name: string; tagCount: number }[];
    topCompaniesByViews: { id: number; name: string; viewCount: number }[];
  }>(`${DASHBOARD_ENDPOINT}/company-comparison`, params);
}

// Hook for fetching geographic insights
export function useGeoInsights(params?: DashboardParams) {
  return useList<{
    countries: { country: string; count: number }[];
    cities: { city: string; count: number }[];
  }>(`${DASHBOARD_ENDPOINT}/geo-insights`, params);
}

// Hook for fetching action breakdown data
export function useActionBreakdown(params?: DashboardParams) {
  return useList<{ action: string; count: number }[]>(`${DASHBOARD_ENDPOINT}/action-breakdown`, params);
}
