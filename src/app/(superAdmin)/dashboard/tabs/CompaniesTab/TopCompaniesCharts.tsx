import React from 'react';
import { Row, Col, Card, Empty, Spin } from 'antd';

interface TopCompaniesChartsProps {
  chartData: Array<{
    name: string;
    tags: number;
    views: number;
  }>;
  isLoading: boolean;
}

const TopCompaniesCharts: React.FC<TopCompaniesChartsProps> = ({
  chartData,
  isLoading
}) => {
  return (
    <>
      <Col xs={24} md={12}>
        <Card
          title="Top Companies by Cards"
          className="shadow-sm hover:shadow-md transition-shadow"
        >
          <Spin spinning={isLoading}>
            {chartData.length > 0 ? (
              <TopCompaniesByCardsChart data={chartData} />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <Empty description="No company data available" />
              </div>
            )}
          </Spin>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card
          title="Top Companies by Views"
          className="shadow-sm hover:shadow-md transition-shadow"
        >
          <Spin spinning={isLoading}>
            {chartData.length > 0 ? (
              <TopCompaniesByViewsChart data={chartData} />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <Empty description="No company data available" />
              </div>
            )}
          </Spin>
        </Card>
      </Col>
    </>
  );
};

// Placeholder component - in a real app, this would be a full chart implementation
const TopCompaniesByCardsChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="h-80 flex items-center justify-center text-gray-400">
      <div className="text-center w-full">
        <p>Top companies by cards chart would go here</p>
        <ul className="text-left text-sm mt-4 max-w-md mx-auto">
          {data.map((item: any, index: number) => (
            <li key={index} className="py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">
                  {item.tags} cards
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Placeholder component - in a real app, this would be a full chart implementation
const TopCompaniesByViewsChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="h-80 flex items-center justify-center text-gray-400">
      <div className="text-center w-full">
        <p>Top companies by views chart would go here</p>
        <ul className="text-left text-sm mt-4 max-w-md mx-auto">
          {data.map((item: any, index: number) => (
            <li key={index} className="py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-amber-100 text-amber-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs">
                  {item.views.toLocaleString()} views
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopCompaniesCharts;
