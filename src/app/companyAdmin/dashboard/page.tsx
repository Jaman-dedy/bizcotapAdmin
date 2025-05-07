"use client";

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Tabs, Button, DatePicker, Skeleton, message, Alert } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

// Import custom components
import { InsightMetrics } from "@/components/insights/InsightMetrics";
import { ActivityTimeline } from "@/components/insights/ActivityTimeline";
import { TagPerformanceTable } from "@/components/insights/TagPerformanceTable";
import { GeoDistributionCard } from "@/components/insights/GeoDistributionCard";
import { TeamPerformanceCard } from "@/components/insights/TeamPerformanceCard";
import { ActionBreakdownCard } from "@/components/insights/ActionBreakdownCard";
import TrendVisualization from "@/components/insights/TrendVisualization";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Define the activity type to match ActivityTimeline component
interface Activity {
  type: "view" | "action";
  actionType?: string;
  tagId?: number;
  tagTuid?: string;
  tagName: string;
  timestamp: string;
  location: {
    country: string;
    region: string;
    city: string;
  } | null;
}

export default function CompanyAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [activeTab, setActiveTab] = useState("1");
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/insights/company-dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle date range change
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    // Here you would typically make an API call with the new date range
    message.info("Date range updated");
  };

  // Handle data refresh
  const handleRefresh = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
      message.success("Dashboard data refreshed");
    }, 1000);
  };

  // Export dashboard data
  const handleExport = () => {
    message.info("Exporting dashboard data...");
    // Here you would implement your export logic
  };

  // Sample data for development/preview
  const mockData = {
    companyMetrics: {
      totalTags: 48,
      totalViews: 1256,
      totalActions: 432,
      averageViewsPerTag: 26.2,
      conversionRate: 34.4,
      viewsThisMonth: 342,
      viewsGrowth: 12.5,
    },
    
    teamPerformance: [
      {
        id: 1,
        name: "John Smith",
        tagCount: 3,
        totalViews: 186,
        totalActions: 64,
        conversionRate: 34.4,
      },
      {
        id: 2,
        name: "Jane Doe",
        tagCount: 4,
        totalViews: 254,
        totalActions: 87,
        conversionRate: 34.3,
      },
      {
        id: 3,
        name: "Michael Johnson",
        tagCount: 2,
        totalViews: 132,
        totalActions: 48,
        conversionRate: 36.4,
      },
      {
        id: 4,
        name: "Sarah Williams",
        tagCount: 3,
        totalViews: 198,
        totalActions: 67,
        conversionRate: 33.8,
      },
    ],
    
    trendingTags: [
      {
        id: 101,
        tuid: "abc123",
        name: "John Smith",
        ownerName: "John Smith",
        recentViews: 42,
      },
      {
        id: 102,
        tuid: "def456",
        name: "Jane Doe",
        ownerName: "Jane Doe",
        recentViews: 36,
      },
      {
        id: 103,
        tuid: "ghi789",
        name: "Michael Johnson",
        ownerName: "Michael Johnson",
        recentViews: 28,
      },
    ],
    
    geoInsights: {
      countries: [
        { country: "United States", count: 523 },
        { country: "Canada", count: 198 },
        { country: "United Kingdom", count: 156 },
        { country: "Australia", count: 98 },
        { country: "Germany", count: 76 },
      ],
      regions: [
        { region: "California", count: 212 },
        { region: "New York", count: 145 },
        { region: "Ontario", count: 132 },
        { region: "Texas", count: 98 },
        { region: "England", count: 87 },
      ],
      cities: [
        { city: "San Francisco", count: 132 },
        { city: "New York", count: 108 },
        { city: "Toronto", count: 94 },
        { city: "London", count: 87 },
        { city: "Austin", count: 65 },
      ],
    },
    
    monthlyTrends: {
      months: ["2024-12", "2025-01", "2025-02", "2025-03", "2025-04", "2025-05"],
      viewCounts: [245, 268, 312, 356, 398, 342],
      actionCounts: [89, 104, 125, 142, 153, 132],
    },
    
    // Updated activity data to match the Activity interface
    recentActivity: [
      {
        type: "view" as "view",
        tagId: 123,
        tagTuid: "abc123",
        tagName: "John Smith",
        timestamp: "2025-05-05T14:32:00Z",
        location: { country: "United States", region: "California", city: "San Francisco" },
      },
      {
        type: "action" as "action",
        actionType: "phone_call",
        tagId: 123,
        tagTuid: "abc123",
        tagName: "John Smith",
        timestamp: "2025-05-05T14:30:00Z",
        location: { country: "United States", region: "California", city: "San Francisco" },
      },
      {
        type: "view" as "view",
        tagId: 124,
        tagTuid: "def456",
        tagName: "Jane Doe",
        timestamp: "2025-05-05T14:25:00Z",
        location: { country: "Canada", region: "Ontario", city: "Toronto" },
      },
      {
        type: "action" as "action",
        actionType: "email",
        tagId: 124,
        tagTuid: "def456",
        tagName: "Jane Doe",
        timestamp: "2025-05-05T14:20:00Z",
        location: { country: "Canada", region: "Ontario", city: "Toronto" },
      },
    ],
    
    actionBreakdown: [
      { action: "phone_call", count: 156 },
      { action: "email", count: 123 },
      { action: "website_visit", count: 98 },
      { action: "download_vcf", count: 55 },
    ],
  };

  // Use fetched data or mock data for development
  const data = dashboardData || mockData;

  return (
    <div className="p-4 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Company Insights Dashboard</h1>
          <p className="text-gray-500">Monitor your team's digital business card performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RangePicker className="w-64" onChange={handleDateRangeChange} />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Error message if any */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-6"
        />
      )}

      {/* Key metrics */}
      <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
        <InsightMetrics
          totalViews={data.companyMetrics.totalViews}
          totalActions={data.companyMetrics.totalActions}
          conversionRate={data.companyMetrics.conversionRate}
          totalTags={data.companyMetrics.totalTags}
          viewsGrowth={data.companyMetrics.viewsGrowth}
        />
      </Skeleton>

      {/* Main content tabs */}
      <Card variant="outlined" className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Overview" key="1">
            <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <TrendVisualization />
                </Col>
                <Col xs={24} lg={8}>
                  <GeoDistributionCard
                    countries={data.geoInsights.countries}
                    cities={data.geoInsights.cities}
                    total={data.companyMetrics.totalViews}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <TagPerformanceTable 
                    tags={data.trendingTags.map((tag: any) => ({
                      id: tag.id,
                      tuid: tag.tuid,
                      name: tag.name,
                      views: tag.recentViews,
                      actions: Math.round(tag.recentViews * (data.companyMetrics.conversionRate / 100)),
                      createdAt: new Date().toISOString() // Sample date
                    }))} 
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <TeamPerformanceCard members={data.teamPerformance} />
                </Col>
              </Row>
            </Skeleton>
          </TabPane>
          
          <TabPane tab="Team Analytics" key="2">
            <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <TeamPerformanceCard members={data.teamPerformance} />
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Team Member Comparison" variant="outlined" className="shadow-sm">
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      Team performance comparison chart
                      {/* In a real implementation, you would add a chart here */}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <ActionBreakdownCard 
                    data={data.actionBreakdown} 
                    title="Team Action Types"
                  />
                </Col>
              </Row>
            </Skeleton>
          </TabPane>
          
          <TabPane tab="Geographic Insights" key="3">
            <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title="Global Reach" variant="outlined" className="shadow-sm">
                    <div className="h-96 flex items-center justify-center text-gray-400">
                      World map visualization
                      {/* In a real implementation, you would add a map component here */}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <GeoDistributionCard
                    countries={data.geoInsights.countries}
                    cities={data.geoInsights.cities}
                    total={data.companyMetrics.totalViews}
                  />
                </Col>
                <Col xs={24}>
                  <Card title="Regional Performance" variant="outlined" className="shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {data.geoInsights.regions.slice(0, 6).map((region: any, index: number) => (
                        <Card key={index} size="small" variant="outlined">
                          <div className="text-lg font-medium">{region.region}</div>
                          <div className="text-2xl font-bold mt-2">{region.count}</div>
                          <div className="text-sm text-gray-500">
                            views ({((region.count / data.companyMetrics.totalViews) * 100).toFixed(1)}%)
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Skeleton>
          </TabPane>
          
          <TabPane tab="Activity Log" key="4">
            <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Card title="Recent Activity" variant="outlined" className="shadow-sm">
                    <ActivityTimeline 
                      activities={data.recentActivity as Activity[]} 
                    />
                  </Card>
                </Col>
              </Row>
            </Skeleton>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}