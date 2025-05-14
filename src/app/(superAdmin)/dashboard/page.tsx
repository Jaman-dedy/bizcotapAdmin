"use client";

import React, { useState, useEffect } from "react";
import { Alert, Button, DatePicker, Skeleton, message } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";

import DashboardHeader from "./DashboardHeader";
import KeyMetricsSection from "./KeyMetricsSection";
import DashboardTabs from "./DashboardTabs";
import { useFetchDashboardData } from "@/hooks/dashboard/useDashboardData";

const { RangePicker } = DatePicker;

export default function SuperAdminDashboard() {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  const {
    data: dashboardData,
    isLoading: loading,
    error,
    refetch
  } = useFetchDashboardData(selectedCompany);

  // Handle date range change
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    message.info("Date range updated");
  };

  // Handle data refresh
  const handleRefresh = () => {
    refetch();
    message.success("Dashboard data refreshed");
  };

  // Export dashboard data
  const handleExport = () => {
    message.info("Exporting dashboard data...");
    // Implementation for exporting data would go here
  };

  return (
    <div className="p-4 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <DashboardHeader />
        <div className="flex flex-wrap items-center gap-3">
          <RangePicker
            onChange={handleDateRangeChange}
            className="w-64"
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Error message if any */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-6"
        />
      )}

      {/* Key metrics */}
      <KeyMetricsSection loading={loading} data={dashboardData} />

      {/* Main content tabs */}
      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading}
        data={dashboardData}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
    </div>
  );
}
