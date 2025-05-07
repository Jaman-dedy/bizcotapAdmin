// components/insights/GeoDistributionCard.tsx
import React from "react";
import { Card, Progress, Tooltip } from "antd";
import { GlobalOutlined } from "@ant-design/icons";

interface GeoLocation {
  country?: string;
  region?: string;
  city?: string;
  count: number;
}

interface GeoDistributionCardProps {
  countries: GeoLocation[];
  cities?: GeoLocation[];
  total: number;
}

export const GeoDistributionCard: React.FC<GeoDistributionCardProps> = ({
  countries,
  cities = [],
  total,
}) => {
  // Calculate percentages
  const countryData = countries.map(country => ({
    ...country,
    percentage: Math.round((country.count / total) * 100)
  }));

  return (
    <Card
      title="Geographic Distribution"
      bordered={false}
      className="h-full shadow-sm"
    >
      <div className="space-y-4">
        <div className="mb-2">
          <div className="font-medium mb-2">Top Countries</div>
          {countryData.slice(0, 5).map((country, index) => (
            <Tooltip 
              key={country.country || index}
              title={`${country.count} views (${country.percentage}%)`}
            >
              <div className="mb-3">
                <div className="flex justify-between mb-1 text-sm">
                  <div className="flex items-center gap-2">
                    <GlobalOutlined className="text-blue-500" />
                    <span>{country.country}</span>
                  </div>
                  <span>{country.count}</span>
                </div>
                <Progress 
                  percent={country.percentage} 
                  showInfo={false}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  size="small"
                />
              </div>
            </Tooltip>
          ))}
        </div>

        {cities.length > 0 && (
          <div>
            <div className="font-medium mb-2">Top Cities</div>
            <div className="grid grid-cols-2 gap-2">
              {cities.slice(0, 6).map((city, index) => (
                <div key={city.city || index} className="flex items-center justify-between">
                  <div className="truncate">{city.city}</div>
                  <div className="text-sm text-gray-500">{city.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
