// components/insights/ActivityTimeline.tsx
import React from "react";
import { Card, Timeline, Tag as AntTag, Avatar } from "antd";
import {
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  DownloadOutlined,
  UserOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

interface Activity {
  type: "view" | "action";
  actionType?: string;
  tagName: string;
  timestamp: string;
  location: {
    country: string;
    region: string;
    city: string;
  } | null;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
}) => {
  const getIcon = (activity: Activity) => {
    if (activity.type === "view") {
      return <EyeOutlined style={{ color: "#1890ff" }} />;
    }

    switch (activity.actionType) {
      case "phone_call":
        return <PhoneOutlined style={{ color: "#52c41a" }} />;
      case "email":
        return <MailOutlined style={{ color: "#fa8c16" }} />;
      case "website_visit":
        return <GlobalOutlined style={{ color: "#722ed1" }} />;
      case "download_vcf":
        return <DownloadOutlined style={{ color: "#eb2f96" }} />;
      default:
        return <ThunderboltOutlined style={{ color: "#52c41a" }} />;
    }
  };

  const getActionLabel = (activity: Activity) => {
    if (activity.type === "view") {
      return "Card View";
    }
    return activity.actionType?.replace("_", " ");
  };

  const getTimeLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card
      title="Recent Activity"
      variant="outlined"
      className="h-full shadow-sm"
    >
      <Timeline>
        {activities.map((activity, index) => (
          <Timeline.Item
            key={index}
            dot={getIcon(activity)}
          >
            <div className="flex justify-between items-baseline mb-1">
              <div className="font-medium flex items-center gap-2">
                {getActionLabel(activity)}
                {activity.type === "action" && (
                  <AntTag color="green">
                    {getActionLabel(activity)}
                  </AntTag>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {getTimeLabel(activity.timestamp)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar size="small" icon={<UserOutlined />} />
              <span>{activity.tagName}</span>
            </div>
            {activity.location && (
              <div className="text-xs text-gray-500 mt-1">
                {activity.location.city}, {activity.location.country}
              </div>
            )}
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};