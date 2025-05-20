// components/dashboard/DashboardTabs.tsx
import React from 'react';
import { Tabs, Skeleton } from 'antd';
import { AppstoreOutlined, TeamOutlined, PieChartOutlined, GlobalOutlined } from "@ant-design/icons";

import PlatformOverviewTab from './tabs/PlatformOverviewTab';
import CompaniesTab from './tabs/CompaniesTab';
import TagOrdersTab from './tabs/TagOrdersTab';
import GeographicInsightsTab from './tabs/GeographicInsightsTab';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  selectedCompany: number | null;
  setSelectedCompany: (id: number | null) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  loading,
  data,
  selectedCompany,
  setSelectedCompany
}) => {
  const items = [
    {
      key: "1",
      label: <span><AppstoreOutlined /> Platform Overview</span>,
      children: (
        <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
          <PlatformOverviewTab data={data} />
        </Skeleton>
      )
    },
    {
      key: "2",
      label: <span><TeamOutlined /> Companies</span>,
      children: (
        <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
          <CompaniesTab
            data={data}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
          />
        </Skeleton>
      )
    },
    {
      key: "3",
      label: <span><PieChartOutlined /> Tag Orders</span>,
      children: (
        <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
          <TagOrdersTab data={data} />
        </Skeleton>
      )
    },
    {
      key: "4",
      label: <span><GlobalOutlined /> Geographic Insights</span>,
      children: (
        <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
          <GeographicInsightsTab data={data} />
        </Skeleton>
      )
    }
  ];

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
  );
};

export default DashboardTabs;
