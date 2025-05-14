// components/dashboard/tabs/GeographicInsightsTab.tsx
import React from 'react';
import { Row, Col, Card } from 'antd';
import { GeoDistributionCard } from "@/components/insights/GeoDistributionCard";

interface GeographicInsightsTabProps {
  data: any;
}

const GeographicInsightsTab: React.FC<GeographicInsightsTabProps> = ({ data }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card title="Global Reach" className="shadow-sm">
          <WorldMapVisualization />
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
          <ActivityHeatmapVisualization data={data.globalHeatmap} />
        </Card>
      </Col>
    </Row>
  );
};

// Placeholder component - in a real app, this would be a full map implementation
const WorldMapVisualization: React.FC = () => {
  return (
    <div className="h-96 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <p>World map visualization would go here</p>
        <p className="text-sm">This would show a world map with markers or heat overlays indicating activity across regions</p>
      </div>
    </div>
  );
};

// Placeholder component - in a real app, this would be a heatmap chart
const ActivityHeatmapVisualization: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="h-80 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <p>Activity heatmap visualization would go here</p>
        <p className="text-sm">This would show activity patterns throughout the week by hour</p>
        <p className="text-sm">Sample data: {data.slice(0, 3).map((item: any) =>
          `${item.day} ${item.hour}:00 - ${item.count} activities`
        ).join(', ')}...</p>
      </div>
    </div>
  );
};

export default GeographicInsightsTab;
