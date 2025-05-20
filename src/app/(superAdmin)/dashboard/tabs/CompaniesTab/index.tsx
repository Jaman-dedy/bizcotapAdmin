// components/dashboard/tabs/CompaniesTab.tsx
import React, { useState } from 'react';
import { Row, Col, Card, Table, Progress, Button, Empty, Spin, Typography, Tooltip } from 'antd';
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { useCompanies } from '@/hooks/companies/useCompanies';
import { useUsers } from '@/hooks/users/useUsers';
import type { Company } from '@/types/company';
import CompanyFormModal from './CompanyFormModal';
import CompanyDetailsModal from './CompanyDetailsModal';
import CompanyTableActions from './CompanyTableActions';
import TopCompaniesCharts from './TopCompaniesCharts';
import CompanyAvatar from './CompanyAvatar';
import './styles.css'

const { Text, Title } = Typography;

interface CompaniesTabProps {
  data: any;
  selectedCompany: number | null;
  setSelectedCompany: (id: number | null) => void;
}

const CompaniesTab: React.FC<CompaniesTabProps> = ({
  data,
  selectedCompany,
  setSelectedCompany
}) => {
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);

  // Fetch real company data
  const {
    data: companies,
    isLoading: isLoadingCompanies,
    refetch: refetchCompanies
  } = useCompanies();

  // Fetch users to calculate counts per company
  const { data: users } = useUsers();

  // Calculate user counts per company
  const getUserCountByCompany = (companyId: number) => {
    if (!users) return 0;
    return users.filter(user => user.companyId === companyId).length;
  };

  // Prepare company data with calculated fields
  const processedCompanies = React.useMemo(() => {
    if (!companies) return [];

    return companies.map((company: { id: number; }) => ({
      ...company,
      userCount: getUserCountByCompany(company.id),
      // These fields don't exist in our real API yet, so we're providing placeholders
      tagCount: Math.floor(Math.random() * 100) + 10, // Placeholder
      totalViews: Math.floor(Math.random() * 5000) + 500, // Placeholder
      activeTagsPercent: Math.floor(Math.random() * 40) + 60, // Placeholder (60-100%)
    }));
  }, [companies, users]);

  // Modal handlers
  const showAddModal = () => {
    setEditingCompany(null);
    setIsFormModalOpen(true);
  };

  const showEditModal = (company: Company) => {
    setEditingCompany(company);
    setIsFormModalOpen(true);
  };

  const showDetailsModal = (company: Company) => {
    setViewingCompany(company);
    setIsDetailsModalOpen(true);
  };

  const handleCompanyClick = (company: Company) => {
    // First set the viewing company, then update selected ID and show modal
    // This ensures data is available before modal opens
    setIsDetailsModalOpen(true);
    setViewingCompany(company);
    // setTimeout(() => {
    //    setSelectedCompany(company.id);
    //    setIsDetailsModalOpen(true);
    //  }, 10);
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setEditingCompany(null);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setViewingCompany(null);
  };

  const handleFormSubmitSuccess = () => {
    setIsFormModalOpen(false);
    refetchCompanies();
  };

  // Setup company table columns
  const companyColumns = [
    {
      title: "Company",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-2">
          <CompanyAvatar company={record} />
          <div className="flex flex-col">
            <div
              onClick={() => handleCompanyClick(record)}
              className="hover:text-blue-600 font-medium text-gray-800 cursor-pointer transition-colors"
            >
              {text}
            </div>
            {record.industry && (
              <Text type="secondary" className="text-xs">
                {record.industry}
              </Text>
            )}
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => (
        <Tooltip title={new Date(text).toLocaleString()}>
          {new Date(text).toLocaleDateString()}
        </Tooltip>
      ),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      responsive: ["md" as const],
    },
    {
      title: "Users",
      dataIndex: "userCount",
      key: "userCount",
      render: (count: number) => (
        <div className="flex items-center gap-1">
          <TeamOutlined className="text-blue-500" />
          {count}
        </div>
      ),
      sorter: (a: any, b: any) => a.userCount - b.userCount,
    },
    {
      title: "Cards",
      dataIndex: "tagCount",
      key: "tagCount",
      sorter: (a: any, b: any) => a.tagCount - b.tagCount,
    },
    {
      title: "Views",
      dataIndex: "totalViews",
      key: "totalViews",
      render: (views: number) => views.toLocaleString(),
      sorter: (a: any, b: any) => a.totalViews - b.totalViews,
    },
    {
      title: "Active Cards",
      key: "activeTagsPercent",
      render: (text: string, record: any) => (
        <Progress
          percent={record.activeTagsPercent}
          size="small"
          strokeColor={{
            from: '#108ee9',
            to: record.activeTagsPercent > 90 ? '#52c41a' : record.activeTagsPercent > 70 ? '#1890ff' : '#faad14'
          }}
          className="w-32"
        />
      ),
      sorter: (a: any, b: any) => a.activeTagsPercent - b.activeTagsPercent,
      responsive: ["lg" as const],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <CompanyTableActions
          company={record}
          onEdit={showEditModal}
          onRefresh={refetchCompanies}
          onSelectCompany={setSelectedCompany}
          selectedCompany={selectedCompany}
        />
      ),
    },
  ];

  // Company comparison data for charts - use real data if available
  const topCompanies = processedCompanies.length > 0
    ? [...processedCompanies].sort((a, b) => b.tagCount - a.tagCount).slice(0, 5)
    : data.companyComparison.topCompaniesByTags;

  const companyChartData = topCompanies.map((company: any) => ({
    name: company.name,
    tags: company.tagCount,
    views: company.totalViews || 0,
  }));

  // Render empty state if no companies
  const EmptyState = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 mb-4">No companies found</p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-md hover:shadow-lg transition-all hover:from-blue-600 hover:to-purple-700"
          >
            Add Company
          </Button>
        </div>
      }
    />
  );

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <div className="flex items-center justify-between w-full">
                <Title level={5} style={{ margin: 0 }}>Company Performance</Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showAddModal}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-sm hover:shadow-md transition-all hover:from-blue-600 hover:to-purple-700"
                >
                  Add Company
                </Button>
              </div>
            }
            className="shadow-sm hover:shadow-md transition-shadow"
            extra={
              selectedCompany ? (
                <Button type="link" onClick={() => setSelectedCompany(null)}>
                  View All Companies
                </Button>
              ) : null
            }
          >
            <Spin spinning={isLoadingCompanies}>
              {processedCompanies.length > 0 ? (
                <Table
                  dataSource={processedCompanies}
                  columns={companyColumns}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} companies`
                  }}
                  onRow={(record) => ({
                    onClick: () => handleCompanyClick(record),
                    className: 'cursor-pointer'
                  })}
                  className="hover-row-highlight"
                />
              ) : (
                <EmptyState />
              )}
            </Spin>
          </Card>
        </Col>

        <TopCompaniesCharts
          chartData={companyChartData}
          isLoading={isLoadingCompanies}
        />
      </Row>

      {/* Company Form Modal (Add/Edit) */}
      <CompanyFormModal
        open={isFormModalOpen}
        editingCompany={editingCompany}
        onClose={handleFormModalClose}
        onSuccess={handleFormSubmitSuccess}
      />

      {/* Company Details Modal */}
      <CompanyDetailsModal
        open={isDetailsModalOpen}
        company={viewingCompany}
        onClose={handleDetailsModalClose}
        onEdit={showEditModal}
        userCount={viewingCompany ? getUserCountByCompany(viewingCompany.id) : 0}
      />

      {/* Add CSS for hover effect on table rows */}
      <style jsx global>{`
        .hover-row-highlight .ant-table-tbody > tr:hover > td {
          background-color: rgba(240, 240, 255, 0.5) !important;
        }

        .company-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .company-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 12px;
        }
      `}</style>
    </>
  );
};

export default CompaniesTab;
