// components/insights/TeamPerformanceCard.tsx
import React from "react";
import { Card, Table, Avatar, Progress, Tabs } from "antd";
import { UserOutlined, TrophyOutlined } from "@ant-design/icons";

interface TeamMember {
  id: number;
  name: string;
  tagCount: number;
  totalViews: number;
  totalActions: number;
  conversionRate: number;
}

interface TeamPerformanceCardProps {
  members: TeamMember[];
}

export const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({
  members,
}) => {
  const columns = [
    {
      title: "Team Member",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<UserOutlined />} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Cards",
      dataIndex: "tagCount",
      key: "tagCount",
      width: 80,
    },
    {
      title: "Views",
      dataIndex: "totalViews",
      key: "totalViews",
      sorter: (a: TeamMember, b: TeamMember) => a.totalViews - b.totalViews,
      width: 90,
    },
    {
      title: "Actions",
      dataIndex: "totalActions",
      key: "totalActions",
      sorter: (a: TeamMember, b: TeamMember) => a.totalActions - b.totalActions,
      width: 90,
    },
    {
      title: "Conversion",
      key: "conversion",
      render: (_: any, record: TeamMember) => (
        <Progress
          percent={Math.round(record.conversionRate)}
          size="small"
          format={(percent) => `${percent}%`}
        />
      ),
      sorter: (a: TeamMember, b: TeamMember) => a.conversionRate - b.conversionRate,
    },
  ];

  // Sort members by views
  const sortedMembers = [...members].sort((a, b) => b.totalViews - a.totalViews);
  const topPerformer = sortedMembers[0];

  return (
    <Card 
      title="Team Performance" 
      variant="outlined" 
      className="shadow-sm h-full"
    >
      <Tabs 
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Leaderboard",
            children: (
              <Table 
                columns={columns}
                dataSource={members}
                rowKey="id"
                pagination={false}
              />
            )
          },
          {
            key: "2",
            label: "Top Performer",
            children: topPerformer && (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar size={80} icon={<UserOutlined />} className="bg-blue-500" />
                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                      <TrophyOutlined className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold mb-1">{topPerformer.name}</div>
                <div className="text-sm text-gray-500 mb-4">Top Performer</div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="text-gray-500 text-sm">Cards</div>
                    <div className="font-semibold text-lg">{topPerformer.tagCount}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Views</div>
                    <div className="font-semibold text-lg">{topPerformer.totalViews}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Actions</div>
                    <div className="font-semibold text-lg">{topPerformer.totalActions}</div>
                  </div>
                </div>
                
                <div className="mb-2 font-medium text-left">Conversion Rate</div>
                <Progress
                  percent={Math.round(topPerformer.conversionRate)}
                  status="active"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            )
          }
        ]}
      />
    </Card>
  );
};