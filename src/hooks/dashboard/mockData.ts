// hooks/dashboard/mockData.ts

export const mockDashboardData = {
  platformMetrics: {
    totalUsers: 354,
    totalCompanies: 28,
    totalTags: 1256,
    totalViews: 45892,
    totalActions: 15735,
    newUsersThisMonth: 42,
    userGrowth: 18.5,
    averageTagsPerUser: 3.6,
    averageViewsPerTag: 36.5,
    conversionRate: 34.3,
  },

  userGrowth: {
    months: ["2024-12", "2025-01", "2025-02", "2025-03", "2025-04", "2025-05"],
    userCounts: [24, 32, 38, 35, 45, 42],
    tagCounts: [85, 112, 136, 149, 168, 156],
  },

  companyComparison: {
    topCompaniesByTags: [
      { id: 1, name: "Acme Corporation", tagCount: 156 },
      { id: 2, name: "Globex Industries", tagCount: 128 },
      { id: 3, name: "Stark Enterprises", tagCount: 112 },
      { id: 4, name: "Wayne Enterprises", tagCount: 98 },
      { id: 5, name: "Umbrella Corp", tagCount: 86 },
    ],
    topCompaniesByViews: [
      { id: 2, name: "Globex Industries", viewCount: 6532 },
      { id: 1, name: "Acme Corporation", viewCount: 5821 },
      { id: 3, name: "Stark Enterprises", viewCount: 4935 },
      { id: 5, name: "Umbrella Corp", viewCount: 3876 },
      { id: 4, name: "Wayne Enterprises", viewCount: 3654 },
    ],
  },

  tagOrderMetrics: {
    statusCounts: [
      { status: "Pending", count: 24 },
      { status: "Approved", count: 186 },
      { status: "Rejected", count: 8 },
    ],
    monthlyTrends: {
      months: ["2024-12", "2025-01", "2025-02", "2025-03", "2025-04", "2025-05"],
      orderCounts: [32, 38, 45, 52, 61, 56],
    },
    avgApprovalHours: 16.4,
  },

  globalHeatmap: [
    { day: "Monday", hour: 9, count: 245 },
    { day: "Monday", hour: 10, count: 312 },
    { day: "Monday", hour: 11, count: 368 },
    { day: "Monday", hour: 12, count: 286 },
    { day: "Tuesday", hour: 9, count: 256 },
    { day: "Tuesday", hour: 10, count: 321 },
    { day: "Tuesday", hour: 11, count: 387 },
    { day: "Tuesday", hour: 12, count: 302 },
    { day: "Wednesday", hour: 9, count: 278 },
    { day: "Wednesday", hour: 10, count: 342 },
    { day: "Wednesday", hour: 11, count: 398 },
    { day: "Wednesday", hour: 12, count: 310 },
    { day: "Thursday", hour: 9, count: 265 },
    { day: "Thursday", hour: 10, count: 352 },
    { day: "Thursday", hour: 11, count: 378 },
    { day: "Thursday", hour: 12, count: 298 },
    { day: "Friday", hour: 9, count: 232 },
    { day: "Friday", hour: 10, count: 298 },
    { day: "Friday", hour: 11, count: 332 },
    { day: "Friday", hour: 12, count: 267 },
  ],

  geoInsights: {
    countries: [
      { country: "United States", count: 18452 },
      { country: "United Kingdom", count: 6532 },
      { country: "Canada", count: 5123 },
      { country: "Australia", count: 3865 },
      { country: "Germany", count: 2954 },
    ],
    cities: [
      { city: "New York", count: 4532 },
      { city: "London", count: 3876 },
      { city: "Toronto", count: 2543 },
      { city: "Sydney", count: 2187 },
      { city: "Berlin", count: 1854 },
    ],
  },

  companiesInsights: [
    {
      id: 1,
      name: "Acme Corporation",
      createdAt: "2024-01-15T08:30:00Z",
      userCount: 42,
      tagCount: 156,
      totalViews: 5821,
      totalActions: 2143,
      activeTagsPercent: 92.3,
    },
    {
      id: 2,
      name: "Globex Industries",
      createdAt: "2024-02-05T10:15:00Z",
      userCount: 38,
      tagCount: 128,
      totalViews: 6532,
      totalActions: 2456,
      activeTagsPercent: 96.1,
    },
    {
      id: 3,
      name: "Stark Enterprises",
      createdAt: "2024-02-12T14:20:00Z",
      userCount: 35,
      tagCount: 112,
      totalViews: 4935,
      totalActions: 1876,
      activeTagsPercent: 88.4,
    },
    {
      id: 4,
      name: "Wayne Enterprises",
      createdAt: "2024-03-22T09:45:00Z",
      userCount: 28,
      tagCount: 98,
      totalViews: 3654,
      totalActions: 1342,
      activeTagsPercent: 85.7,
    },
    {
      id: 5,
      name: "Umbrella Corp",
      createdAt: "2024-03-30T11:10:00Z",
      userCount: 26,
      tagCount: 86,
      totalViews: 3876,
      totalActions: 1454,
      activeTagsPercent: 91.9,
    },
  ],

  actionBreakdown: [
    { action: "phone_call", count: 5862 },
    { action: "email", count: 4321 },
    { action: "website_visit", count: 3254 },
    { action: "download_vcf", count: 1843 },
    { action: "social_link", count: 455 },
  ],
};
