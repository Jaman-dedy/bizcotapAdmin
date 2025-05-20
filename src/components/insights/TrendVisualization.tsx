import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, Cell } from 'recharts';
import { Card, Radio, Tabs, Badge, Select } from 'antd';

const TrendVisualization = () => {
  const [chartType, setChartType] = useState('line');
  const [dateRange, setDateRange] = useState('week');

  // Sample data based on API structure - in real implementation this would come from API
  const dailyData = [
    { date: 'Mon', views: 12, actions: 4, conversion: 33.3 },
    { date: 'Tue', views: 18, actions: 7, conversion: 38.9 },
    { date: 'Wed', views: 15, actions: 5, conversion: 33.3 },
    { date: 'Thu', views: 22, actions: 8, conversion: 36.4 },
    { date: 'Fri', views: 26, actions: 9, conversion: 34.6 },
    { date: 'Sat', views: 31, actions: 12, conversion: 38.7 },
    { date: 'Sun', views: 24, actions: 8, conversion: 33.3 }
  ];

  const weeklyData = [
    { date: 'Week 1', views: 98, actions: 32, conversion: 32.7 },
    { date: 'Week 2', views: 112, actions: 41, conversion: 36.6 },
    { date: 'Week 3', views: 125, actions: 45, conversion: 36.0 },
    { date: 'Week 4', views: 136, actions: 48, conversion: 35.3 }
  ];

  const monthlyData = [
    { date: 'Jan', views: 342, actions: 118, conversion: 34.5 },
    { date: 'Feb', views: 386, actions: 136, conversion: 35.2 },
    { date: 'Mar', views: 412, actions: 152, conversion: 36.9 },
    { date: 'Apr', views: 456, actions: 164, conversion: 36.0 },
    { date: 'May', views: 485, actions: 178, conversion: 36.7 }
  ];

  // Action type breakdown data
  const actionTypes = [
    { name: 'Phone Call', value: 26, color: '#52c41a' },
    { name: 'Email', value: 22, color: '#1890ff' },
    { name: 'Website Visit', value: 18, color: '#722ed1' },
    { name: 'Download VCF', value: 12, color: '#fa8c16' },
    { name: 'Social Media', value: 5, color: '#eb2f96' }
  ];

  const getData = () => {
    switch (dateRange) {
      case 'week':
        return dailyData;
      case 'month':
        return weeklyData;
      case 'year':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={getData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="views" stroke="#1890ff" name="Views" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="actions" stroke="#52c41a" name="Actions" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={getData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="views" fill="#1890ff" name="Views" />
        <Bar dataKey="actions" fill="#52c41a" name="Actions" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderComposedChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={getData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="views" barSize={20} fill="#1890ff" name="Views" />
        <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#fa8c16" name="Conversion %" strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderActionBreakdown = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={actionTypes}
        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Actions">
          {actionTypes.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Card title="Digital Card Analytics" variant="outlined" className="shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <Tabs 
          defaultActiveKey="1" 
          className="mb-0"
          items={[
            {
              key: "1",
              label: <span><Badge color="#1890ff" />Views & Actions</span>
            },
            {
              key: "2",
              label: <span><Badge color="#fa8c16" />Conversion Rate</span>
            },
            {
              key: "3",
              label: <span><Badge color="#52c41a" />Action Types</span>
            }
          ]}
        />
        
        <div className="flex gap-4">
          <Radio.Group value={chartType} onChange={e => setChartType(e.target.value)} size="small">
            <Radio.Button value="line">Line</Radio.Button>
            <Radio.Button value="bar">Bar</Radio.Button>
            <Radio.Button value="composed">Combined</Radio.Button>
          </Radio.Group>
          
          <Select 
            defaultValue="week" 
            style={{ width: 120 }} 
            onChange={value => setDateRange(value)}
            size="small"
          >
            <Select.Option value="week">7 Days</Select.Option>
            <Select.Option value="month">4 Weeks</Select.Option>
            <Select.Option value="year">5 Months</Select.Option>
          </Select>
        </div>
      </div>
      
      <div className="mt-4">
        {chartType === 'line' && renderLineChart()}
        {chartType === 'bar' && renderBarChart()}
        {chartType === 'composed' && renderComposedChart()}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Key Insights</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your cards received <span className="font-medium">245 views</span> in total</li>
            <li>Average conversion rate is <span className="font-medium">33.9%</span></li>
            <li>Most active day is <span className="font-medium">Saturday</span> with 31 views</li>
            <li>Phone calls are your <span className="font-medium">top action type</span></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Recommendations</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Add more contact options to increase engagement</li>
            <li>Update your profile photo for better recognition</li>
            <li>Add a call-to-action to improve conversion rates</li>
            <li>Share your card on social media for wider reach</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default TrendVisualization;