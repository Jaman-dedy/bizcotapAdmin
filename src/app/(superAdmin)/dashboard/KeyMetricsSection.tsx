// components/dashboard/KeyMetricsSection.tsx
import React from 'react';
import { Card, Row, Col, Skeleton, Statistic, Tooltip } from 'antd';
import { UserOutlined, TeamOutlined, EyeOutlined, RiseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useUsers } from '@/hooks/users/useUsers';
import { useCompanies } from '@/hooks/companies/useCompanies';

interface PlatformMetrics {
  userGrowth: number;
  newUsersThisMonth: number;
  totalViews: number;
  conversionRate: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DashboardData {
  platformMetrics: PlatformMetrics;
  [key: string]: unknown;
}

interface KeyMetricsSectionProps {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({ loading, data }) => {
  const {
    data: usersResponse,
    isLoading: isLoadingUsers
  } = useUsers({ pageSize: 1 });

  // Fetch actual company count from API
  const {
    data: companiesResponse,
    isLoading: isLoadingCompanies
  } = useCompanies({ pageSize: 1 });

  if (!data) return null;

  // Use real API data for users and companies, mock data for the rest
  const totalUsers = usersResponse?.length || 0;
  const totalCompanies = companiesResponse?.data?.length || 0;

  return (
    <Skeleton loading={loading || isLoadingUsers || isLoadingCompanies} active paragraph={{ rows: 1 }}>
      <Row gutter={[16, 16]}>
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title={
                <div className="flex items-center">
                  Total Users
                  <Tooltip title="Total number of registered users on the platform">
                    <InfoCircleOutlined className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
              }
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
              suffix={
                <span className="text-xs text-green-500 ml-2">
                  +{data.platformMetrics.userGrowth}%
                </span>
              }
            />
            {/* <div className="mt-2 text-xs text-gray-500">
              {data.platformMetrics.newUsersThisMonth} new this month
            </div> */}
          </Card>
        </Col>

        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title={
                <div className="flex items-center">
                  Total Companies
                  <Tooltip title="Number of registered companies">
                    <InfoCircleOutlined className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
              }
              value={totalCompanies}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
            {/* <div className="mt-2 text-xs text-gray-500">
              ~{totalUsers > 0 && totalCompanies > 0 ? Math.round(totalUsers / totalCompanies) : 0} users per company
            </div> */}
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
  );


  return (
    <Skeleton loading={loading || isLoadingUsers || isLoadingCompanies} active paragraph={{ rows: 1 }}>
      <Row gutter={[16, 16]}>
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title={
                <div className="flex items-center">
                  Total Users
                  <Tooltip title="Total number of registered users on the platform">
                    <InfoCircleOutlined className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
              }
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
              suffix={
                <span className="text-xs text-green-500 ml-2">
                  +{data.platformMetrics.userGrowth}%
                </span>
              }
            />
            <div className="mt-2 text-xs text-gray-500">
              {data.platformMetrics.newUsersThisMonth} new this month
            </div>
          </Card>
        </Col>

        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title={
                <div className="flex items-center">
                  Total Companies
                  <Tooltip title="Number of registered companies">
                    <InfoCircleOutlined className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
              }
              value={totalCompanies}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
            <div className="mt-2 text-xs text-gray-500">
              ~{totalUsers > 0 && totalCompanies > 0 ? Math.round(totalUsers / totalCompanies) : 0} users per company
            </div>
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
  );
};

export default KeyMetricsSection;
