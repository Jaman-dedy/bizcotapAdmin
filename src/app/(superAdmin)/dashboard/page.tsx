"use client";

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Tabs, Button, DatePicker, Skeleton, message, Alert, Statistic, Table, Tag, Progress } from "antd";
import { DownloadOutlined, ReloadOutlined, UserOutlined, EyeOutlined, ThunderboltOutlined, RiseOutlined, TeamOutlined, AppstoreOutlined, GlobalOutlined, PieChartOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

// Import custom components 
import { InsightMetrics } from "@/components/insights/InsightMetrics";
import { ActionBreakdownCard } from "@/components/insights/ActionBreakdownCard";
import { GeoDistributionCard } from "@/components/insights/GeoDistributionCard";
import TrendVisualization from "@/components/insights/TrendVisualization";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [activeTab, setActiveTab] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/insights/admin-dashboard${selectedCompany ? `?companyId=${selectedCompany}` : ''}`);
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
  }, [selectedCompany]);

  // Handle date range change
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    message.info("Date range updated");
  };

  // Handle data refresh
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Dashboard data refreshed");
    }, 1000);
  };

  // Export dashboard data
  const handleExport = () => {
    message.info("Exporting dashboard data...");
  };

  // Sample data for development/preview
  const mockData = {
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

  // Use fetched data or mock data for development
  const data = dashboardData || mockData;

  // Setup company table columns
  const companyColumns = [
    {
      title: "Company",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <a onClick={() => setSelectedCompany(record.id)} className="!text-dark">{text}</a>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleDateString(),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      responsive: ["md" as const],
    },
    {
      title: "Users",
      dataIndex: "userCount",
      key: "userCount",
      sorter: (a: any, b: any) => a.userCount - b.userCount,
    },
    {
      title: "Cards",
      dataIndex: "tagCount",
      key: "tagCount",
      sorter: (a: any, b: any) => a.tagCount - b.tagCount,
    },
    {
      title: "Views",
      dataIndex: "totalViews",
      key: "totalViews",
      sorter: (a: any, b: any) => a.totalViews - b.totalViews,
    },
    {
      title: "Active Cards",
      key: "activeTagsPercent",
      render: (text: string, record: any) => (
        <Progress 
          percent={record.activeTagsPercent} 
          size="small" 
          status={record.activeTagsPercent > 90 ? "success" : "normal"}
        />
      ),
      sorter: (a: any, b: any) => a.activeTagsPercent - b.activeTagsPercent,
      responsive: ["lg" as const],
    },
  ];

  // Company comparison data for bar chart
  const companyChartData = data.companyComparison.topCompaniesByTags.map((company: any, index: number) => ({
    name: company.name,
    tags: company.tagCount,
    views: data.companyComparison.topCompaniesByViews.find((c: any) => c.id === company.id)?.viewCount || 0,
  }));

  return (
    <div className="p-4 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Platform Dashboard</h1>
          <p className="text-gray-500">Monitoring system-wide metrics and company performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RangePicker
            onChange={handleDateRangeChange}
            className="w-64"
          />
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
        <Row gutter={[16, 16]}>
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Total Users"
                value={data.platformMetrics.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
                suffix={
                  <span className="text-xs text-green-500 ml-2">
                    +{data.platformMetrics.userGrowth}%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Total Companies"
                value={data.platformMetrics.totalCompanies}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Total Views"
                value={data.platformMetrics.totalViews}
                prefix={<EyeOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Conversion Rate"
                value={data.platformMetrics.conversionRate}
                precision={1}
                suffix="%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>
      </Skeleton>

      {/* Main content tabs */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <AppstoreOutlined /> Platform Overview
              </span>
            } 
            key="1"
          >
            <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <TrendVisualization />
                </Col>
                
                <Col xs={24} lg={8}>
                  <GeoDistributionCard
                    countries={data.geoInsights.countries}
                    cities={data.geoInsights.cities}
                    total={data.platformMetrics.totalViews}
                  />
                </Col>
                
                <Col xs={24} md={12}>
                  <Card title="User & Tag Growth" className="shadow-sm">
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      User and tag growth chart
                      {/* In a real implementation, this would be a chart component */}
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <ActionBreakdownCard 
                    data={data.actionBreakdown} 
                    title="Global Action Types"
                  />
                </Col>
              </Row>
            </Skeleton>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <TeamOutlined /> Companies
              </span>
            } 
            key="2"
          >
            <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Card 
                    title="Company Performance" 
                   
                    className="shadow-sm"
                    extra={
                      selectedCompany ? (
                        <Button type="link" onClick={() => setSelectedCompany(null)}>
                          View All Companies
                        </Button>
                      ) : null
                    }
                  >
                    <Table 
                      dataSource={data.companiesInsights} 
                      columns={companyColumns}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                    />
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <Card title="Top Companies by Cards" className="shadow-sm">
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      Top companies bar chart
                      {/* In a real implementation, this would be a chart component */}
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <Card title="Top Companies by Views" className="shadow-sm">
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      Top companies by views chart
                      {/* In a real implementation, this would be a chart component */}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Skeleton>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <PieChartOutlined /> Tag Orders
              </span>
            } 
            key="3"
          >
            <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card title="Order Status" className="shadow-sm">
                    <div className="space-y-4">
                      {data.tagOrderMetrics.statusCounts.map((status: any) => (
                        <div key={status.status} className="flex justify-between items-center">
                          <Tag 
                            color={
                              status.status === "Approved" 
                                ? "success" 
                                : status.status === "Pending" 
                                ? "processing" 
                                : "error"
                            }
                          >
                            {status.status}
                          </Tag>
                          <span className="font-semibold">{status.count}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <p className="font-medium">Average Approval Time</p>
                      <p className="text-2xl font-bold">
                        {data.tagOrderMetrics.avgApprovalHours} hours
                      </p>
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} md={16}>
                  <Card title="Order Trends" className="shadow-sm">
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      Monthly order trends chart
                      {/* In a real implementation, this would be a chart component */}
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24}>
                  <Card title="Recent Orders" className="shadow-sm">
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      Recent orders table
                      {/* In a real implementation, this would be a table component */}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Skeleton>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <GlobalOutlined /> Geographic Insights
              </span>
            } 
            key="4"
          >
            <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title="Global Reach" className="shadow-sm">
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
                    total={data.platformMetrics.totalViews}
                  />
                </Col>
                
                <Col xs={24}>
                  <Card title="Activity Heatmap" className="shadow-sm">
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      Activity heatmap visualization
                      {/* In a real implementation, this would be a heatmap chart */}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Skeleton>
          </TabPane>
        </Tabs>
    </div>
  );
}