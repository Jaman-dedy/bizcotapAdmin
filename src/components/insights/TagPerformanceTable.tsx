// components/insights/TagPerformanceTable.tsx
import React from "react";
import { Card, Table, Tag as AntTag, Progress, Button } from "antd";
import { EyeOutlined, ThunderboltOutlined } from "@ant-design/icons";

interface TagData {
  id: number;
  tuid: string;
  name: string;
  views: number;
  actions: number;
  createdAt: string;
}

interface TagPerformanceTableProps {
  tags: TagData[];
}

export const TagPerformanceTable: React.FC<TagPerformanceTableProps> = ({
  tags,
}) => {
  const columns = [
    {
      title: "Card Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: TagData) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">ID: {record.tuid}</div>
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => {
        const date = new Date(text);
        return <span>{date.toLocaleDateString()}</span>;
      },
      width: 120,
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      render: (views: number) => (
        <div className="flex items-center gap-2">
          <EyeOutlined className="text-blue-500" />
          <span>{views}</span>
        </div>
      ),
      sorter: (a: TagData, b: TagData) => a.views - b.views,
      width: 100,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (actions: number) => (
        <div className="flex items-center gap-2">
          <ThunderboltOutlined className="text-green-500" />
          <span>{actions}</span>
        </div>
      ),
      sorter: (a: TagData, b: TagData) => a.actions - b.actions,
      width: 100,
    },
    {
      title: "Conversion",
      key: "conversion",
      render: (_: any, record: TagData) => {
        const conversionRate = record.views > 0 ? (record.actions / record.views) * 100 : 0;
        return (
          <Progress
            percent={Math.round(conversionRate)}
            size="small"
            format={(percent) => `${percent}%`}
            status={conversionRate > 30 ? "success" : conversionRate > 15 ? "normal" : "exception"}
          />
        );
      },
      sorter: (a: TagData, b: TagData) => 
        (a.views > 0 ? a.actions / a.views : 0) - 
        (b.views > 0 ? b.actions / b.views : 0),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: TagData) => (
        <Button type="link" size="small">
          View Details
        </Button>
      ),
      width: 100,
    },
  ];

  return (
    <Card
      title="Your Digital Business Cards"
      bordered={false}
      className="shadow-sm"
      extra={<Button type="primary" size="small">Create New Card</Button>}
    >
      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="overflow-x-auto"
      />
    </Card>
  );
};