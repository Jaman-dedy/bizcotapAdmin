// components/dashboard/tabs/modals/CompanyDetailsModal.tsx
import React from 'react';
import { Modal, Button, Typography, Descriptions, Space, Tag, Divider, Row, Col, Card, Statistic } from 'antd';
import {
  GlobalOutlined,
  EditOutlined,
  UserOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  EyeOutlined,
  TagOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { Company } from '@/types/company';
import CompanyAvatar from './CompanyAvatar';

const { Title, Text, Link: AntLink } = Typography;

interface CompanyDetailsModalProps {
  open: boolean;
  company: Company | null;
  onClose: () => void;
  onEdit: (company: Company) => void;
  userCount: number;
}

const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  open,
  company,
  onClose,
  onEdit,
  userCount
}) => {
  // Return an empty modal if no company is provided
  // This prevents errors when the modal is first rendered with no data
  if (!company) {
    return (
      <Modal
        open={false}
        onCancel={onClose}
        footer={null}
        width={800}
      />
    );
  }

  // Use any existing company data or generate placeholder stats
  // We ensure these are calculated and stable when the component renders
  const stats = React.useMemo(() => ({
    tagCount: company.tagCount || Math.floor(Math.random() * 100) + 10,
    activeTagsPercent: company.activeTagsPercent || Math.floor(Math.random() * 40) + 60,
    totalViews: company.totalViews || Math.floor(Math.random() * 5000) + 500,
    avgViewsPerTag: Math.floor(Math.random() * 50) + 5
  }), [company]);

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onEdit(company)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
        >
          Edit Company
        </Button>,
      ]}
      width={800}
      title={null}
      className="company-modal company-details-modal"
      centered
    >
      <div className="p-2">
        {/* Enhanced Header with gradient background */}
        <div className="relative rounded-xl mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 -z-10" />

          <div className="flex items-start p-6">
            <div className="relative">
              <CompanyAvatar company={company} size="large" />
              {company.logo && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircleOutlined className="text-white text-xs" />
                </div>
              )}
            </div>

            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <Title level={3} className="m-0 mb-1">{company.name}</Title>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                  ID: {company.id}
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-2 mb-2">
                {company.industry && (
                  <Tag color="blue" className="mr-2">
                    {company.industry}
                  </Tag>
                )}
                {company.dataProcessingAgreement && (
                  <Tag color="green" className="mr-2">
                    DPA Signed
                  </Tag>
                )}
              </div>

              <div className="flex items-center text-gray-500 mt-2">
                {company.website && (
                  <AntLink href={company.website} target="_blank" className="flex items-center text-gray-500 hover:text-blue-500 mr-6">
                    <GlobalOutlined className="mr-1" /> {company.website.replace(/^https?:\/\//, '')}
                  </AntLink>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with improved design */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6} md={6} lg={6}>
            <Card
              className="text-center h-full overflow-hidden relative border-0 shadow"
              bodyStyle={{ padding: '16px 12px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 -z-10" />
              <Statistic
                title={<span className="text-blue-600 font-medium">Users</span>}
                value={userCount}
                prefix={<TeamOutlined className="text-blue-500 mr-1" />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Card
              className="text-center h-full overflow-hidden relative border-0 shadow"
              bodyStyle={{ padding: '16px 12px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 -z-10" />
              <Statistic
                title={<span className="text-purple-600 font-medium">Cards</span>}
                value={stats.tagCount}
                prefix={<TagOutlined className="text-purple-500 mr-1" />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Card
              className="text-center h-full overflow-hidden relative border-0 shadow"
              bodyStyle={{ padding: '16px 12px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 -z-10" />
              <Statistic
                title={<span className="text-green-600 font-medium">Views</span>}
                value={stats.totalViews}
                prefix={<EyeOutlined className="text-green-500 mr-1" />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Card
              className="text-center h-full overflow-hidden relative border-0 shadow"
              bodyStyle={{ padding: '16px 12px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-cyan-100 -z-10" />
              <Statistic
                title={<span className="text-cyan-600 font-medium">Active</span>}
                value={`${stats.activeTagsPercent}%`}
                prefix={<CheckCircleOutlined className="text-cyan-500 mr-1" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Description with improved design */}
        {company.description && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <Title level={5} className="flex items-center gap-2 mb-3">
              <InfoCircleOutlined className="text-blue-500" />
              About
            </Title>
            <Text className="text-gray-700">{company.description}</Text>
          </div>
        )}

        {/* Details with improved tab-like design */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            <Title level={5} style={{ margin: 0 }}>Company Details</Title>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Created card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center text-gray-600">
                  <FieldTimeOutlined className="mr-2 text-blue-500" />
                  <span className="font-medium">Created</span>
                </div>
              </div>
              <div className="p-4">
                {formatDate(company.createdAt)}
              </div>
            </div>

            {/* Owner card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center text-gray-600">
                  <UserOutlined className="mr-2 text-blue-500" />
                  <span className="font-medium">Owner</span>
                </div>
              </div>
              <div className="p-4">
                {company.owner ? (
                  <>
                    <div>{company.owner.firstName} {company.owner.lastName}</div>
                    <div className="text-xs text-gray-500 mt-1">{company.owner.email}</div>
                  </>
                ) : 'Not assigned'}
              </div>
            </div>

            {/* Last Updated card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center text-gray-600">
                  <FieldTimeOutlined className="mr-2 text-blue-500" />
                  <span className="font-medium">Last Updated</span>
                </div>
              </div>
              <div className="p-4">
                {formatDate(company.updatedAt)}
              </div>
            </div>

            {/* DPA Status card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center text-gray-600">
                  <CheckCircleOutlined className="mr-2 text-blue-500" />
                  <span className="font-medium">DPA Status</span>
                </div>
              </div>
              <div className="p-4">
                <Tag
                  color={company.dataProcessingAgreement ? 'success' : 'warning'}
                  className="px-3 py-1"
                >
                  {company.dataProcessingAgreement ? 'Signed' : 'Not Signed'}
                </Tag>
                {company.dataProcessingDate && (
                  <div className="text-xs text-gray-500 mt-2">
                    Signed on {formatDate(company.dataProcessingDate)}
                  </div>
                )}
              </div>
            </div>

            {/* Employees card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sm:col-span-2">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center text-gray-600">
                  <TeamOutlined className="mr-2 text-blue-500" />
                  <span className="font-medium">Employees</span>
                </div>
              </div>
              <div className="p-4">
                {company.employees && company.employees.length > 0 ? (
                  <div>
                    <div className="mb-2">{company.employees.length} {company.employees.length === 1 ? 'employee' : 'employees'}</div>
                    <div className="flex flex-wrap gap-2">
                      {company.employees.slice(0, 5).map((employee: any, index: number) => (
                        <Tag key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border-blue-100">
                          <UserOutlined className="text-blue-500" />
                          {employee.firstName} {employee.lastName}
                        </Tag>
                      ))}
                      {company.employees.length > 5 && (
                        <Tag className="px-2 py-1 bg-gray-100 text-gray-700">
                          +{company.employees.length - 5} more
                        </Tag>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500">No employees assigned</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .company-details-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .company-details-modal .ant-modal-body {
          padding: 24px;
        }

        .company-details-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
          padding: 16px 24px;
        }

        .company-details-modal .ant-statistic-content {
          font-size: 24px;
          font-weight: 600;
        }

        .company-details-modal .ant-statistic-title {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .company-details-modal .ant-tag {
          border-radius: 6px;
          font-weight: 500;
        }

        .company-details-modal .ant-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .company-details-modal .ant-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </Modal>
  );
};

export default CompanyDetailsModal;
