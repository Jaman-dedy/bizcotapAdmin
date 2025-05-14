// components/dashboard/tabs/PlatformOverviewTab.tsx
import React from 'react';
import { Row, Col, Card } from 'antd';
import TrendVisualization from "@/components/insights/TrendVisualization";
import { GeoDistributionCard } from "@/components/insights/GeoDistributionCard";
import { ActionBreakdownCard } from "@/components/insights/ActionBreakdownCard";

interface PlatformOverviewTabProps {
  data: any;
}

const PlatformOverviewTab: React.FC<PlatformOverviewTabProps> = ({ data }) => {
  return (
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
            <UserTagGrowthChart data={data.userGrowth} />
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
  );
};

// Placeholder component - in a real app, this would be a full chart implementation
const UserTagGrowthChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="text-center">
      <p>User and tag growth chart would go here</p>
      <p className="text-sm">Months: {data.months.join(', ')}</p>
      <p className="text-sm">User counts: {data.userCounts.join(', ')}</p>
      <p className="text-sm">Tag counts: {data.tagCounts.join(', ')}</p>
    </div>
  );
};

export default PlatformOverviewTab;
