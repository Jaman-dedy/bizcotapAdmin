// components/dashboard/DashboardTabs.tsx
import React from 'react';
import { Tabs, Skeleton } from 'antd';
import { AppstoreOutlined, TeamOutlined, PieChartOutlined, GlobalOutlined } from "@ant-design/icons";

import PlatformOverviewTab from './tabs/PlatformOverviewTab';
import CompaniesTab from './tabs/CompaniesTab';
import TagOrdersTab from './tabs/TagOrdersTab';
import GeographicInsightsTab from './tabs/GeographicInsightsTab';

const { TabPane } = Tabs;

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
  loading: boolean;
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
  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab}>
      <TabPane
        tab={<span><AppstoreOutlined /> Platform Overview</span>}
        key="1"
      >
        <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
          <PlatformOverviewTab data={data} />
        </Skeleton>
      </TabPane>

      <TabPane
        tab={<span><TeamOutlined /> Companies</span>}
        key="2"
      >
        <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
          <CompaniesTab
            data={data}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
          />
        </Skeleton>
      </TabPane>

      <TabPane
        tab={<span><PieChartOutlined /> Tag Orders</span>}
        key="3"
      >
        <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
          <TagOrdersTab data={data} />
        </Skeleton>
      </TabPane>

      <TabPane
        tab={<span><GlobalOutlined /> Geographic Insights</span>}
        key="4"
      >
        <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
          <GeographicInsightsTab data={data} />
        </Skeleton>
      </TabPane>
    </Tabs>
  );
};

export default DashboardTabs;
