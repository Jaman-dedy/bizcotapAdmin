// components/insights/InsightMetrics.tsx
import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  EyeOutlined,
  ThunderboltOutlined,
  SwapOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

interface InsightMetricsProps {
  totalViews: number;
  totalActions: number;
  conversionRate: number;
  totalTags: number;
  viewsGrowth?: number;
}

export const InsightMetrics: React.FC<InsightMetricsProps> = ({
  totalViews,
  totalActions,
  conversionRate,
  totalTags,
  viewsGrowth,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="h-full shadow-sm">
          <Statistic
            title="Total Views"
            value={totalViews}
            prefix={<EyeOutlined />}
            valueStyle={{ color: "#1890ff" }}
            suffix={
              viewsGrowth ? (
                <span className="text-xs text-green-500 ml-2">
                  +{viewsGrowth}%
                </span>
              ) : null
            }
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="h-full shadow-sm">
          <Statistic
            title="Total Actions"
            value={totalActions}
            prefix={<ThunderboltOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="h-full shadow-sm">
          <Statistic
            title="Conversion Rate"
            value={conversionRate}
            precision={1}
            prefix={<SwapOutlined />}
            suffix="%"
            valueStyle={{ color: "#fa8c16" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="h-full shadow-sm">
          <Statistic
            title="Digital Cards"
            value={totalTags}
            prefix={<IdcardOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
    </Row>
  );
};








