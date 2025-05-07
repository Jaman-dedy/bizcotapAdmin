"use client";

import React from "react";
import { Card, Tooltip, Divider, Progress } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  DownloadOutlined,
  LinkedinOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

interface ActionData {
  action: string;
  count: number;
}

interface ActionBreakdownCardProps {
  data: ActionData[];
  title?: string;
}

export const ActionBreakdownCard: React.FC<ActionBreakdownCardProps> = ({
  data,
  title = "Action Breakdown",
}) => {
  // Get total actions
  const totalActions = data.reduce((sum, item) => sum + item.count, 0);

  // Map action types to icons
  const actionIcons: Record<string, React.ReactNode> = {
    phone_call: <PhoneOutlined className="text-green-500" />,
    email: <MailOutlined className="text-blue-500" />,
    website_visit: <GlobalOutlined className="text-purple-500" />,
    download_vcf: <DownloadOutlined className="text-orange-500" />,
    linkedin: <LinkedinOutlined className="text-blue-700" />,
    twitter: <TwitterOutlined className="text-blue-400" />,
  };

  // Calculate percentages
  const actionData = data.map(item => ({
    ...item,
    percentage: totalActions > 0 ? Math.round((item.count / totalActions) * 100) : 0,
    icon: actionIcons[item.action] || <GlobalOutlined className="text-gray-500" />
  }));

  // Format action name for display
  const formatActionName = (action: string): string => {
    return action.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card 
      title={title} 
      variant="outlined" 
      className="shadow-sm h-full"
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        {actionData.map((item) => (
          <div key={item.action} className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-full">{item.icon}</div>
            <div>
              <div className="capitalize text-sm font-medium">
                {formatActionName(item.action)}
              </div>
              <div className="text-lg font-semibold">{item.count}</div>
            </div>
          </div>
        ))}
      </div>

      <Divider className="my-4" />

      <div className="space-y-3">
        {actionData.map((item) => (
          <Tooltip 
            key={item.action} 
            title={`${item.count} actions (${item.percentage}%)`}
          >
            <div className="mb-2">
              <div className="flex justify-between mb-1 text-sm">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="capitalize">{formatActionName(item.action)}</span>
                </div>
                <span>{item.percentage}%</span>
              </div>
              <Progress 
                percent={item.percentage} 
                showInfo={false}
                strokeColor={{
                  '0%': getStrokeColor(item.action, '0%'),
                  '100%': getStrokeColor(item.action, '100%'),
                }}
                size="small"
              />
            </div>
          </Tooltip>
        ))}
      </div>
      
      {actionData.length > 0 && (
        <div className="mt-6 text-sm text-gray-500">
          <p>Total actions: {totalActions}</p>
        </div>
      )}
    </Card>
  );
};

// Helper function to get stroke color based on action type
function getStrokeColor(action: string, position: '0%' | '100%'): string {
  const colorMap: Record<string, [string, string]> = {
    phone_call: ['#52c41a', '#87d068'],
    email: ['#1890ff', '#69c0ff'],
    website_visit: ['#722ed1', '#b37feb'],
    download_vcf: ['#fa8c16', '#ffc53d'],
    linkedin: ['#0a66c2', '#4e9be6'],
    twitter: ['#1da1f2', '#6cc1f5'],
  };
  
  const defaultColors: [string, string] = ['#1890ff', '#69c0ff'];
  const colors = colorMap[action] || defaultColors;
  
  return position === '0%' ? colors[0] : colors[1];
}