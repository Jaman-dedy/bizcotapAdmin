// hooks/dashboard/useDashboardData.ts (Updated with API Hooks)
import { useState, useEffect } from 'react';
import { mockDashboardData } from './mockData';
import {
  useDashboardCounts,
  useDashboardData as useApiDashboardData,
  useUserGrowthTrends,
  useCompanyComparison,
  useGeoInsights,
  useActionBreakdown,
  DashboardParams
} from './useDashboard';

interface UseDashboardDataProps {
  data: any;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchDashboardData = (selectedCompany: number | null): UseDashboardDataProps => {
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  // Create params object for API calls
  const params: DashboardParams = {
    startDate,
    endDate,
    companyId: selectedCompany || undefined
  };

  // Use React Query hooks for API data fetching
  const {
    data: countsData,
    isLoading: isLoadingCounts,
    refetch: refetchCounts,
    error: countsError
  } = useDashboardCounts(params);

  const {
    data: userGrowthData,
    isLoading: isLoadingUserGrowth,
    error: userGrowthError
  } = useUserGrowthTrends(params);

  const {
    data: companyComparisonData,
    isLoading: isLoadingCompanyComparison,
    error: companyComparisonError
  } = useCompanyComparison(params);

  const {
    data: geoInsightsData,
    isLoading: isLoadingGeoInsights,
    error: geoInsightsError
  } = useGeoInsights(params);

  const {
    data: actionBreakdownData,
    isLoading: isLoadingActionBreakdown,
    error: actionBreakdownError
  } = useActionBreakdown(params);

  // Combine all loading states
  const isLoading =
    isLoadingCounts ||
    isLoadingUserGrowth ||
    isLoadingCompanyComparison ||
    isLoadingGeoInsights ||
    isLoadingActionBreakdown;

  // Combine all API data or use mock data for development
  const combinedData = {
    platformMetrics: countsData || mockDashboardData.platformMetrics,
    userGrowth: userGrowthData ? {
      months: userGrowthData.periods,
      userCounts: userGrowthData.userCounts,
      tagCounts: userGrowthData.tagCounts
    } : mockDashboardData.userGrowth,
    companyComparison: companyComparisonData || mockDashboardData.companyComparison,
    geoInsights: geoInsightsData || mockDashboardData.geoInsights,
    actionBreakdown: actionBreakdownData || mockDashboardData.actionBreakdown,
    // Keep other mock data for now
    tagOrderMetrics: mockDashboardData.tagOrderMetrics,
    globalHeatmap: mockDashboardData.globalHeatmap,
    companiesInsights: mockDashboardData.companiesInsights
  };

  // Combine all error messages
  useEffect(() => {
    const errors = [
      countsError,
      userGrowthError,
      companyComparisonError,
      geoInsightsError,
      actionBreakdownError
    ].filter(Boolean);

    if (errors.length > 0) {
      console.log("Error loading some dashboard data. Please try again.");
    } else {
      console.log("Dashboard data loaded successfully.");
    }
  }, [
    countsError,
    userGrowthError,
    companyComparisonError,
    geoInsightsError,
    actionBreakdownError
  ]);

  // Refetch all data
  const refetchAll = () => {
    refetchCounts();
    // Add other refetch functions as needed when implemented
  };

  return {
    data: combinedData,
    isLoading,
    error,
    refetch: refetchAll
  };
};
