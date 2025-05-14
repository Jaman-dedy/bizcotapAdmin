// components/dashboard/tabs/TagOrdersTab.tsx
import React from 'react';
import { Row, Col, Card, Tag } from 'antd';

interface TagOrdersTabProps {
  data: any;
}

const TagOrdersTab: React.FC<TagOrdersTabProps> = ({ data }) => {
  return (
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
          <OrderTrendsChart data={data.tagOrderMetrics.monthlyTrends} />
        </Card>
      </Col>

      <Col xs={24}>
        <Card title="Recent Orders" className="shadow-sm">
          <RecentOrdersTable />
        </Card>
      </Col>
    </Row>
  );
};

// Placeholder component - in a real app, this would be a full chart implementation
const OrderTrendsChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="h-80 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <p>Monthly order trends chart would go here</p>
        <p className="text-sm">Months: {data.months.join(', ')}</p>
        <p className="text-sm">Order counts: {data.orderCounts.join(', ')}</p>
      </div>
    </div>
  );
};

// Placeholder component - in a real app, this would have actual order data
const RecentOrdersTable: React.FC = () => {
  return (
    <div className="h-80 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <p>Recent orders table would go here</p>
        <p className="text-sm">This would display the most recent tag orders with status, date, customer, etc.</p>
      </div>
    </div>
  );
};

export default TagOrdersTab;
