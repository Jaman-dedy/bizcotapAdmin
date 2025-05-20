'use client';

import React, { useState, useEffect } from "react";
import { Table, Button, Input, Typography, Dropdown, message, Tooltip, Empty, Alert, Avatar, Card, Modal, Badge, Space } from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  LoginOutlined,
  QrcodeOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Tag, Email } from '@/services/tagsService';
import useTags from '@/hooks/useTags';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useTagsContext } from '@/context/tags/TagsContext';

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function TagsTable() {
  const [searchText, setSearchText] = useState<string>('');
  const [sortedInfo, setSortedInfo] = useState<any>({});
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const { myTags, isLoading, error, fetchMyTags, deleteTag } = useTags();
  const router = useRouter();

  const { setCurrentTag, addToCache } = useTagsContext();

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const getInitials = (firstName: string, lastName: string): string => {
    return (
      (firstName ? firstName.charAt(0) : '') +
      (lastName ? lastName.charAt(0) : '')
    ).toUpperCase();
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSearchText('');
  };

  const filteredTags = myTags.filter(tag => {
    const searchLower = searchText.toLowerCase();
    const fname = tag.tagInfo.fname?.toLowerCase() || '';
    const lname = tag.tagInfo.lname?.toLowerCase() || '';
    const emails = tag.tagInfo.emails?.map(e => e.value.toLowerCase()) || [];
    const company = tag.tagInfo.company?.toLowerCase() || '';

    return fname.includes(searchLower) ||
      lname.includes(searchLower) ||
      emails.some(email => email.includes(searchLower)) ||
      company.includes(searchLower);
  });

  const handleView = (tag: Tag) => {
    setCurrentTag(tag);
    addToCache(tag);
    router.push(`https://link.bizcotap.com/profile/6829856056316e89705d98`);
  };

  const refreshData = () => {
    fetchMyTags();
    message.success('Contact list refreshed');
  };

  const companyFilters = Array.from(new Set(myTags.map(tag => tag.tagInfo.company)))
    .filter(Boolean)
    .map(company => ({ text: company, value: company })) as { text: string; value: string }[];

  const handleCreateVirtualBackground = (record: Tag) => {
    console.log('record ==>>>', record)
    setCurrentTag(record);
    addToCache(record);
    router.push(`/companyAdmin/profiles/virtual-background/${record.tuid}`);
  };

  const handleGenerateQrCode = (record: Tag) => {
    setCurrentTag(record);
    addToCache(record);
    message.info(`Generate QR code for ${record.tagInfo.fname}`);
  };

  const handleCreateEmailSignature = (record: Tag) => {
    setCurrentTag(record);
    addToCache(record);
    message.info(`Create email signature for ${record.tagInfo.fname}`);
  };

  const columns: ColumnsType<Tag> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      className: 'text-center',
      render: (_, __, index) => (
        <div className="text-center text-gray-600">{index + 1}</div>
      ),
    },
    {
      title: 'Profile',
      key: 'profile',
      width: '80px',
      className: 'text-center',
      render: (_, record) => (
        <Avatar
          src={record.tagInfo.avatar}
          size={50}
          className="bg-blue-500 flex-shrink-0 mx-auto"
        >
          {!record.tagInfo.avatar && getInitials(record.tagInfo.fname, record.tagInfo.lname)}
        </Avatar>
      ),
    },
    {
      title: 'Name',
      key: 'name',
      className: 'text-left',
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.tagInfo.fname} {record.tagInfo.lname}
          </div>
          {record.tagInfo.position && (
            <div className="text-sm text-gray-500">
              {record.tagInfo.position}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => {
        const nameA = `${a.tagInfo.fname} ${a.tagInfo.lname}`;
        const nameB = `${b.tagInfo.fname} ${b.tagInfo.lname}`;
        return nameA.localeCompare(nameB);
      },
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    },
    {
      title: 'Company',
      key: 'company',
      className: 'text-left',
      width: '30%',
      render: (_, record) => (
        <div className="text-gray-700 font-medium">
          {record.tagInfo.company || 'N/A'}
        </div>
      ),
      sorter: (a, b) => (a.tagInfo.company || '').localeCompare(b.tagInfo.company || ''),
      sortOrder: sortedInfo.columnKey === 'company' && sortedInfo.order,
      filters: companyFilters,
      filteredValue: filteredInfo.company || null,
      onFilter: (value, record) => record.tagInfo.company === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'text-center',
      width: '20%',
      render: (_, record) => {
        const menuItems = [
          {
            key: '1',
            label: 'View Profile',
            icon: <EyeOutlined />,
            onClick: () => handleView(record),
          },
          {
            type: 'divider' as const,
          },
          {
            key: '2',
            label: 'Create virtual background',
            icon: <PictureOutlined />,
            onClick: () => handleCreateVirtualBackground(record),
          },
          {
            key: '3',
            label: 'Generate QR Code',
            icon: <QrcodeOutlined />,
            onClick: () => handleGenerateQrCode(record),
          },
          {
            key: '4',
            label: 'Email Signature',
            icon: <SignatureOutlined />,
            onClick: () => handleCreateEmailSignature(record),
          },
        ];

        return (
          <Space size="middle">
            <Tooltip title="View Profile">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />
            </Tooltip>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Button icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Profiles data...</p>
        </div>
      </div>
    );
  }

  const isAuthError = error && error.includes('Authentication');

  if (isAuthError) {
    return (
      <Card className="shadow-md rounded-lg overflow-hidden">
        <Alert
          message="Authentication Required"
          description="You need to log in to view contact data. Please log in and try again."
          type="warning"
          showIcon
          action={
            <Button type="primary" icon={<LoginOutlined />} onClick={() => {
              window.location.href = '/';
            }}>
              Log In
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Title level={2} className="m-0 text-2xl font-bold">Profiles</Title>

        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Input
              placeholder="Search Profiles..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              className="rounded-lg w-full md:w-64"
              size="large"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Tooltip title="Refresh Data">
              <Button
                icon={<ReloadOutlined />}
                onClick={refreshData}
                size="large"
              />
            </Tooltip>

            <Tooltip title="Clear Filters">
              <Button
                icon={<FilterOutlined />}
                onClick={clearAll}
                size="large"
                type={filteredInfo.company || sortedInfo.columnKey ? "primary" : "default"}
              />
            </Tooltip>

            {/* <Link href="/tags/new">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Create New
              </Button>
            </Link> */}
          </div>
        </div>
      </div>

      <Card className="shadow-md rounded-lg overflow-hidden">
        {myTags.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No Profiles found</p>
                <p className="text-gray-500 mb-4">Create your first contact to get started</p>
                <Link href="/tags/new">
                  <Button type="primary" icon={<PlusOutlined />}>
                    Create New Contact
                  </Button>
                </Link>
              </div>
            }
            className="my-12"
          />
        ) : (
          <>
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <Text className="text-gray-600">
                    Showing <Badge count={filteredTags.length} showZero style={{ backgroundColor: '#1890ff' }} /> of {myTags.length} Profiles
                  </Text>
                  {(Object.keys(filteredInfo).length > 0 || searchText) && (
                    <Button
                      type="link"
                      size="small"
                      onClick={clearAll}
                      className="text-blue-500"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Text className="text-gray-600 mr-2">Sort by:</Text>
                  <Button
                    size="small"
                    icon={<SortAscendingOutlined />}
                    type={sortedInfo.order === 'ascend' ? 'primary' : 'default'}
                    onClick={() => setSortedInfo({ columnKey: 'contact', order: 'ascend' })}
                  >
                    Name
                  </Button>
                  <Button
                    size="small"
                    icon={<SortDescendingOutlined />}
                    type={sortedInfo.order === 'descend' ? 'primary' : 'default'}
                    onClick={() => setSortedInfo({ columnKey: 'contact', order: 'descend' })}
                  >
                    Name
                  </Button>
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredTags}
              rowKey="id"
              onChange={handleTableChange}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                className: "px-4 py-3"
              }}
              className="w-full contact-table"
              bordered={false}
              rowClassName="hover:bg-gray-50"
              showSorterTooltip={false}
            />
          </>
        )}
      </Card>

      <style jsx global>{`
        .contact-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .contact-table .ant-table-tbody > tr:hover > td {
          background-color: #f3f4f6;
        }

        .contact-table .ant-table-tbody > tr > td {
          padding: 16px;
        }

        .contact-table .ant-table-container {
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
