"use client";

import React from "react";
import { Card, Tabs, Button, DatePicker } from "antd";
import { AppstoreOutlined, BarChartOutlined, TeamOutlined, GlobalOutlined, } from "@ant-design/icons";

import { InsightMetrics } from "@/components/insights/InsightMetrics";
import { ActivityTimeline } from "@/components/insights/ActivityTimeline";
import { TagPerformanceTable } from "@/components/insights/TagPerformanceTable";
import { GeoDistributionCard } from "@/components/insights/GeoDistributionCard";
import { TeamPerformanceCard } from "@/components/insights/TeamPerformanceCard";
import { ActionBreakdownCard } from "@/components/insights/ActionBreakdownCard";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function InsightsDashboardClient() {
  // Sample data based on the API response structure
  const mockData = {
    // Aggregate metrics
    aggregateData: {
      totalTags: 8,
      totalViews: 245,
      totalActions: 83,
      averageViewsPerTag: 30.6,
      conversionRate: 33.9,
      viewsGrowth: 12.5,
    },

    // Recent activity
    recentActivity: [
      {
        type: "view" as const,
        tagId: 123,
        tagTuid: "abc123",
        tagName: "John Smith",
        timestamp: "2025-05-05T14:32:00Z",
        location: { country: "United States", region: "California", city: "San Francisco" },
      },
      {
        type: "action" as const,
        actionType: "phone_call",
        tagId: 123,
        tagTuid: "abc123",
        tagName: "John Smith",
        timestamp: "2025-05-05T14:30:00Z",
        location: { country: "United States", region: "California", city: "San Francisco" },
      },
      {
        type: "view" as const,
        tagId: 124,
        tagTuid: "def456",
        tagName: "Jane Doe",
        timestamp: "2025-05-05T14:25:00Z",
        location: { country: "Canada", region: "Ontario", city: "Toronto" },
      },
      {
        type: "action" as const,
        actionType: "email",
        tagId: 124,
        tagTuid: "def456",
        tagName: "Jane Doe",
        timestamp: "2025-05-05T14:20:00Z",
        location: { country: "Canada", region: "Ontario", city: "Toronto" },
      },
      {
        type: "view" as const,
        tagId: 125,
        tagTuid: "ghi789",
        tagName: "Michael Johnson",
        timestamp: "2025-05-05T14:15:00Z",
        location: { country: "United Kingdom", region: "England", city: "London" },
      },
    ],

    // User's tags
    userTags: [
      {
        id: 123,
        tuid: "abc123",
        name: "John Smith",
        views: 86,
        actions: 34,
        createdAt: "2025-03-15T08:30:00Z",
      },
      {
        id: 124,
        tuid: "def456",
        name: "Jane Doe",
        views: 64,
        actions: 21,
        createdAt: "2025-03-18T10:15:00Z",
      },
      {
        id: 125,
        tuid: "ghi789",
        name: "Michael Johnson",
        views: 52,
        actions: 17,
        createdAt: "2025-03-20T14:45:00Z",
      },
      {
        id: 126,
        tuid: "jkl012",
        name: "Sarah Williams",
        views: 43,
        actions: 11,
        createdAt: "2025-03-25T09:20:00Z",
      },
    ],

    // Geographic insights
    geoInsights: {
      countries: [
        { country: "United States", count: 112 },
        { country: "Canada", count: 56 },
        { country: "United Kingdom", count: 38 },
        { country: "Australia", count: 22 },
        { country: "Germany", count: 17 },
      ],
      cities: [
        { city: "San Francisco", count: 45 },
        { city: "New York", count: 32 },
        { city: "Toronto", count: 28 },
        { city: "London", count: 25 },
        { city: "Sydney", count: 18 },
        { city: "Berlin", count: 12 },
      ],
    },

    // Action breakdown
    actionBreakdown: [
      { action: "phone_call", count: 26 },
      { action: "email", count: 22 },
      { action: "website_visit", count: 18 },
      { action: "download_vcf", count: 12 },
      { action: "linkedin", count: 5 },
    ],

    // Team performance data (only for company admin view)
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
  };

  return (
    <div className="p-4 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Insights Dashboard</h1>
          <p className="text-gray-500">Monitor your digital business card performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RangePicker className="w-64" />
          <Button type="primary">Export Report</Button>
        </div>
      </div>

      {/* Key metrics */}
      <InsightMetrics
        totalViews={mockData.aggregateData.totalViews}
        totalActions={mockData.aggregateData.totalActions}
        conversionRate={mockData.aggregateData.conversionRate}
        totalTags={mockData.aggregateData.totalTags}
        viewsGrowth={mockData.aggregateData.viewsGrowth}
      />

      {/* Main content tabs */}
      <Card bordered={false} className="shadow-sm">
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <AppstoreOutlined /> Overview
              </span>
            }
            key="1"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                <TagPerformanceTable tags={mockData.userTags} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ActionBreakdownCard 
                    data={mockData.actionBreakdown} 
                    title="Action Types"
                  />
                  
                  <GeoDistributionCard
                    countries={mockData.geoInsights.countries}
                    cities={mockData.geoInsights.cities}
                    total={mockData.aggregateData.totalViews}
                  />
                </div>
              </div>
              
              {/* Right column */}
              <div>
                <ActivityTimeline activities={mockData.recentActivity} />
              </div>
            </div>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <BarChartOutlined /> Analytics
              </span>
            }
            key="2"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Traffic by Source" bordered={false} className="shadow-sm">
                  {/* Traffic source content would go here */}
                  <div className="text-center py-12 text-gray-500">
                    Traffic source visualization
                  </div>
                </Card>
                <Card title="Monthly Trends" bordered={false} className="shadow-sm">
                  {/* Monthly trends visualization would go here */}
                  <div className="text-center py-12 text-gray-500">
                    Monthly trends chart
                  </div>
                </Card>
              </div>
              
              <Card title="Card Performance Comparison" bordered={false} className="shadow-sm">
                {/* Card comparison visualization would go here */}
                <div className="text-center py-12 text-gray-500">
                  Card performance comparison chart
                </div>
              </Card>
            </div>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <TeamOutlined /> Team Performance
              </span>
            }
            key="3"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TeamPerformanceCard members={mockData.teamPerformance} />
              
              <Card title="Activity Distribution" bordered={false} className="shadow-sm">
                {/* Team activity distribution content would go here */}
                <div className="text-center py-12 text-gray-500">
                  Team activity visualization
                </div>
              </Card>
              
              <Card title="Conversion Rate by Team Member" bordered={false} className="shadow-sm">
                {/* Conversion rate visualization would go here */}
                <div className="text-center py-12 text-gray-500">
                  Conversion rate chart
                </div>
              </Card>
              
              <Card title="Tags by Team Member" bordered={false} className="shadow-sm">
                {/* Tag distribution by team visualization would go here */}
                <div className="text-center py-12 text-gray-500">
                  Tag distribution chart
                </div>
              </Card>
            </div>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <GlobalOutlined /> Geographic Insights
              </span>
            }
            key="4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-2">
                <Card title="Global Reach" bordered={false} className="shadow-sm">
                  {/* World map visualization would go here */}
                  <div className="text-center py-12 text-gray-500">
                    World map visualization
                  </div>
                </Card>
              </div>
              
              <div>
                <GeoDistributionCard
                  countries={mockData.geoInsights.countries}
                  cities={mockData.geoInsights.cities}
                  total={mockData.aggregateData.totalViews}
                />
              </div>
              
              <Card title="Regional Performance" bordered={false} className="shadow-sm lg:col-span-3">
                {/* Regional performance visualization would go here */}
                <div className="text-center py-12 text-gray-500">
                  Regional performance charts
                </div>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
